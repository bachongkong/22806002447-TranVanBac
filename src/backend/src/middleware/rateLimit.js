import rateLimit, { ipKeyGenerator } from 'express-rate-limit'

/**
 * Factory tạo rate limiter có thể tái sử dụng
 *
 * @param {object} options
 * @param {number} options.max          - Số request tối đa trong window
 * @param {number} options.windowMs     - Khoảng thời gian (ms)
 * @param {string} options.message      - Thông báo lỗi khi vượt giới hạn
 */
const createRateLimiter = ({
  max = 100,
  windowMs = 60 * 1000,
  message = 'Quá nhiều yêu cầu, vui lòng thử lại sau',
} = {}) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,   // trả về Retry-After, X-RateLimit-* headers
    legacyHeaders: false,
    message: {
      success: false,
      message,
    },
    // Dùng ipKeyGenerator để handle cả IPv4 và IPv6 đúng cách
    keyGenerator: (req) => ipKeyGenerator(req.ip),
  })

// --------------------------------------------------
// Các limiter được định nghĩa sẵn cho từng use-case
// --------------------------------------------------

/**
 * Auth register: max 5 request/phút
 * Mục đích: chống spam tạo tài khoản rác
 */
export const registerLimiter = createRateLimiter({
  max: 5,
  windowMs: 60 * 1000,
  message: 'Bạn đã thử đăng ký quá nhiều lần. Vui lòng thử lại sau 1 phút.',
})

/**
 * Auth login: max 10 request/phút
 * Mục đích: chống brute force mật khẩu
 */
export const loginLimiter = createRateLimiter({
  max: 10,
  windowMs: 60 * 1000,
  message: 'Bạn đã thử đăng nhập quá nhiều lần. Vui lòng thử lại sau 1 phút.',
})

/**
 * Forgot password: max 3 request/phút
 * Mục đích: chống spam email reset password
 */
export const forgotPasswordLimiter = createRateLimiter({
  max: 3,
  windowMs: 60 * 1000,
  message: 'Bạn đã gửi yêu cầu quá nhiều lần. Vui lòng thử lại sau 1 phút.',
})
