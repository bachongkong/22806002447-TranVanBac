import { ROLES } from '../common/constants.js'

/**
 * Namespace /chat — Chat Room giữa HR ↔ Candidate
 *
 * Luồng hoạt động:
 *   1. Client kết nối /chat với JWT access token
 *   2. socketAuth middleware verify token → gắn socket.user
 *   3. Client emit 'join_conversation' với conversationId
 *   4. Server join socket vào room 'conv:{id}'
 *   5. Client emit 'send_message' → server broadcast tới room
 *   6. Client emit 'typing' / 'stop_typing' → server broadcast
 *
 * Chỉ HR và Candidate được phép kết nối namespace này.
 */
const setupChatNamespace = (chatNsp) => {
  // --- Kiểm tra role khi kết nối ---
  chatNsp.use((socket, next) => {
    const { role } = socket.user
    if (role !== ROLES.HR && role !== ROLES.CANDIDATE) {
      return next(new Error('FORBIDDEN'))
    }
    next()
  })

  chatNsp.on('connection', (socket) => {
    const { userId, role } = socket.user
    console.log(`[CHAT] Connected: ${socket.id} | user=${userId} role=${role}`)

    // --- Join conversation room ---
    socket.on('join_conversation', (conversationId) => {
      if (!conversationId) return
      const room = `conv:${conversationId}`
      socket.join(room)
      console.log(`[CHAT] ${userId} joined ${room}`)
    })

    // --- Rời conversation room ---
    socket.on('leave_conversation', (conversationId) => {
      if (!conversationId) return
      const room = `conv:${conversationId}`
      socket.leave(room)
      console.log(`[CHAT] ${userId} left ${room}`)
    })

    // --- Gửi tin nhắn ---
    // Lưu ý: việc persist message vào DB sẽ do REST API xử lý (POST /chat/...)
    // Socket chỉ broadcast realtime tới room
    socket.on('send_message', (data) => {
      const { conversationId, message } = data || {}
      if (!conversationId || !message) return

      const room = `conv:${conversationId}`
      // Broadcast tới tất cả members trong room (trừ người gửi)
      socket.to(room).emit('new_message', {
        conversationId,
        message,
        senderId: userId,
        sentAt: new Date().toISOString(),
      })
    })

    // --- Đang gõ ---
    socket.on('typing', (conversationId) => {
      if (!conversationId) return
      socket.to(`conv:${conversationId}`).emit('user_typing', {
        conversationId,
        userId,
      })
    })

    // --- Ngừng gõ ---
    socket.on('stop_typing', (conversationId) => {
      if (!conversationId) return
      socket.to(`conv:${conversationId}`).emit('user_stop_typing', {
        conversationId,
        userId,
      })
    })

    // --- Disconnect ---
    socket.on('disconnect', (reason) => {
      console.log(`[CHAT] Disconnected: ${socket.id} | reason=${reason}`)
    })
  })
}

export default setupChatNamespace
