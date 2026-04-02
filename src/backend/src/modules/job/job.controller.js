import { ApiResponse, ApiError } from '../../common/index.js'
import { JOB_STATUS, COMPANY_STATUS } from '../../common/constants.js'
import { Job, Company, User } from '../../models/index.js'

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
      // Dùng MongoDB text index cho kết quả keyword
      query.$text = { $search: keyword }
    }
    if (location) {
      // Regex case-insensitive để tìm địa điểm có tính tương đối
      query.location = { $regex: location, $options: 'i' }
    }
    if (employmentType) {
      query.employmentType = employmentType
    }
    if (experienceLevel) {
      query.experienceLevel = experienceLevel
    }
    if (salaryMin !== undefined) {
      // Logic requirement: job's max salary must be >= candidate's minimum expected salary
      // Or simply job's salary range intersects with expected min
      query.$or = [
        { 'salaryRange.min': { $gte: Number(salaryMin) } },
        { 'salaryRange.max': { $gte: Number(salaryMin) } },
      ]
    }

    // 3. Apply Cursor Pagination
    // Vì ta sort theo descending (_id: -1) (Mới nhất lên đầu)
    // Next page sẽ có _id NHỎ HƠN cursor hiện tại.
    if (cursor) {
      query._id = { $lt: cursor }
    }

    // 4. Thực thi Query
    // Khuyến nghị: Fetch limit + 1 records để biết liệu có trang tiếp theo (hasNextPage) hay không
    const fetchLimit = Number(limit) + 1

    const jobs = await Job.find(query)
      .populate('companyId', 'name logo location industry companySize')
      .sort({ _id: -1 })
      .limit(fetchLimit)
      .lean()

    // 5. Tính toán Pagination state
    const hasNextPage = jobs.length === fetchLimit
    // Xóa record phụ trội đã fetch mồi
    const data = hasNextPage ? jobs.slice(0, -1) : jobs

    const nextCursor = data.length > 0 ? data[data.length - 1]._id : null

    ApiResponse.success(res, {
      message: 'Lấy danh sách việc làm thành công',
      data,
      meta: {
        nextCursor,
        hasNextPage,
        limit: Number(limit),
      },
    })
  },
  /**
   * POST /jobs — HR tạo job mới (status = draft)
   */
  create: async (req, res) => {
    // Lấy user để có companyId (JWT chỉ chứa userId, role, email)
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

    // Chỉ HR tạo job mới được sửa
    if (job.createdByHR.toString() !== req.user.userId) {
      throw ApiError.forbidden('Bạn chỉ có thể chỉnh sửa tin tuyển dụng do mình tạo')
    }

    // Chỉ cho phép sửa khi draft
    if (job.status !== JOB_STATUS.DRAFT) {
      throw ApiError.badRequest(
        `Chỉ có thể chỉnh sửa tin ở trạng thái "${JOB_STATUS.DRAFT}". Trạng thái hiện tại: "${job.status}"`
      )
    }

    // Cập nhật fields
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

    // Chỉ HR tạo job mới được xóa
    if (job.createdByHR.toString() !== req.user.userId) {
      throw ApiError.forbidden('Bạn chỉ có thể xóa tin tuyển dụng do mình tạo')
    }

    // Chỉ cho phép xóa khi draft
    if (job.status !== JOB_STATUS.DRAFT) {
      throw ApiError.badRequest('Chỉ có thể xóa tin ở trạng thái draft')
    }

    await job.deleteOne()

    ApiResponse.success(res, { message: 'Xóa tin tuyển dụng thành công' })
  },

  /**
   * PATCH /jobs/:id/status — HR chuyển trạng thái
   * draft -> pending (submit for review): cần company đã approved
   * published -> closed (HR đóng tin)
   */
  updateStatus: async (req, res) => {
    const { status: newStatus } = req.body

    const job = await Job.findById(req.params.id)
    if (!job) {
      throw ApiError.notFound('Không tìm thấy tin tuyển dụng')
    }

    // Chỉ HR tạo job mới được đổi status
    if (job.createdByHR.toString() !== req.user.userId) {
      throw ApiError.forbidden('Bạn chỉ có thể thay đổi trạng thái tin tuyển dụng do mình tạo')
    }

    // Kiểm tra transition hợp lệ
    const allowedTransitions = HR_STATUS_TRANSITIONS[job.status]
    if (!allowedTransitions || !allowedTransitions.includes(newStatus)) {
      throw ApiError.badRequest(
        `Không thể chuyển từ "${job.status}" sang "${newStatus}". ` +
        `Trạng thái cho phép: ${allowedTransitions?.join(', ') || 'không có'}`
      )
    }

    // Business Logic: Khóa không cho publish nếu Cty chưa Approved
    if (newStatus === JOB_STATUS.PUBLISHED) {
      const company = await Company.findById(job.companyId).select('status').lean()
      if (!company) {
        throw ApiError.badRequest('Không tìm thấy công ty liên kết')
      }
      if (company.status !== COMPANY_STATUS.APPROVED) {
        throw ApiError.badRequest(
          'Công ty chưa được phê duyệt. Không thể chuyển trạng thái tin tuyển dụng sang "Published". ' +
          'Vui lòng chờ Admin phê duyệt công ty trước khi public tin.'
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
   * GET /jobs/my-jobs — HR xem danh sách jobs của mình (tất cả status)
   */
  getMyJobs: async (req, res) => {
    const { page = 1, limit = 10, status, sort = '-createdAt' } = req.query
    const skip = (page - 1) * limit

    // Build query
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

}

export default jobController
