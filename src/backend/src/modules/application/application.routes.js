import { Router } from 'express'
import { asyncHandler, authenticate, authorize, validate, checkIdempotency } from '../../middleware/index.js'
import { ApiResponse } from '../../common/index.js'
import { ROLES } from '../../common/constants.js'
import applicationController from './application.controller.js'
import { applyJobSchema, withdrawSchema, updateStatusSchema } from './application.validation.js'

const router = Router()
router.use(authenticate)

// Candidate
// Áp dụng Idempotency middleware để chống duplicate/spam submit cho Apply route.
router.post('/', 
  authorize(ROLES.CANDIDATE), 
  validate(applyJobSchema), 
  checkIdempotency, 
  asyncHandler(applicationController.applyJob)
)

router.get('/my-applications', authorize(ROLES.CANDIDATE), asyncHandler(async (req, res) => {
  // TODO: get my applications
  ApiResponse.success(res, { message: 'My applications — chưa implement' })
}))

router.patch('/:id/withdraw', 
  authorize(ROLES.CANDIDATE), 
  validate(withdrawSchema), 
  asyncHandler(applicationController.withdrawApplication)
)

// HR
router.get('/:id', authorize(ROLES.HR, ROLES.CANDIDATE), asyncHandler(async (req, res) => {
  // TODO: get application detail
  ApiResponse.success(res, { message: 'Get application — chưa implement' })
}))

router.patch('/:id/status', 
  authorize(ROLES.HR), 
  validate(updateStatusSchema), 
  asyncHandler(applicationController.updateStatus)
)

// HR — lấy danh sách ứng viên theo job
router.get('/by-job/:jobId',
  authorize(ROLES.HR),
  asyncHandler(applicationController.getApplicationsByJob)
)

export default router
