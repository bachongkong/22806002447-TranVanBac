import { Application, Job } from '../../models/index.js'
import { ApiResponse, ApiError } from '../../common/index.js'
import { JOB_STATUS } from '../../common/constants.js'

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
  }
}

export default applicationController
