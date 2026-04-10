import { Conversation, Message } from '../../models/index.js'
import { ApiError } from '../../common/index.js'

const chatService = {
  getConversations: async (userId, page, limit) => {
    const skip = (page - 1) * limit
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

    return { conversations, total }
  },

  getMessages: async (userId, conversationId, cursor, limit) => {
    const conversation = await Conversation.findById(conversationId)
    if (!conversation) {
      throw ApiError.notFound('Không tìm thấy cuộc trò chuyện')
    }

    if (!conversation.participants.includes(userId)) {
      throw ApiError.forbidden('Bạn không tham gia cuộc trò chuyện này')
    }

    const query = { conversationId }
    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) }
    }

    const numLimit = Number(limit)
    // Lấy dư 1 bản ghi để biết có trang tiếp theo không
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

    return { messages, hasNextPage, nextCursor, limit: numLimit }
  },

  sendMessage: async (userId, conversationId, content) => {
    const conversation = await Conversation.findById(conversationId)
    if (!conversation) {
      throw ApiError.notFound('Không tìm thấy cuộc trò chuyện')
    }

    if (!conversation.participants.includes(userId)) {
      throw ApiError.forbidden('Bạn không tham gia cuộc trò chuyện này')
    }

    const message = await Message.create({
      conversationId,
      senderId: userId,
      content,
    })

    // Update lastMessage
    conversation.lastMessage = content
    conversation.lastMessageAt = message.createdAt
    await conversation.save()

    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'email profile.fullName profile.avatar role')
      .lean()

    return populatedMessage
  },
}

export default chatService
