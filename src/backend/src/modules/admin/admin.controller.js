import { Readable } from 'stream'
import csvParser from 'csv-parser'
import { ApiResponse, ApiError } from '../../common/index.js'
import User from '../../models/User.js'
import Company from '../../models/Company.js'
import { Job, MasterData, AuditLog } from '../../models/index.js'
import { USER_STATUS, JOB_STATUS, COMPANY_STATUS } from '../../common/constants.js'
import { writeAuditLog } from '../../utils/auditLogger.js'

// ============================================
// BE-ADM-01: User Moderation
// ============================================

const getUsers = async (req, res) => {
  const { page, limit, role, status, keyword, sort } = req.query
  const query = {}
  if (role) query.role = role
  if (status) query.status = status
  if (keyword) {
    query.$or = [
      { email: { $regex: keyword, $options: 'i' } },
      { 'profile.fullName': { $regex: keyword, $options: 'i' } },
    ]
  }
  const skip = (page - 1) * limit
  const [users, total] = await Promise.all([
    User.find(query).select('-passwordHash -__v').sort(sort).skip(skip).limit(limit).lean(),
    User.countDocuments(query),
  ])
  ApiResponse.success(res, {
    data: users,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
}

const toggleBlockUser = async (req, res) => {
  const { id } = req.params
  const { reason = '' } = req.body

  if (String(req.user._id || req.user.id) === id) {
    throw new ApiError(400, 'Bạn không thể tự khóa tài khoản của chính mình')
  }

  const user = await User.findById(id)
  if (!user) throw new ApiError(404, 'Không tìm thấy người dùng')

  const prevStatus = user.status
  user.status = user.status === USER_STATUS.ACTIVE ? USER_STATUS.BLOCKED : USER_STATUS.ACTIVE
  await user.save()

  writeAuditLog({
    action: user.status === USER_STATUS.BLOCKED ? 'BLOCK_USER' : 'UNBLOCK_USER',
    req,
    resourceType: 'User',
    resourceId: user._id,
    details: { prevStatus, newStatus: user.status, reason },
  })

  ApiResponse.success(res, {
    message: `Đã ${user.status === USER_STATUS.BLOCKED ? 'khóa' : 'mở khóa'} tài khoản thành công`,
    user: { id: user._id, email: user.email, status: user.status },
  })
}

// ============================================
// BE-ADM-01: Job Moderation (Ban/Approve jobs)
// ============================================

const getJobsPending = async (req, res) => {
  const jobs = await Job.find({ status: JOB_STATUS.PENDING })
    .populate('companyId', 'name')
    .populate('createdByHR', 'email profile.fullName')
    .lean()
  ApiResponse.success(res, { data: jobs })
}

const approveJob = async (req, res) => {
  const { id } = req.params
  const job = await Job.findById(id)
  if (!job) throw new ApiError(404, 'Không tìm thấy tin tuyển dụng')
  if (job.status !== JOB_STATUS.PENDING) {
    throw new ApiError(400, 'Tin tuyển dụng không ở trạng thái chờ duyệt')
  }
  job.status = JOB_STATUS.PUBLISHED
  await job.save()

  writeAuditLog({
    action: 'APPROVE_JOB',
    req,
    resourceType: 'Job',
    resourceId: job._id,
    details: { title: job.title },
  })

  ApiResponse.success(res, { message: 'Đã duyệt tin tuyển dụng thành công', job: { id: job._id, status: job.status } })
}

const rejectJob = async (req, res) => {
  const { id } = req.params
  const { reason = '' } = req.body
  const job = await Job.findById(id)
  if (!job) throw new ApiError(404, 'Không tìm thấy tin tuyển dụng')

  job.status = JOB_STATUS.REJECTED
  await job.save()

  writeAuditLog({
    action: 'REJECT_JOB',
    req,
    resourceType: 'Job',
    resourceId: job._id,
    details: { title: job.title, reason },
  })

  ApiResponse.success(res, { message: 'Đã từ chối tin tuyển dụng', job: { id: job._id, status: job.status } })
}

// ============================================
// BE-ADM-02: Audit Log Reading
// ============================================

const getAuditLogs = async (req, res) => {
  const { page, limit, action, userId, startDate, endDate, sort } = req.query
  const query = {}
  if (action) query.action = action
  if (userId) query.userId = userId
  if (startDate || endDate) {
    query.createdAt = {}
    if (startDate) query.createdAt.$gte = new Date(startDate)
    if (endDate) query.createdAt.$lte = new Date(endDate)
  }
  const skip = (page - 1) * limit
  const [logs, total] = await Promise.all([
    AuditLog.find(query).populate('userId', 'email profile.fullName role').sort(sort).skip(skip).limit(limit).lean(),
    AuditLog.countDocuments(query),
  ])
  ApiResponse.success(res, {
    data: logs,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
}

// ============================================
// BE-ADM-03: Import Master Data via CSV Stream
// ============================================

/**
 * Parse CSV buffer bằng Node.js Readable Stream + csv-parser
 * Tránh load toàn bộ file vào RAM (chống Leak RAM cho file lớn)
 */
const parseCsvStream = (buffer) => {
  return new Promise((resolve, reject) => {
    const rows = []
    Readable.from(buffer)
      .pipe(csvParser({ trim: true }))
      .on('data', (row) => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', reject)
  })
}

const importMasterData = async (req, res) => {
  if (!req.file) throw new ApiError(400, 'Vui lòng upload file CSV')

  const rows = await parseCsvStream(req.file.buffer)
  if (rows.length === 0) throw new ApiError(400, 'File CSV trống hoặc không chứa data hợp lệ')

  // Dùng bulkWrite với upsert để bỏ qua duplicate và cập nhật nếu đã tồn tại
  const ops = rows
    .filter(r => r.type && r.value && r.label)
    .map(r => ({
      updateOne: {
        filter: { type: r.type.trim(), value: r.value.trim() },
        update: {
          $set: {
            label: r.label.trim(),
            isActive: r.isActive !== 'false' && r.isActive !== '0',
          },
        },
        upsert: true,
      },
    }))

  if (ops.length === 0) throw new ApiError(400, 'Không có dòng hợp lệ (cần cột: type, value, label)')

  const result = await MasterData.bulkWrite(ops, { ordered: false })

  writeAuditLog({
    action: 'IMPORT_MASTER_DATA',
    req,
    resourceType: 'MasterData',
    details: {
      filename: req.file.originalname,
      totalRows: rows.length,
      upserted: result.upsertedCount,
      modified: result.modifiedCount,
    },
  })

  ApiResponse.success(res, {
    message: 'Import Master Data thành công',
    stats: {
      totalRows: rows.length,
      validRows: ops.length,
      upserted: result.upsertedCount,
      modified: result.modifiedCount,
    },
  })
}

// ============================================
// Company Moderation
// ============================================

const getPendingCompanies = async (req, res) => {
  const { page, limit } = req.query
  const skip = (page - 1) * limit

  const filter = { status: COMPANY_STATUS.PENDING }

  const [companies, total] = await Promise.all([
    Company.find(filter)
      .populate('createdBy', 'email profile.fullName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Company.countDocuments(filter),
  ])

  ApiResponse.paginated(res, {
    data: companies,
    page,
    limit,
    total,
  })
}

/**
 * Helper: cập nhật trạng thái company
 */
const updateCompanyStatus = async (req, res, newStatus, successMessage) => {
  const { id } = req.params

  const company = await Company.findById(id)
  if (!company) {
    throw ApiError.notFound('Không tìm thấy công ty')
  }

  company.status = newStatus
  await company.save()

  ApiResponse.success(res, {
    message: successMessage,
    data: {
      _id: company._id,
      name: company.name,
      status: company.status,
    },
  })
}

const approveCompany = async (req, res) => {
  await updateCompanyStatus(req, res, COMPANY_STATUS.APPROVED, 'Đã duyệt công ty thành công')
}

const rejectCompany = async (req, res) => {
  await updateCompanyStatus(req, res, COMPANY_STATUS.REJECTED, 'Đã từ chối công ty')
}

const lockCompany = async (req, res) => {
  await updateCompanyStatus(req, res, COMPANY_STATUS.LOCKED, 'Đã khóa công ty')
}

export default {
  getUsers,
  toggleBlockUser,
  getJobsPending,
  approveJob,
  rejectJob,
  getAuditLogs,
  importMasterData,
  getPendingCompanies,
  approveCompany,
  rejectCompany,
  lockCompany,
}
