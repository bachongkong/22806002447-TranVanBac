import { Router } from 'express'
import userController from './user.controller.js'
import { updateProfileSchema, changePasswordSchema } from './user.validation.js'
import { asyncHandler, authenticate, authorize, upload, validate } from '../../middleware/index.js'
import { ApiResponse } from '../../common/index.js'
import { ROLES } from '../../common/constants.js'

const router = Router()

// Tất cả routes cần authenticate
router.use(authenticate)

router.get('/profile', asyncHandler(userController.getProfile))

router.put('/profile', validate(updateProfileSchema), asyncHandler(userController.updateProfile))

router.put('/change-password', validate(changePasswordSchema), asyncHandler(userController.changePassword))

router.put('/profile/avatar', upload.single('avatar'), asyncHandler(userController.uploadAvatar))

export default router
