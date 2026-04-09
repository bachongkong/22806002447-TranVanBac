import { ApiResponse } from '../../common/index.js'
import chatService from './chat.service.js'

const chatController = {
  getConversations: async (req, res) => {
    const { page = 1, limit = 10 } = req.query
    const userId = req.user.userId || req.user.id

    const { conversations, total } = await chatService.getConversations(
      userId,
      page,
      limit
    )

    ApiResponse.paginated(res, {
      data: conversations,
      page: Number(page),
      limit: Number(limit),
      total,
    })
  },

  getMessages: async (req, res) => {
    const { id } = req.params
    const { cursor, limit = 20 } = req.query
    const userId = req.user.userId || req.user.id

    const { messages, hasNextPage, nextCursor, limit: parsedLimit } =
      await chatService.getMessages(userId, id, cursor, limit)

    ApiResponse.success(res, {
      data: messages,
      meta: {
        hasNextPage,
        nextCursor,
        limit: parsedLimit,
      },
      message: 'Lấy danh sách tin nhắn thành công',
    })
  },

  sendMessage: async (req, res) => {
    const { id } = req.params
    const { content } = req.body
    const userId = req.user.userId || req.user.id

    const populatedMessage = await chatService.sendMessage(userId, id, content)

    // Nếu có Socket Namespace chạy, thì gọi emit
    const chatNsp = req.app.get('chatNamespace')
    if (chatNsp) {
      chatNsp.to(`conv:${id}`).emit('new_message', {
        conversationId: id,
        message: populatedMessage,
        senderId: userId,
        sentAt: populatedMessage.createdAt,
      })
    }

    ApiResponse.created(res, {
      data: populatedMessage,
      message: 'Gửi tin nhắn thành công',
    })
  },
}

export default chatController
