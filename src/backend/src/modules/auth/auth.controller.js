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
    // TODO: implement login
    ApiResponse.success(res, { message: 'Login — chưa implement' })
  },

  logout: async (req, res) => {
    // TODO: implement logout
    ApiResponse.success(res, { message: 'Logout — chưa implement' })
  },

  refreshToken: async (req, res) => {
    // TODO: implement refresh token
    ApiResponse.success(res, { message: 'Refresh token — chưa implement' })
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
    // TODO: implement get current user
    ApiResponse.success(res, { message: 'Get me — chưa implement' })
  },
}

export default authController
