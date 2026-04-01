import { Application, User } from '../../models/index.js'
import { ApiResponse, ApiError } from '../../common/index.js'
import { APPLICATION_STATUS } from '../../common/constants.js'

const applicationController = {
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
}

export default applicationController
