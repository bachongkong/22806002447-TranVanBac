import { Router } from 'express'
import { asyncHandler, authenticate, authorize, upload } from '../../middleware/index.js'
import { ApiResponse } from '../../common/index.js'
import { ROLES } from '../../common/constants.js'
import userController from './user.controller.js'

const router = Router()

// Tất cả routes cần authenticate
router.use(authenticate)

router.get('/profile', asyncHandler(async (req, res) => {
  // TODO: get current user profile
  ApiResponse.success(res, { message: 'Get profile — chưa implement' })
}))

router.put('/profile', asyncHandler(async (req, res) => {
  // TODO: update profile
  ApiResponse.success(res, { message: 'Update profile — chưa implement' })
}))

router.put('/change-password', asyncHandler(async (req, res) => {
  // TODO: change password
  ApiResponse.success(res, { message: 'Change password — chưa implement' })
}))

router.put('/profile/avatar', upload.single('avatar'), asyncHandler(userController.uploadAvatar))

export default router
