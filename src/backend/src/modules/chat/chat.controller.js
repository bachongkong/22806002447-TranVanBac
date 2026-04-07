import { Conversation, Message } from '../../models/index.js'
import { ApiResponse, ApiError } from '../../common/index.js'
import mongoose from 'mongoose'

const chatController = {
  getConversations: async (req, res) => {
    const { page = 1, limit = 10 } = req.query
    const skip = (page - 1) * limit
    const userId = req.user.userId || req.user.id

    const matchQuery = { participants: userId }

    const [conversations, total] = await Promise.all([
      Conversation.find(matchQuery)
        .populate('participants', 'email profile.fullName profile.avatar role')
        .sort({ lastMessageAt: -1 })
        .skip(Number(skip))
        .limit(Number(limit))
        .lean(),
      Conversation.countDocuments(matchQuery),
    ])

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

    const conversation = await Conversation.findById(id)
    if (!conversation) {
      throw ApiError.notFound('Không tìm thấy cuộc trò chuyện')
    }

    if (!conversation.participants.includes(userId)) {
      throw ApiError.forbidden('Bạn không tham gia cuộc trò chuyện này')
    }

    const query = { conversationId: id }
    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) }
    }

    // Lấy dư 1 bản ghi để biết có trang tiếp theo không
    const numLimit = Number(limit)
    const messages = await Message.find(query)
      .populate('senderId', 'email profile.fullName profile.avatar role')
      .sort({ createdAt: -1 }) // Tin nhắn mới nhất xếp trước
      .limit(numLimit + 1)
      .lean()

    let nextCursor = null
    let hasNextPage = false

    if (messages.length > numLimit) {
      hasNextPage = true
      messages.pop() // Xóa bản ghi thừa
    }

    if (messages.length > 0) {
      nextCursor = messages[messages.length - 1].createdAt
    }

    ApiResponse.success(res, {
      data: messages,
      pagination: {
        hasNextPage,
        nextCursor,
        limit: numLimit,
      },
      message: 'Lấy danh sách tin nhắn thành công',
    })
  },

  sendMessage: async (req, res) => {
    const { id } = req.params
    const { content } = req.body
    const userId = req.user.userId || req.user.id

    const conversation = await Conversation.findById(id)
    if (!conversation) {
      throw ApiError.notFound('Không tìm thấy cuộc trò chuyện')
    }

    if (!conversation.participants.includes(userId)) {
      throw ApiError.forbidden('Bạn không tham gia cuộc trò chuyện này')
    }

    const message = await Message.create({
      conversationId: id,
      senderId: userId,
      content,
    })

    // Update latMessage
    conversation.lastMessage = content
    conversation.lastMessageAt = message.createdAt
    await conversation.save()

    const populatedMessage = await Message.findById(message._id).populate(
      'senderId',
      'email profile.fullName profile.avatar role'
    ).lean()

    // Có thể emit qua Socket nếu có namespace
    const chatNsp = req.app.get('chatNamespace')
    if (chatNsp) {
      chatNsp.to(`conv:${id}`).emit('new_message', {
        conversationId: id,
        message: populatedMessage,
        senderId: userId,
        sentAt: message.createdAt,
      })
    }

    ApiResponse.created(res, {
      data: populatedMessage,
      message: 'Gửi tin nhắn thành công',
    })
  },
}

export default chatController
