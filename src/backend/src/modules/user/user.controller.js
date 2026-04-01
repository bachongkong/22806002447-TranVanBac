import { ApiResponse } from '../../common/index.js'
import userService from './user.service.js'

const userController = {
  getProfile: async (req, res) => {
    // req.user is set by authenticate middleware
    const user = await userService.getProfile(req.user.userId)
    ApiResponse.success(res, { data: user })
  },

  updateProfile: async (req, res) => {
    const user = await userService.updateProfile(req.user.userId, req.body)
    ApiResponse.success(res, { data: user, message: 'Profile updated successfully' })
  },

  changePassword: async (req, res) => {
    const { oldPassword, newPassword } = req.body
    await userService.changePassword(req.user.userId, oldPassword, newPassword)
    ApiResponse.success(res, { message: 'Password changed successfully' })
  },

  /**
   * Upload user avatar using multer buffer
   */
  uploadAvatar: async (req, res) => {
    // req.user is set by authenticate middleware
    const avatarUrl = await userService.uploadAvatar(req.user.userId, req.file?.buffer)
    
    ApiResponse.success(res, {
      message: 'Avatar uploaded successfully',
      data: { avatar: avatarUrl }
    })
  },
}

export default userController
