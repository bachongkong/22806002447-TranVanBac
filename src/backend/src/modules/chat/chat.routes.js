import { Router } from 'express'
import { asyncHandler, authenticate } from '../../middleware/index.js'
import { ApiResponse } from '../../common/index.js'

const router = Router()
router.use(authenticate)

router.get('/conversations', asyncHandler(async (req, res) => {
  // TODO: list conversations
  ApiResponse.success(res, { message: 'List conversations — chưa implement' })
}))

router.get('/conversations/:id/messages', asyncHandler(async (req, res) => {
  // TODO: get messages
  ApiResponse.success(res, { message: 'Get messages — chưa implement' })
}))

router.post('/conversations/:id/messages', asyncHandler(async (req, res) => {
  // TODO: send message
  ApiResponse.created(res, { message: 'Send message — chưa implement' })
}))

export default router
