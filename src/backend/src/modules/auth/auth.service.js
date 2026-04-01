import crypto from 'crypto'
import User from '../../models/User.js'
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt.js'
import { sendVerificationEmail } from '../../utils/email.js'
import { ApiError } from '../../common/index.js'
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
}

export default authService
