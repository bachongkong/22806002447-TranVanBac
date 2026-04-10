import { Router } from 'express'
import { asyncHandler, authenticate, validate } from '../../middleware/index.js'
import chatController from './chat.controller.js'
import {
  getConversationsSchema,
  getMessagesSchema,
  sendMessageSchema,
} from './chat.validation.js'

const router = Router()

// Tất cả các route chat đều yêu cầu đăng nhập
router.use(authenticate)

// Lấy danh sách conversation
router.get(
  '/conversations',
  validate(getConversationsSchema),
  asyncHandler(chatController.getConversations)
)

// Lấy lịch sử tin nhắn của 1 conversation (Cursor-based)
router.get(
  '/conversations/:id/messages',
  validate(getMessagesSchema),
  asyncHandler(chatController.getMessages)
)

// Gửi tin nhắn
router.post(
  '/conversations/:id/messages',
  validate(sendMessageSchema),
  asyncHandler(chatController.sendMessage)
)

export default router
