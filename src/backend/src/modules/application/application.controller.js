import { Application, Job, User } from '../../models/index.js'
import { ApiResponse, ApiError } from '../../common/index.js'
import { APPLICATION_STATUS, JOB_STATUS } from '../../common/constants.js'

const applicationController = {
  /**
   * POST /applications — Candidate ứng tuyển
   */
  applyJob: async (req, res) => {
    const { jobId, cvId, coverLetter } = req.body
    const candidateId = req.user.userId

    // 1. Kiểm tra Job có tồn tại và đang PUBLISHED không
    const job = await Job.findById(jobId).select('status companyId').lean()
    
    if (!job) {
      throw ApiError.notFound('Không tìm thấy công việc này')
    }

    if (job.status !== JOB_STATUS.PUBLISHED) {
      throw ApiError.badRequest('Công việc này đã đóng hoặc chưa được phép ứng tuyển')
    }

    // 2. Tạo Application record
    try {
      const application = await Application.create({
        candidateId,
        jobId,
        companyId: job.companyId, // Từ db Job ánh xạ qua
        cvId,
        coverLetter,
      })

      ApiResponse.created(res, {
        message: 'Ứng tuyển thành công',
        data: application
      })
    } catch (error) {
      // 3. Bắt lỗi Unique Index (Chống trùng data trên MongoDB)
      if (error.code === 11000) {
        throw ApiError.badRequest('Bạn đã ứng tuyển vào công việc này rồi')
      }
      throw error 
    }
  },

  /**
   * PATCH /applications/:id/withdraw — Candidate rút đơn
   */
  withdrawApplication: async (req, res) => {
    const { id } = req.params
    const { note = 'Candidate withdrew application' } = req.body
    const userId = req.user.userId

    const application = await Application.findOne({ _id: id, candidateId: userId })
    if (!application) {
      throw ApiError.notFound('Không tìm thấy đơn ứng tuyển')
    }

    // Không cho phép rút đơn nếu đã đậu/rớt/đã rút
    const restrictedStatuses = [
      APPLICATION_STATUS.HIRED,
      APPLICATION_STATUS.REJECTED,
      APPLICATION_STATUS.WITHDRAWN,
    ]
    if (restrictedStatuses.includes(application.status)) {
      throw ApiError.badRequest(`Không thể rút đơn khi trạng thái hiện tại là: ${application.status}`)
    }

    application.status = APPLICATION_STATUS.WITHDRAWN
    application.statusHistory.push({
      status: APPLICATION_STATUS.WITHDRAWN,
      changedBy: userId,
      note,
    })

    await application.save()

    ApiResponse.success(res, {
      message: 'Rút đơn ứng tuyển thành công',
      data: application,
    })
  },

  /**
   * PATCH /applications/:id/status — HR đổi status đơn
   */
  updateStatus: async (req, res) => {
    const { id } = req.params
    const { status: newStatus, note = '' } = req.body
    const hrId = req.user.userId

    // 1. Lấy HR companyId để phân quyền
    const hr = await User.findById(hrId).select('companyId').lean()
    if (!hr || !hr.companyId) {
      throw ApiError.forbidden('Bạn không thuộc công ty nào để duyệt đơn')
    }

    // 2. Tìm đơn ứng tuyển
    const application = await Application.findById(id)
    if (!application) {
      throw ApiError.notFound('Không tìm thấy đơn ứng tuyển')
    }

    // 3. Phân quyền: HR chỉ sửa đơn của công ty mình
    if (application.companyId.toString() !== hr.companyId.toString()) {
      throw ApiError.forbidden('Bạn không có quyền chuyển trạng thái đơn ứng tuyển của công ty khác')
    }

    // 4. Update status & push history
    if (application.status === newStatus) {
      throw ApiError.badRequest(`Đơn đang ở trạng thái ${newStatus} sẵn rồi`)
    }

    application.status = newStatus
    application.statusHistory.push({
      status: newStatus,
      changedBy: hrId,
      note,
    })

    await application.save()

    ApiResponse.success(res, {
      message: `Đổi trạng thái ứng tuyển thành ${newStatus} thành công`,
      data: application,
    })
  },

  /**
   * GET /applications/by-job/:jobId — HR xem danh sách ứng viên theo job
   */
  getApplicationsByJob: async (req, res) => {
    const { jobId } = req.params
    const hrId = req.user.userId

    // 1. Phân quyền: HR chỉ xem đơn thuộc công ty mình
    const hr = await User.findById(hrId).select('companyId').lean()
    if (!hr || !hr.companyId) {
      throw ApiError.forbidden('Bạn không thuộc công ty nào')
    }

    // 2. Kiểm tra job thuộc công ty HR
    const job = await Job.findById(jobId).select('companyId title').lean()
    if (!job) {
      throw ApiError.notFound('Không tìm thấy tin tuyển dụng')
    }
    if (job.companyId.toString() !== hr.companyId.toString()) {
      throw ApiError.forbidden('Bạn không có quyền xem ứng viên của tin tuyển dụng này')
    }

    // 3. Lấy applications
    const applications = await Application.find({ jobId })
      .populate('candidateId', 'email profile.fullName profile.avatar profile.phone')
      .populate('cvId', 'title sourceType fileUrl')
      .sort({ appliedAt: -1 })
      .lean()

    ApiResponse.success(res, {
      message: 'Lấy danh sách ứng viên thành công',
      data: applications,
      meta: { jobTitle: job.title, total: applications.length },
    })
  },
}

export default applicationController
