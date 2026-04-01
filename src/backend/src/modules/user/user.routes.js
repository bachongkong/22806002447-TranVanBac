import { Router } from 'express'
import userController from './user.controller.js'
import { updateProfileSchema, changePasswordSchema } from './user.validation.js'
import { asyncHandler, authenticate, validate } from '../../middleware/index.js'

const router = Router()

// Tất cả routes cần authenticate
router.use(authenticate)

router.get('/profile', asyncHandler(userController.getProfile))

router.put('/profile', validate(updateProfileSchema), asyncHandler(userController.updateProfile))

router.put('/change-password', validate(changePasswordSchema), asyncHandler(userController.changePassword))

export default router
