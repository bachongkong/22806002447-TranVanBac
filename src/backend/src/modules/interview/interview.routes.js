import { Router } from 'express'
import { asyncHandler, authenticate, authorize, validate } from '../../middleware/index.js'
import { ApiResponse } from '../../common/index.js'
import { ROLES } from '../../common/constants.js'
import interviewController from './interview.controller.js'
import { scheduleSchema, updateSchema, cancelSchema } from './interview.validation.js'

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

export default router
