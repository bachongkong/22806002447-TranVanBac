import { ApiResponse } from '../../common/index.js'

// Team implement logic ở đây

const authController = {
  register: async (req, res) => {
    // TODO: implement register
    ApiResponse.created(res, { message: 'Register — chưa implement' })
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
    // TODO: implement verify email
    ApiResponse.success(res, { message: 'Verify email — chưa implement' })
  },

  getMe: async (req, res) => {
    // TODO: implement get current user
    ApiResponse.success(res, { message: 'Get me — chưa implement' })
  },
}

export default authController
