import { ApiResponse } from '../../common/index.js'
import userService from './user.service.js'

const userController = {
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
