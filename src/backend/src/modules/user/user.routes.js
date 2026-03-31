import { Router } from 'express'
import { asyncHandler, authenticate, authorize } from '../../middleware/index.js'
import { ApiResponse } from '../../common/index.js'
import { ROLES } from '../../common/constants.js'

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

export default router
