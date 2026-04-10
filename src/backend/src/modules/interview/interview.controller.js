import { Interview, Application, User } from '../../models/index.js'
import { ApiResponse, ApiError } from '../../common/index.js'
import { APPLICATION_STATUS, INTERVIEW_STATUS } from '../../common/constants.js'
import { sendInterviewInviteEmail, sendInterviewCancelEmail } from '../../utils/email.js'

const interviewController = {
  /**
   * POST /interviews — HR Lên lịch phỏng vấn
   */
  scheduleInterview: async (req, res) => {
    const { applicationId, scheduledAt, type, meetingLink, location, notes, roundNumber, interviewerIds } = req.body
    const hrId = req.user.userId

    // 1. Phân quyền HR
    const hr = await User.findById(hrId).select('companyId').lean()
    if (!hr || !hr.companyId) {
      throw ApiError.forbidden('Bạn không thuộc công ty nào để lên lịch')
    }

    // 2. Tìm Application & Populate data gởi Mail
    const application = await Application.findById(applicationId)
      .populate('candidateId', 'email fullName')
      .populate('jobId', 'title')
      .populate('companyId', 'name')

    if (!application) throw ApiError.notFound('Không tìm thấy đơn ứng tuyển')

    // HR cross-company check
    if (application.companyId._id.toString() !== hr.companyId.toString()) {
      throw ApiError.forbidden('Không thể lên lịch phỏng vấn cho công ty khác')
    }

    // 3. Create Interview
    const interview = await Interview.create({
      applicationId,
      roundNumber,
      scheduledAt,
      interviewerIds,
      type,
      meetingLink,
      location,
      notes,
      status: INTERVIEW_STATUS.SCHEDULED
    })

    // 4. Đổi trạng thái Application -> INTERVIEW_SCHEDULED
    application.status = APPLICATION_STATUS.INTERVIEW_SCHEDULED
    application.statusHistory.push({
      status: APPLICATION_STATUS.INTERVIEW_SCHEDULED,
      changedBy: hrId,
      note: `Lên lịch phỏng vấn vòng ${roundNumber || 1}`,
    })
    await application.save()

    // 5. Bắn Email Gửi Lời Mời
    const candidate = application.candidateId
    const job = application.jobId
    const company = application.companyId

    if (candidate && candidate.email) {
      // Chạy ẩn Async, không block luồng return API
      sendInterviewInviteEmail({
        email: candidate.email,
        candidateName: candidate.fullName,
        jobTitle: job.title,
        companyName: company.name,
        scheduledAt,
        type,
        location,
        meetingLink
      }).catch(err => console.error('Lỗi khi gửi email PM:', err))
    }

    ApiResponse.created(res, {
      message: 'Lên lịch phỏng vấn thành công',
      data: interview
    })
  },

  /**
   * PUT /interviews/:id — Cập nhật/Dời lịch phỏng vấn
   */
  updateInterview: async (req, res) => {
    const { id } = req.params
    const updateData = req.body
    const hrId = req.user.userId

    const hr = await User.findById(hrId).select('companyId').lean()

    const interview = await Interview.findById(id).populate({
      path: 'applicationId',
      populate: [
        { path: 'candidateId', select: 'email fullName' },
        { path: 'jobId', select: 'title' },
        { path: 'companyId', select: 'name' }
      ]
    })

    if (!interview) throw ApiError.notFound('Không tìm thấy cuộc phỏng vấn')
    if (interview.applicationId.companyId._id.toString() !== hr.companyId.toString()) {
      throw ApiError.forbidden('Từ chối quyền truy cập')
    }

    let timeChanged = false
    if (updateData.scheduledAt && new Date(updateData.scheduledAt).getTime() !== new Date(interview.scheduledAt).getTime()) {
      timeChanged = true
    }

    Object.assign(interview, updateData)
    await interview.save()

    // Bắn Email báo dời lịch nếu time đổi
    if (timeChanged) {
       const candidate = interview.applicationId.candidateId
       if (candidate?.email) {
          sendInterviewInviteEmail({
            email: candidate.email,
            candidateName: candidate.fullName,
            jobTitle: interview.applicationId.jobId.title,
            companyName: interview.applicationId.companyId.name,
            scheduledAt: interview.scheduledAt,
            type: interview.type,
            location: interview.location,
            meetingLink: interview.meetingLink
          }).catch(err => console.error('Lỗi khi gửi mail dời lịch:', err))
       }
    }

    ApiResponse.success(res, { message: 'Cập nhật cuộc phỏng vấn thành công', data: interview })
  },

  /**
   * PATCH /interviews/:id/cancel — Hủy lịch
   */
  cancelInterview: async (req, res) => {
    const { id } = req.params
    const hrId = req.user.userId

    const hr = await User.findById(hrId).select('companyId').lean()

    const interview = await Interview.findById(id).populate({
      path: 'applicationId',
      populate: [
        { path: 'candidateId', select: 'email fullName' },
        { path: 'jobId', select: 'title' },
        { path: 'companyId', select: 'name' }
      ]
    })

    if (!interview) throw ApiError.notFound('Không tìm thấy cuộc phỏng vấn')
    if (interview.applicationId.companyId._id.toString() !== hr.companyId.toString()) {
      throw ApiError.forbidden('Từ chối quyền truy cập')
    }
    if (interview.status === INTERVIEW_STATUS.CANCELLED) {
      throw ApiError.badRequest('Cuộc phỏng vấn này đã bị hủy trước đó rồi')
    }

    // Đánh dấu Hủy
    interview.status = INTERVIEW_STATUS.CANCELLED
    await interview.save()

    // Bắn Email báo HỦY
    const candidate = interview.applicationId.candidateId
    if (candidate?.email) {
      sendInterviewCancelEmail({
        email: candidate.email,
        candidateName: candidate.fullName,
        jobTitle: interview.applicationId.jobId.title,
        companyName: interview.applicationId.companyId.name,
        scheduledAt: interview.scheduledAt
      }).catch(err => console.error('Lỗi khi gửi mail hủy PV:', err))
    }

    ApiResponse.success(res, { message: 'Hủy lịch phỏng vấn thành công', data: interview })
  },

  /**
   * PATCH /interviews/:id/feedback — HR điền Report và Điểm
   */
  submitFeedback: async (req, res) => {
    const { id } = req.params
    const { score, result, notes } = req.body
    const hrId = req.user.userId

    // 1. Phân quyền HR (Check CompanyID)
    const hr = await User.findById(hrId).select('companyId').lean()
    if (!hr || !hr.companyId) {
      throw ApiError.forbidden('Bạn không thuộc công ty nào để chấm điểm')
    }

    // 2. Tìm buổi phỏng vấn
    const interview = await Interview.findById(id).populate({
      path: 'applicationId',
      select: 'companyId'
    })

    if (!interview) {
      throw ApiError.notFound('Không tìm thấy buổi phỏng vấn này')
    }

    if (interview.applicationId.companyId.toString() !== hr.companyId.toString()) {
      throw ApiError.forbidden('Không có quyền đánh giá phỏng vấn của công ty khác')
    }

    // 3. Update data
    interview.score = score
    interview.result = result
    if (notes !== undefined) {
      interview.notes = notes
    }

    await interview.save()

    ApiResponse.success(res, {
      message: 'Lưu báo cáo phỏng vấn thành công',
      data: interview
    })
  }
}

export default interviewController
