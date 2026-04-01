import { Interview, User } from '../../models/index.js'
import { ApiResponse, ApiError } from '../../common/index.js'

const interviewController = {
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
