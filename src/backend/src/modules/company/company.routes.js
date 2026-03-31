import { Router } from 'express'
import { asyncHandler, authenticate, authorize } from '../../middleware/index.js'
import { ApiResponse } from '../../common/index.js'
import { ROLES } from '../../common/constants.js'

const router = Router()

router.get('/', asyncHandler(async (req, res) => {
  // TODO: list companies (public)
  ApiResponse.success(res, { message: 'List companies — chưa implement' })
}))

router.get('/:id', asyncHandler(async (req, res) => {
  // TODO: get company by id (public)
  ApiResponse.success(res, { message: 'Get company — chưa implement' })
}))

// Routes cần auth
router.use(authenticate)

router.post('/', authorize(ROLES.HR), asyncHandler(async (req, res) => {
  // TODO: create company (HR only)
  ApiResponse.created(res, { message: 'Create company — chưa implement' })
}))

router.put('/:id', authorize(ROLES.HR), asyncHandler(async (req, res) => {
  // TODO: update company (HR only, own company)
  ApiResponse.success(res, { message: 'Update company — chưa implement' })
}))

router.get('/my-company', authorize(ROLES.HR), asyncHandler(async (req, res) => {
  // TODO: get HR's own company
  ApiResponse.success(res, { message: 'Get my company — chưa implement' })
}))

export default router
