import { Router } from 'express'
import { asyncHandler, authenticate, authorize, validate } from '../../middleware/index.js'
import { ROLES } from '../../common/constants.js'
import jobController from './job.controller.js'
import {
  createJobSchema,
  updateJobSchema,
  updateStatusSchema,
  getJobByIdSchema,
  listMyJobsSchema,
  searchJobSchema,
  toggleFavoriteSchema,
  listFavoritesSchema,
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

// ============================================
// Saved / Favorite Routes (Candidate only)
// ============================================
router.get('/favorites', authenticate, authorize(ROLES.CANDIDATE), validate(listFavoritesSchema), asyncHandler(jobController.getFavorites))
router.post('/:id/favorite', authenticate, authorize(ROLES.CANDIDATE), validate(toggleFavoriteSchema), asyncHandler(jobController.toggleFavorite))

// ============================================
// Param-based Route (đặt CUỐI để tránh conflict với named routes)
// ============================================
router.get('/:id', validate(getJobByIdSchema), asyncHandler(jobController.getById))

export default router
