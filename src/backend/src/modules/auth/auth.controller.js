import { ApiResponse } from '../../common/index.js'
import { env } from '../../config/index.js'
import authService from './auth.service.js'

// Cookie options cho refresh token
const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
}

const authController = {
  register: async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.register(req.body)

    // Set refresh token vào httpOnly cookie
    res.cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS)

    ApiResponse.created(res, {
      message: 'Đăng ký thành công',
      data: { user, accessToken },
    })
  },

  login: async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.login(req.body)

    res.cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS)

    ApiResponse.success(res, {
      message: 'Đăng nhập thành công',
      data: { user, accessToken },
    })
  },

  logout: async (req, res) => {
    const token = req.cookies?.refreshToken

    await authService.logout(token)

    // Xóa cookie phía client
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
    })

    ApiResponse.success(res, {
      message: 'Đăng xuất thành công',
      data: null,
    })
  },

  refreshToken: async (req, res) => {
    const token = req.cookies?.refreshToken

    const { accessToken, refreshToken } = await authService.refreshToken(token)

    // Gửi refresh token mới vào cookie (rotation)
    res.cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS)

    ApiResponse.success(res, {
      message: 'Token được làm mới thành công',
      data: { accessToken },
    })
  },

  forgotPassword: async (req, res) => {
    // TODO: implement forgot password
    ApiResponse.success(res, { message: 'Forgot password — chưa implement' })
  },

  resetPassword: async (req, res) => {
    // TODO: implement reset password
    ApiResponse.success(res, { message: 'Reset password — chưa implement' })
  },

  verifyEmail: async (req, res) => {
    const { token } = req.query
    const result = await authService.verifyEmail(token)

    ApiResponse.success(res, {
      message: 'Xác thực email thành công',
      data: result,
    })
  },

  resendVerification: async (req, res) => {
    const { email } = req.body
    const result = await authService.resendVerification(email)

    ApiResponse.success(res, {
      message: result.message,
    })
  },

  getMe: async (req, res) => {
    const result = await authService.getMe(req.user.userId)

    ApiResponse.success(res, {
      message: 'Lấy thông tin thành công',
      data: result,
    })
  },
}

export default authController
