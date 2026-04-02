import { ApiResponse, ApiError } from '../../common/index.js'
import User from '../../models/User.js'
import Company from '../../models/Company.js'
import { USER_STATUS, COMPANY_STATUS } from '../../common/constants.js'

const getUsers = async (req, res) => {
  const { page, limit, role, status, keyword, sort } = req.query

  const query = {}

  if (role) {
    query.role = role
  }

  if (status) {
    query.status = status
  }

  if (keyword) {
    query.$or = [
      { email: { $regex: keyword, $options: 'i' } },
      { 'profile.fullName': { $regex: keyword, $options: 'i' } },
    ]
  }

  const skip = (page - 1) * limit

  const [users, total] = await Promise.all([
    User.find(query)
      .select('-passwordHash -__v')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(query),
  ])

  ApiResponse.success(res, {
    data: users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}

const toggleBlockUser = async (req, res) => {
  const { id } = req.params

  if (req.user.id === id) {
    throw new ApiError(400, 'Bạn không thể tự khóa tài khoản của chính mình')
  }

  const user = await User.findById(id)
  if (!user) {
    throw new ApiError(404, 'Không tìm thấy người dùng')
  }

  // Chuyển đổi trạng thái
  user.status = user.status === USER_STATUS.ACTIVE ? USER_STATUS.BLOCKED : USER_STATUS.ACTIVE
  
  await user.save()

  // Lưu ý: Trong hệ thống thực tế cần thu hồi token hoặc ép logout 
  // nếu user bị block đang đăng nhập (có thể dùng Redis blacklist token ở middleware).

  ApiResponse.success(res, { 
    message: `Đã ${user.status === USER_STATUS.BLOCKED ? 'khóa' : 'mở khóa'} tài khoản thành công`,
    user: {
      id: user._id,
      email: user.email,
      status: user.status
    }
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
  getPendingCompanies,
  approveCompany,
  rejectCompany,
  lockCompany,
}
