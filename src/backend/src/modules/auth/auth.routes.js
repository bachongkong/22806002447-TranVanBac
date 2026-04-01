import { Router } from 'express'
import authController from './auth.controller.js'
import { validate, asyncHandler, authenticate, registerLimiter } from '../../middleware/index.js'
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  resendVerificationSchema,
} from './auth.validation.js'

const router = Router()

// Rate limit đặt trước validate — chặn spam trước khi xử lý Joi
router.post('/register', registerLimiter, validate(registerSchema), asyncHandler(authController.register))
router.post('/login', validate(loginSchema), asyncHandler(authController.login))
router.post('/logout', asyncHandler(authController.logout))
router.post('/refresh-token', asyncHandler(authController.refreshToken))
router.post('/forgot-password', validate(forgotPasswordSchema), asyncHandler(authController.forgotPassword))
router.post('/reset-password', validate(resetPasswordSchema), asyncHandler(authController.resetPassword))

// Email verification
router.get('/verify-email', validate(verifyEmailSchema), asyncHandler(authController.verifyEmail))
router.post('/resend-verification', validate(resendVerificationSchema), asyncHandler(authController.resendVerification))

router.get('/me', authenticate, asyncHandler(authController.getMe))

export default router
