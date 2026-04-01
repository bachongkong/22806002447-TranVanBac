import { ApiResponse, ApiError } from '../../common/index.js'
import { JOB_STATUS } from '../../common/constants.js'
import { Job } from '../../models/index.js'

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
}

export default jobController
