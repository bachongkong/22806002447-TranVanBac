import { Router } from 'express'
import { asyncHandler, authenticate, authorize, validate } from '../../middleware/index.js'
import { ApiResponse } from '../../common/index.js'
import { ROLES } from '../../common/constants.js'
import jobController from './job.controller.js'
import {
  createJobSchema,
  updateJobSchema,
  updateStatusSchema,
  getJobByIdSchema,
  listMyJobsSchema,
  searchJobSchema,
} from './job.validation.js'

const router = Router()

// ============================================
// Public Routes
// ============================================
router.get('/', validate(searchJobSchema), asyncHandler(jobController.searchJobs))
router.get('/search', validate(searchJobSchema), asyncHandler(jobController.searchJobs))

// ============================================
// Authenticated Routes (đặt TRƯỚC /:id để tránh conflict)
// ============================================
router.get('/my-jobs', authenticate, authorize(ROLES.HR), validate(listMyJobsSchema), asyncHandler(jobController.getMyJobs))
router.post('/', authenticate, authorize(ROLES.HR), validate(createJobSchema), asyncHandler(jobController.create))
router.put('/:id', authenticate, authorize(ROLES.HR), validate(updateJobSchema), asyncHandler(jobController.update))
router.patch('/:id/status', authenticate, authorize(ROLES.HR), validate(updateStatusSchema), asyncHandler(jobController.updateStatus))
router.delete('/:id', authenticate, authorize(ROLES.HR), asyncHandler(jobController.remove))

router.get('/favorites', authenticate, authorize(ROLES.CANDIDATE), asyncHandler(async (req, res) => {
  // TODO: get favorite jobs
  ApiResponse.success(res, { message: 'Get favorites — chưa implement' })
}))

router.post('/:id/favorite', authenticate, authorize(ROLES.CANDIDATE), asyncHandler(async (req, res) => {
  // TODO: toggle favorite
  ApiResponse.success(res, { message: 'Toggle favorite — chưa implement' })
}))

// Tránh đặt /:id phía trước các route khác
router.get('/:id', validate(getJobByIdSchema), asyncHandler(jobController.getById))

export default router
