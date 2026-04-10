import { ApiResponse, ApiError } from '../../common/index.js'
import { JOB_STATUS, COMPANY_STATUS } from '../../common/constants.js'
import { Job, Company, User, SavedJob } from '../../models/index.js'

// ============================================
// Allowed status transitions cho HR
// ============================================
const HR_STATUS_TRANSITIONS = {
  [JOB_STATUS.DRAFT]: [JOB_STATUS.PENDING, JOB_STATUS.PUBLISHED], // Có thể submit duyệt hoặc publish thẳng
  [JOB_STATUS.PENDING]: [JOB_STATUS.PUBLISHED, JOB_STATUS.DRAFT], // Có thể hủy duyệt về draft hoặc publish luôn
  [JOB_STATUS.PUBLISHED]: [JOB_STATUS.CLOSED],                    // HR đóng tin
  [JOB_STATUS.CLOSED]: [JOB_STATUS.PUBLISHED],                    // HR mở lại tin
}

const jobController = {
  /**
   * GET /jobs — Lấy danh sách jobs (Public) với search & cursor-based pagination
   */
  searchJobs: async (req, res) => {
    const {
      keyword,
      location,
      employmentType,
      experienceLevel,
      salaryMin,
      cursor,
      limit = 10,
    } = req.query

    // 1. Base query: Chỉ lấy jobs đã publish
    const query = { status: JOB_STATUS.PUBLISHED }

    // 2. Build filters
    if (keyword) {
      query.$text = { $search: keyword }
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' }
    }
    if (employmentType) {
      query.employmentType = employmentType
    }
    if (experienceLevel) {
      query.experienceLevel = experienceLevel
    }
    if (salaryMin !== undefined) {
      query.$or = [
        { 'salaryRange.min': { $gte: Number(salaryMin) } },
        { 'salaryRange.max': { $gte: Number(salaryMin) } },
      ]
    }

    // 3. Cursor pagination (sort _id desc — mới nhất lên đầu)
    if (cursor) {
      query._id = { $lt: cursor }
    }

    // 4. Fetch limit + 1 để xác định hasNextPage
    const fetchLimit = Number(limit) + 1

    const jobs = await Job.find(query)
      .populate('companyId', 'name logo location industry companySize')
      .sort({ _id: -1 })
      .limit(fetchLimit)
      .lean()

    // 5. Pagination state
    const hasNextPage = jobs.length === fetchLimit
    const data = hasNextPage ? jobs.slice(0, -1) : jobs
    const nextCursor = data.length > 0 ? data[data.length - 1]._id : null

    ApiResponse.success(res, {
      message: 'Lấy danh sách việc làm thành công',
      data,
      meta: { nextCursor, hasNextPage, limit: Number(limit) },
    })
  },

  /**
   * POST /jobs — HR tạo job mới (status = draft)
   */
  create: async (req, res) => {
    const user = await User.findById(req.user.userId).select('companyId')
    if (!user?.companyId) {
      throw ApiError.badRequest('Bạn chưa thuộc công ty nào. Hãy tạo hoặc được thêm vào công ty trước.')
    }

    const job = await Job.create({
      ...req.body,
      companyId: user.companyId,
      createdByHR: req.user.userId,
      status: JOB_STATUS.DRAFT,
    })

    ApiResponse.created(res, {
      message: 'Tạo tin tuyển dụng thành công',
      data: job,
    })
  },

  /**
   * GET /jobs/:id — Lấy chi tiết job (public)
   */
  getById: async (req, res) => {
    const job = await Job.findById(req.params.id)
      .populate('companyId', 'name logo location industry companySize')
      .populate('createdByHR', 'profile.fullName profile.avatar')
      .lean()

    if (!job) {
      throw ApiError.notFound('Không tìm thấy tin tuyển dụng')
    }

    ApiResponse.success(res, { data: job })
  },

  /**
   * PUT /jobs/:id — HR cập nhật job (chỉ khi status = draft)
   */
  update: async (req, res) => {
    const job = await Job.findById(req.params.id)

    if (!job) {
      throw ApiError.notFound('Không tìm thấy tin tuyển dụng')
    }

    if (job.createdByHR.toString() !== req.user.userId) {
      throw ApiError.forbidden('Bạn chỉ có thể chỉnh sửa tin tuyển dụng do mình tạo')
    }

    if (job.status !== JOB_STATUS.DRAFT) {
      throw ApiError.badRequest(
        `Chỉ có thể chỉnh sửa tin ở trạng thái "${JOB_STATUS.DRAFT}". Trạng thái hiện tại: "${job.status}"`
      )
    }

    Object.assign(job, req.body)
    await job.save()

    ApiResponse.success(res, {
      message: 'Cập nhật tin tuyển dụng thành công',
      data: job,
    })
  },

  /**
   * DELETE /jobs/:id — HR xóa job (chỉ khi status = draft)
   */
  remove: async (req, res) => {
    const job = await Job.findById(req.params.id)

    if (!job) {
      throw ApiError.notFound('Không tìm thấy tin tuyển dụng')
    }

    if (job.createdByHR.toString() !== req.user.userId) {
      throw ApiError.forbidden('Bạn chỉ có thể xóa tin tuyển dụng do mình tạo')
    }

    if (job.status !== JOB_STATUS.DRAFT) {
      throw ApiError.badRequest('Chỉ có thể xóa tin ở trạng thái draft')
    }

    await job.deleteOne()

    ApiResponse.success(res, { message: 'Xóa tin tuyển dụng thành công' })
  },

  /**
   * PATCH /jobs/:id/status — HR chuyển trạng thái
   */
  updateStatus: async (req, res) => {
    const { status: newStatus } = req.body

    const job = await Job.findById(req.params.id)
    if (!job) {
      throw ApiError.notFound('Không tìm thấy tin tuyển dụng')
    }

    if (job.createdByHR.toString() !== req.user.userId) {
      throw ApiError.forbidden('Bạn chỉ có thể thay đổi trạng thái tin tuyển dụng do mình tạo')
    }

    const allowedTransitions = HR_STATUS_TRANSITIONS[job.status]
    if (!allowedTransitions || !allowedTransitions.includes(newStatus)) {
      throw ApiError.badRequest(
        `Không thể chuyển từ "${job.status}" sang "${newStatus}". ` +
        `Trạng thái cho phép: ${allowedTransitions?.join(', ') || 'không có'}`
      )
    }

    // Không cho publish nếu công ty chưa approved
    if (newStatus === JOB_STATUS.PUBLISHED) {
      const company = await Company.findById(job.companyId).select('status').lean()
      if (!company) {
        throw ApiError.badRequest('Không tìm thấy công ty liên kết')
      }
      if (company.status !== COMPANY_STATUS.APPROVED) {
        throw ApiError.badRequest(
          'Công ty chưa được phê duyệt. Không thể publish tin. ' +
          'Vui lòng chờ Admin phê duyệt công ty trước.'
        )
      }
    }

    job.status = newStatus
    await job.save()

    ApiResponse.success(res, {
      message: `Chuyển trạng thái thành "${newStatus}" thành công`,
      data: job,
    })
  },

  /**
   * GET /jobs/my-jobs — HR xem danh sách jobs của mình
   */
  getMyJobs: async (req, res) => {
    const { page = 1, limit = 10, status, sort = '-createdAt' } = req.query
    const skip = (page - 1) * limit

    const query = { createdByHR: req.user.userId }
    if (status) query.status = status

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate('companyId', 'name logo')
        .skip(skip)
        .limit(Number(limit))
        .sort(sort)
        .lean(),
      Job.countDocuments(query),
    ])

    ApiResponse.paginated(res, { data: jobs, page, limit, total })
  },

  // ============================================
  // Saved / Favorite Jobs (Candidate)
  // ============================================

  /**
   * POST /jobs/:id/favorite — Toggle lưu / bỏ lưu job
   *
   * Nếu chưa lưu → tạo SavedJob → isSaved: true
   * Nếu đã lưu   → xóa SavedJob → isSaved: false
   */
  toggleFavorite: async (req, res) => {
    const { id: jobId } = req.params
    const candidateId = req.user.userId

    // Kiểm tra job tồn tại
    const jobExists = await Job.exists({ _id: jobId })
    if (!jobExists) {
      throw ApiError.notFound('Không tìm thấy tin tuyển dụng')
    }

    // Thử xóa — nếu xóa được nghĩa là đang saved → unsave
    const deleted = await SavedJob.findOneAndDelete({ candidateId, jobId })

    if (deleted) {
      return ApiResponse.success(res, {
        message: 'Đã bỏ lưu tin tuyển dụng',
        data: { jobId, isSaved: false },
      })
    }

    // Chưa lưu → tạo mới
    await SavedJob.create({ candidateId, jobId })

    ApiResponse.success(res, {
      message: 'Đã lưu tin tuyển dụng',
      data: { jobId, isSaved: true },
    })
  },

  /**
   * GET /jobs/favorites — Danh sách jobs đã lưu (offset pagination)
   */
  getFavorites: async (req, res) => {
    const { page = 1, limit = 10 } = req.query
    const candidateId = req.user.userId
    const skip = (page - 1) * limit

    const filter = { candidateId }

    const [savedJobs, total] = await Promise.all([
      SavedJob.find(filter)
        .populate({
          path: 'jobId',
          select: 'title location employmentType experienceLevel salaryRange skills status createdAt',
          populate: { path: 'companyId', select: 'name logo location' },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      SavedJob.countDocuments(filter),
    ])

    // Lọc bỏ saved jobs mà job đã bị xóa (jobId = null sau populate)
    const data = savedJobs
      .filter((s) => s.jobId !== null)
      .map((s) => ({
        _id: s._id,
        savedAt: s.createdAt,
        job: s.jobId,
      }))

    ApiResponse.paginated(res, { data, page, limit, total })
  },
}

export default jobController
