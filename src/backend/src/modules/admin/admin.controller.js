import { ApiResponse, ApiError } from '../../common/index.js'
import User from '../../models/User.js'
import { AuditLog } from '../../models/index.js'
import { USER_STATUS } from '../../common/constants.js'

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

  ApiResponse.success(res, {
    data: logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}

export default {
  getUsers,
  toggleBlockUser,
  getAuditLogs,
}
