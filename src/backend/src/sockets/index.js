import { Server } from 'socket.io'
import { env } from '../config/index.js'
import socketAuth from './socketAuth.js'
import setupChatNamespace from './chatNamespace.js'
import setupNotificationNamespace from './notificationNamespace.js'

// ============================================
// Socket.io Server Setup
// ============================================
// Kiến trúc 2 namespace:
//   /chat           — Chat Room (HR ↔ Candidate)
//   /notifications  — Notification Room (cá nhân, mọi role)
//
// Cả 2 namespace đều yêu cầu JWT access token khi kết nối.
// Token truyền qua: io('/chat', { auth: { token: 'Bearer xxx' } })
// ============================================

/**
 * Khởi tạo Socket.io server với 2 namespace phân luồng
 *
 * @param {import('http').Server} httpServer
 * @returns {{ io, chatNamespace, notificationNamespace }}
 */
const setupSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  })

  // ---- Chat Namespace ----
  const chatNamespace = io.of('/chat')
  chatNamespace.use(socketAuth)         // Xác thực JWT
  setupChatNamespace(chatNamespace)     // Đăng ký event handlers

  // ---- Notification Namespace ----
  const notificationNamespace = io.of('/notifications')
  notificationNamespace.use(socketAuth) // Xác thực JWT
  setupNotificationNamespace(notificationNamespace)

  return { io, chatNamespace, notificationNamespace }
}

export default setupSocket
