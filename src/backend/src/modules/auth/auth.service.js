import crypto from 'crypto'
import User from '../../models/User.js'
import '../../models/Company.js' // ensure Company model is registered for populate
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt.js'
import { sendVerificationEmail } from '../../utils/email.js'
import { ApiError } from '../../common/index.js'
import { USER_STATUS } from '../../common/constants.js'
import { env } from '../../config/index.js'

/**
 * Tạo email verification token (random hex string)
 * Trả về { raw, hashed } — raw gửi cho user, hashed lưu DB
 */
const createVerificationToken = () => {
  const raw = crypto.randomBytes(32).toString('hex')
  const hashed = crypto.createHash('sha256').update(raw).digest('hex')
  return { raw, hashed }
}

/**
 * Hash token để so sánh với DB
 */
const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex')
}

const authService = {
  /**
   * Đăng ký tài khoản mới + gửi email xác thực
   * @param {{ email, password, fullName, role }} body
   * @returns {{ user, accessToken, refreshToken }}
   */
  register: async ({ email, password, fullName, role }) => {
    // Kiểm tra email đã tồn tại chưa
    const existing = await User.findOne({ email })
    if (existing) {
      throw ApiError.conflict('Email đã được sử dụng')
    }

    // Tạo verification token
    const { raw: verificationToken, hashed: hashedToken } = createVerificationToken()
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h

    // Tạo user — password sẽ được hash tự động bởi pre-save hook
    const user = await User.create({
      email,
      passwordHash: password,
      role,
      profile: { fullName },
      emailVerificationToken: hashedToken,
      emailVerificationExpires: verificationExpires,
    })

    // Generate tokens
    const payload = { userId: user._id, role: user.role, email: user.email }
    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken(payload)

    // Lưu refresh token vào DB
    user.refreshToken = refreshToken
    await user.save()

    // Gửi email xác thực (async, không block response)
    const verificationUrl = `${env.CLIENT_URL}/verify-email?token=${verificationToken}`
    sendVerificationEmail({
      email: user.email,
      fullName,
      verificationUrl,
    }).catch((err) => {
      console.error('[AUTH] Failed to send verification email:', err.message)
    })

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

  /**
   * Xác thực email bằng token
   * @param {string} token — raw token từ URL query
   * @returns {{ user }} — user đã verified
   */
  verifyEmail: async (token) => {
    // Hash token để so với DB
    const hashedToken = hashToken(token)

    // Tìm user có token khớp + chưa hết hạn
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: new Date() },
    }).select('+emailVerificationToken +emailVerificationExpires')

    if (!user) {
      throw ApiError.badRequest('Token không hợp lệ hoặc đã hết hạn')
    }

    // Kiểm tra nếu đã verified rồi
    if (user.isEmailVerified) {
      throw ApiError.badRequest('Email đã được xác thực trước đó')
    }

    // Cập nhật trạng thái verified
    user.isEmailVerified = true
    user.emailVerificationToken = undefined
    user.emailVerificationExpires = undefined
    await user.save()

    const safeUser = {
      _id: user._id,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      profile: {
        fullName: user.profile.fullName,
        avatar: user.profile.avatar,
      },
    }

    return { user: safeUser }
  },

  /**
   * Gửi lại email xác thực
   * @param {string} email
   */
  resendVerification: async (email) => {
    const user = await User.findOne({ email })
      .select('+emailVerificationToken +emailVerificationExpires')

    if (!user) {
      throw ApiError.notFound('Không tìm thấy tài khoản với email này')
    }

    if (user.isEmailVerified) {
      throw ApiError.badRequest('Email đã được xác thực trước đó')
    }

    // Tạo token mới
    const { raw: verificationToken, hashed: hashedToken } = createVerificationToken()
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h

    user.emailVerificationToken = hashedToken
    user.emailVerificationExpires = verificationExpires
    await user.save()

    // Gửi email xác thực
    const verificationUrl = `${env.CLIENT_URL}/verify-email?token=${verificationToken}`
    await sendVerificationEmail({
      email: user.email,
      fullName: user.profile.fullName,
      verificationUrl,
    })

    return { message: 'Email xác thực đã được gửi lại' }
  },

  /**
   * Đăng nhập — xác thực credentials, trả về token pair
   * @param {{ email, password }} body
   * @returns {{ user, accessToken, refreshToken }}
   */
  login: async ({ email, password }) => {
    // Lấy user kèm cả passwordHash (bị select: false trong schema)
    const user = await User.findOne({ email }).select('+passwordHash +refreshToken')

    // Dùng thông báo chung để tránh user enumeration
    if (!user) {
      throw ApiError.unauthorized('Email hoặc mật khẩu không đúng')
    }

    // Kiểm tra tài khoản bị khóa
    if (user.status === USER_STATUS.BLOCKED) {
      throw ApiError.forbidden('Tài khoản đã bị khóa. Vui lòng liên hệ hỗ trợ.')
    }

    // Xác thực mật khẩu
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
      throw ApiError.unauthorized('Email hoặc mật khẩu không đúng')
    }

    // Tạo cặp token mới
    const payload = { userId: user._id, role: user.role, email: user.email }
    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken(payload)

    // Lưu refresh token vào DB (rotate — ghi đè token cũ)
    user.refreshToken = refreshToken
    await user.save()

    const safeUser = {
      _id: user._id,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      status: user.status,
      profile: {
        fullName: user.profile.fullName,
        avatar: user.profile.avatar,
        phone: user.profile.phone,
      },
      companyId: user.companyId,
      createdAt: user.createdAt,
    }

    return { user: safeUser, accessToken, refreshToken }
  },

  /**
   * Đăng xuất — xóa refresh token khỏi DB
   * @param {string} refreshToken — lấy từ httpOnly cookie
   */
  logout: async (refreshToken) => {
    if (!refreshToken) return

    // Xóa refresh token trong DB để thu hồi phiên
    await User.findOneAndUpdate(
      { refreshToken },
      { $unset: { refreshToken: 1 } }
    )
  },

  /**
   * Làm mới Access Token bằng Refresh Token (token rotation)
   * @param {string} refreshToken — lấy từ httpOnly cookie
   * @returns {{ accessToken, refreshToken }}
   */
  refreshToken: async (token) => {
    if (!token) {
      throw ApiError.unauthorized('Refresh token không tồn tại')
    }

    // Xác thực chữ ký refresh token
    let decoded
    try {
      decoded = verifyRefreshToken(token)
    } catch {
      throw ApiError.unauthorized('Refresh token không hợp lệ hoặc đã hết hạn')
    }

    // Tìm user và kiểm tra token có khớp trong DB không (phát hiện reuse)
    const user = await User.findById(decoded.userId).select('+refreshToken')
    if (!user || user.refreshToken !== token) {
      // Token reuse detected — thu hồi toàn bộ session
      if (user) {
        user.refreshToken = undefined
        await user.save()
      }
      throw ApiError.unauthorized('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.')
    }

    // Kiểm tra tài khoản bị khóa
    if (user.status === USER_STATUS.BLOCKED) {
      throw ApiError.forbidden('Tài khoản đã bị khóa. Vui lòng liên hệ hỗ trợ.')
    }

    // Tạo cặp token mới (refresh token rotation)
    const payload = { userId: user._id, role: user.role, email: user.email }
    const newAccessToken = generateAccessToken(payload)
    const newRefreshToken = generateRefreshToken(payload)

    // Cập nhật refresh token mới vào DB
    user.refreshToken = newRefreshToken
    await user.save()

    return { accessToken: newAccessToken, refreshToken: newRefreshToken }
  },

  /**
   * Lấy thông tin user hiện tại
   * @param {string} userId — lấy từ req.user (JWT đã verify)
   * @returns {{ user }}
   */
  getMe: async (userId) => {
    const user = await User.findById(userId)
      .select('-passwordHash -refreshToken -emailVerificationToken -emailVerificationExpires')
      .populate('companyId', 'name logo status')

    if (!user) {
      throw ApiError.notFound('Không tìm thấy tài khoản')
    }

    return { user }
  },
}

export default authService
