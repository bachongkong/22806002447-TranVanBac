import { Router } from 'express'
import { asyncHandler, authenticate, authorize, validate } from '../../middleware/index.js'
import { ApiResponse } from '../../common/index.js'
import { ROLES } from '../../common/constants.js'
import jobController from './job.controller.js'
import { searchJobSchema } from './job.validation.js'

const router = Router()

// Public
// Gộp chung API list và search vào thư mục root (vì logic tương đồng)
router.get('/', validate(searchJobSchema), asyncHandler(jobController.searchJobs))
router.get('/search', validate(searchJobSchema), asyncHandler(jobController.searchJobs))

router.get('/:id', asyncHandler(async (req, res) => {
  // TODO: get job detail (public)
  ApiResponse.success(res, { message: 'Get job — chưa implement' })
}))

// Authenticated
router.use(authenticate)

// Candidate
router.get('/favorites', authorize(ROLES.CANDIDATE), asyncHandler(async (req, res) => {
  // TODO: get favorite jobs
  ApiResponse.success(res, { message: 'Get favorites — chưa implement' })
}))

router.post('/:id/favorite', authorize(ROLES.CANDIDATE), asyncHandler(async (req, res) => {
  // TODO: toggle favorite
  ApiResponse.success(res, { message: 'Toggle favorite — chưa implement' })
}))

// HR
router.post('/', authorize(ROLES.HR), asyncHandler(async (req, res) => {
  // TODO: create job
  ApiResponse.created(res, { message: 'Create job — chưa implement' })
}))

router.put('/:id', authorize(ROLES.HR), asyncHandler(async (req, res) => {
  // TODO: update job
  ApiResponse.success(res, { message: 'Update job — chưa implement' })
}))

export default router
