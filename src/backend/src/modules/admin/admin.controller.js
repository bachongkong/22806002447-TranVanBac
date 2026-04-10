import { Readable, Transform } from 'stream'
import csvParser from 'csv-parser'
import { stringify } from 'csv-stringify'
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

  ApiResponse.paginated(res, { data: users, page, limit, total })
}

const toggleBlockUser = async (req, res) => {
  const { id } = req.params
  const { reason = '' } = req.body

  if (String(req.user._id || req.user.id) === id) {
    throw new ApiError(400, 'Báº¡n khÃ´ng thá»ƒ tá»± khÃ³a tÃ i khoáº£n cá»§a chÃ­nh mÃ¬nh')
  }

  const user = await User.findById(id)
  if (!user) throw new ApiError(404, 'KhÃ´ng tÃ¬m tháº¥y ngÆ°á»i dÃ¹ng')

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
    message: `ÄÃ£ ${user.status === USER_STATUS.BLOCKED ? 'khÃ³a' : 'má»Ÿ khÃ³a'} tÃ i khoáº£n thÃ nh cÃ´ng`,
    data: {
      user: {
        id: user._id,
        email: user.email,
        status: user.status,
      },
    },
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

  if (!job) throw new ApiError(404, 'KhÃ´ng tÃ¬m tháº¥y tin tuyá»ƒn dá»¥ng')
  if (job.status !== JOB_STATUS.PENDING) {
    throw new ApiError(400, 'Tin tuyá»ƒn dá»¥ng khÃ´ng á»Ÿ tráº¡ng thÃ¡i chá» duyá»‡t')
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

  ApiResponse.success(res, {
    message: 'ÄÃ£ duyá»‡t tin tuyá»ƒn dá»¥ng thÃ nh cÃ´ng',
    data: {
      job: {
        id: job._id,
        status: job.status,
      },
    },
  })
}

const rejectJob = async (req, res) => {
  const { id } = req.params
  const { reason = '' } = req.body
  const job = await Job.findById(id)

  if (!job) throw new ApiError(404, 'KhÃ´ng tÃ¬m tháº¥y tin tuyá»ƒn dá»¥ng')

  job.status = JOB_STATUS.REJECTED
  await job.save()

  writeAuditLog({
    action: 'REJECT_JOB',
    req,
    resourceType: 'Job',
    resourceId: job._id,
    details: { title: job.title, reason },
  })

  ApiResponse.success(res, {
    message: 'ÄÃ£ tá»« chá»‘i tin tuyá»ƒn dá»¥ng',
    data: {
      job: {
        id: job._id,
        status: job.status,
      },
    },
  })
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
    AuditLog.find(query)
      .populate('userId', 'email profile.fullName role')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    AuditLog.countDocuments(query),
  ])

  ApiResponse.paginated(res, { data: logs, page, limit, total })
}

// ============================================
// BE-ADM-03: Import Master Data via CSV Stream
// ============================================

