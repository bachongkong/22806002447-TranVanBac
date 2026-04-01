import { Router } from 'express'
import { asyncHandler, authenticate, authorize, validate } from '../../middleware/index.js'
import { ApiResponse } from '../../common/index.js'
import { ROLES } from '../../common/constants.js'
import interviewController from './interview.controller.js'
import { submitFeedbackSchema } from './interview.validation.js'

const router = Router()
router.use(authenticate)

router.patch('/:id/feedback', 
  authorize(ROLES.HR), 
  validate(submitFeedbackSchema), 
  asyncHandler(interviewController.submitFeedback)
)

export default router
