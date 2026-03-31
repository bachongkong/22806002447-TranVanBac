import { Router } from 'express'
import { asyncHandler, authenticate, authorize } from '../../middleware/index.js'
import { ApiResponse } from '../../common/index.js'
import { ROLES } from '../../common/constants.js'

const router = Router()
router.use(authenticate)

router.get('/', authorize(ROLES.CANDIDATE), asyncHandler(async (req, res) => {
  // TODO: get my CVs
  ApiResponse.success(res, { message: 'List CVs — chưa implement' })
}))

router.post('/upload', authorize(ROLES.CANDIDATE), asyncHandler(async (req, res) => {
  // TODO: upload CV file
  ApiResponse.created(res, { message: 'Upload CV — chưa implement' })
}))

router.post('/', authorize(ROLES.CANDIDATE), asyncHandler(async (req, res) => {
  // TODO: create CV (builder)
  ApiResponse.created(res, { message: 'Create CV — chưa implement' })
}))

router.put('/:id', authorize(ROLES.CANDIDATE), asyncHandler(async (req, res) => {
  // TODO: update CV
  ApiResponse.success(res, { message: 'Update CV — chưa implement' })
}))

router.delete('/:id', authorize(ROLES.CANDIDATE), asyncHandler(async (req, res) => {
  // TODO: delete CV
  ApiResponse.success(res, { message: 'Delete CV — chưa implement' })
}))

router.patch('/:id/default', authorize(ROLES.CANDIDATE), asyncHandler(async (req, res) => {
  // TODO: set default CV
  ApiResponse.success(res, { message: 'Set default — chưa implement' })
}))

router.post('/:id/parse', authorize(ROLES.CANDIDATE), asyncHandler(async (req, res) => {
  // TODO: OCR parse CV
  ApiResponse.success(res, { message: 'Parse OCR — chưa implement' })
}))

export default router
