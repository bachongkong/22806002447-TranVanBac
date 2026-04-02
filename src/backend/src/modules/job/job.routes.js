import { Router } from 'express'
import jobController from './job.controller.js'
import { asyncHandler, authenticate, authorize, validate } from '../../middleware/index.js'
import {
  createJobSchema,
  updateJobSchema,
  updateStatusSchema,
  getJobByIdSchema,
  listMyJobsSchema,
} from './job.validation.js'
import { ROLES } from '../../common/constants.js'

const router = Router()

// ============================================
// Authenticated Routes (đặt TRƯỚC /:id để tránh conflict)
// ============================================
router.get('/my-jobs', authenticate, authorize(ROLES.HR), validate(listMyJobsSchema), asyncHandler(jobController.getMyJobs))
router.post('/', authenticate, authorize(ROLES.HR), validate(createJobSchema), asyncHandler(jobController.create))
router.put('/:id', authenticate, authorize(ROLES.HR), validate(updateJobSchema), asyncHandler(jobController.update))
router.patch('/:id/status', authenticate, authorize(ROLES.HR), validate(updateStatusSchema), asyncHandler(jobController.updateStatus))
router.delete('/:id', authenticate, authorize(ROLES.HR), asyncHandler(jobController.remove))

// ============================================
// Public Routes
// ============================================
router.get('/:id', validate(getJobByIdSchema), asyncHandler(jobController.getById))

export default router
