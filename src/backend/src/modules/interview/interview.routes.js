import { Router } from 'express'
import { asyncHandler, authenticate, authorize } from '../../middleware/index.js'
import { ApiResponse } from '../../common/index.js'
import { ROLES } from '../../common/constants.js'

const router = Router()
router.use(authenticate)

router.post('/', authorize(ROLES.HR), asyncHandler(async (req, res) => {
  // TODO: schedule interview
  ApiResponse.created(res, { message: 'Create interview — chưa implement' })
}))

router.put('/:id', authorize(ROLES.HR), asyncHandler(async (req, res) => {
  // TODO: update interview
  ApiResponse.success(res, { message: 'Update interview — chưa implement' })
}))

router.get('/:id', asyncHandler(async (req, res) => {
  // TODO: get interview detail
  ApiResponse.success(res, { message: 'Get interview — chưa implement' })
}))

export default router
