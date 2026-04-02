import { ApiResponse, ApiError } from '../../common/index.js'
import User from '../../models/User.js'
import { MasterData } from '../../models/index.js'
import { USER_STATUS } from '../../common/constants.js'
import { parse } from 'csv-parse/sync'

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

const importMasterData = async (req, res) => {
  if (!req.file) throw new ApiError(400, 'Vui lòng upload file CSV');
  
  try {
    const rawString = req.file.buffer.toString('utf-8');
    const records = parse(rawString, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const documents = records.map(r => ({
      type: r.type,
      value: r.value,
      label: r.label,
      isActive: r.isActive !== 'false' && r.isActive !== '0'
    }));

    if (documents.length === 0) {
      throw new ApiError(400, 'File CSV trống hoặc không chứa data hợp lệ');
    }

    try {
      await MasterData.insertMany(documents, { ordered: false });
    } catch(e) {
       // Code 11000 is for unique violation across indices. It bypasses successfully allowing partial updates.
       if (e.code !== 11000) {
          throw e;
       }
    }

    ApiResponse.success(res, {
      message: `Quá trình phân tích CSV và import hệ thống thành công!`,
      processedCount: documents.length
    });
  } catch (err) {
    throw new ApiError(400, 'Lỗi xử lý file CSV: ' + err.message);
  }
}

export default {
  getUsers,
  toggleBlockUser,
  importMasterData,
}
