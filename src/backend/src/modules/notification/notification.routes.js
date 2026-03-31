import { Router } from 'express'
import { asyncHandler, authenticate } from '../../middleware/index.js'
import { ApiResponse } from '../../common/index.js'

const router = Router()
router.use(authenticate)

router.get('/', asyncHandler(async (req, res) => {
  // TODO: list notifications
  ApiResponse.success(res, { message: 'List notifications — chưa implement' })
}))

router.patch('/:id/read', asyncHandler(async (req, res) => {
  // TODO: mark read
  ApiResponse.success(res, { message: 'Mark read — chưa implement' })
}))

router.patch('/read-all', asyncHandler(async (req, res) => {
  // TODO: mark all read
  ApiResponse.success(res, { message: 'Mark all read — chưa implement' })
}))

router.get('/unread-count', asyncHandler(async (req, res) => {
  // TODO: unread count
  ApiResponse.success(res, { message: 'Unread count — chưa implement', data: { count: 0 } })
}))

export default router