/**
 * Parse CSV buffer báº±ng Node.js Readable Stream + csv-parser
 * TrÃ¡nh load toÃ n bá»™ file vÃ o RAM (chá»‘ng Leak RAM cho file lá»›n)
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
  if (!req.file) throw new ApiError(400, 'Vui lÃ²ng upload file CSV')

  const rows = await parseCsvStream(req.file.buffer)
  if (rows.length === 0) throw new ApiError(400, 'File CSV trá»‘ng hoáº·c khÃ´ng chá»©a data há»£p lá»‡')

  const ops = rows
    .filter((row) => row.type && row.value && row.label)
    .map((row) => ({
      updateOne: {
        filter: { type: row.type.trim(), value: row.value.trim() },
        update: {
          $set: {
            label: row.label.trim(),
            isActive: row.isActive !== 'false' && row.isActive !== '0',
          },
        },
        upsert: true,
      },
    }))

  if (ops.length === 0) {
    throw new ApiError(400, 'KhÃ´ng cÃ³ dÃ²ng há»£p lá»‡ (cáº§n cá»™t: type, value, label)')
  }

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
    message: 'Import Master Data thÃ nh cÃ´ng',
    data: {
      stats: {
        totalRows: rows.length,
        validRows: ops.length,
        upserted: result.upsertedCount,
        modified: result.modifiedCount,
      },
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

const updateCompanyStatus = async (req, res, newStatus, successMessage) => {
  const { id } = req.params
  const company = await Company.findById(id)

  if (!company) {
    throw ApiError.notFound('KhÃ´ng tÃ¬m tháº¥y cÃ´ng ty')
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
  await updateCompanyStatus(req, res, COMPANY_STATUS.APPROVED, 'ÄÃ£ duyá»‡t cÃ´ng ty thÃ nh cÃ´ng')
}

const rejectCompany = async (req, res) => {
  await updateCompanyStatus(req, res, COMPANY_STATUS.REJECTED, 'ÄÃ£ tá»« chá»‘i cÃ´ng ty')
}

const lockCompany = async (req, res) => {
  await updateCompanyStatus(req, res, COMPANY_STATUS.LOCKED, 'ÄÃ£ khÃ³a cÃ´ng ty')
}

const getDashboardStats = async (req, res) => {
  const [userStats, jobStats, companyStats, recentEntities] = await Promise.all([
    User.aggregate([
      { $group: { _id: { role: '$role', status: '$status' }, count: { $sum: 1 } } }
    ]),
    Job.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]),
    Company.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]),
    Promise.all([
      Company.find({ status: COMPANY_STATUS.PENDING })
        .select('name industry location createdAt')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Job.find({ status: JOB_STATUS.PENDING })
        .populate('companyId', 'name')
        .select('title employmentType createdAt')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]),
  ])

  const formatStats = (aggregates, mapKeyFn) => {
    return aggregates.reduce((accumulator, current) => {
      accumulator[mapKeyFn(current._id)] = current.count
      return accumulator
    }, {})
  }

  const usersFormatted = formatStats(userStats, (id) => `${id.role}_${id.status}`)
  const jobsFormatted = formatStats(jobStats, (id) => id)
  const companiesFormatted = formatStats(companyStats, (id) => id)

  ApiResponse.success(res, {
    data: {
      overview: {
        users: usersFormatted,
        jobs: jobsFormatted,
        companies: companiesFormatted,
      },
      recentPending: {
        companies: recentEntities[0],
        jobs: recentEntities[1],
      },
    },
  })
}

const exportUsers = async (req, res) => {
  const { role, status, keyword, sort } = req.query
  const query = {}

  if (role) query.role = role
  if (status) query.status = status
  if (keyword) {
    query.$or = [
      { email: { $regex: keyword, $options: 'i' } },
      { 'profile.fullName': { $regex: keyword, $options: 'i' } },
    ]
  }

  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename="users-export.csv"')

  writeAuditLog({
    action: 'EXPORT_USERS',
    req,
    resourceType: 'User',
    details: { query }
  })

  const stringifier = stringify({
    header: true,
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'email', header: 'Email' },
      { key: 'fullName', header: 'Full Name' },
      { key: 'role', header: 'Role' },
      { key: 'status', header: 'Status' },
      { key: 'createdAt', header: 'Created At' }
    ]
  })

  const cursor = User.find(query).sort(sort).lean().cursor()

  const transformer = new Transform({
    objectMode: true,
    transform(doc, encoding, callback) {
      callback(null, {
        id: String(doc._id),
        email: doc.email,
        fullName: doc.profile?.fullName || '',
        role: doc.role,
        status: doc.status,
        createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : ''
      })
    }
  })

  cursor.on('error', (error) => {
    console.error('Cursor export error:', error)
    if (!res.headersSent) res.status(500).end('Internal Server Error')
  })

  cursor.pipe(transformer).pipe(stringifier).pipe(res)
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
  getDashboardStats,
  exportUsers,
}
