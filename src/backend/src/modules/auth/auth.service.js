import User from '../../models/User.js'
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt.js'
import { ApiError } from '../../common/index.js'

const authService = {
  /**
   * Đăng ký tài khoản mới
   * @param {{ email, password, fullName, role }} body
   * @returns {{ user, accessToken, refreshToken }}
   */
  register: async ({ email, password, fullName, role }) => {
    // Kiểm tra email đã tồn tại chưa
    const existing = await User.findOne({ email })
    if (existing) {
      throw ApiError.conflict('Email đã được sử dụng')
    }

    // Tạo user — password sẽ được hash tự động bởi pre-save hook
    const user = await User.create({
      email,
      passwordHash: password,
      role,
      profile: { fullName },
    })

    // Generate tokens
    const payload = { userId: user._id, role: user.role, email: user.email }
    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken(payload)

    // Lưu refresh token vào DB (hashed không cần thiết vì đã là jwt)
    user.refreshToken = refreshToken
    await user.save()

    // Trả về user đã lọc bỏ fields nhạy cảm
    const safeUser = {
      _id: user._id,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      profile: {
        fullName: user.profile.fullName,
        avatar: user.profile.avatar,
      },
      createdAt: user.createdAt,
    }

    return { user: safeUser, accessToken, refreshToken }
  },
}

export default authService
