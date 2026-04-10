import { Router } from 'express'
import { asyncHandler, authenticate, authorize, validate } from '../../middleware/index.js'
import { ROLES } from '../../common/constants.js'
import interviewController from './interview.controller.js'
import { scheduleSchema, updateSchema, cancelSchema, submitFeedbackSchema } from './interview.validation.js'

const router = Router()
router.use(authenticate)

router.post('/', 
  authorize(ROLES.HR), 
  validate(scheduleSchema), 
  asyncHandler(interviewController.scheduleInterview)
)

router.put('/:id', 
  authorize(ROLES.HR), 
  validate(updateSchema), 
  asyncHandler(interviewController.updateInterview)
)

router.patch('/:id/cancel', 
  authorize(ROLES.HR), 
  validate(cancelSchema), 
  asyncHandler(interviewController.cancelInterview)
)

router.patch('/:id/feedback', 
  authorize(ROLES.HR), 
  validate(submitFeedbackSchema), 
  asyncHandler(interviewController.submitFeedback)
)

export default router
