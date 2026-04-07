import jwt from 'jsonwebtoken'
import { env } from '../config/index.js'

/**
 * Socket.io middleware — xác thực JWT khi handshake
 *
 * Client gửi token qua:
 *   io('/chat', { auth: { token: 'Bearer xxx' } })
 *
 * Nếu hợp lệ → gắn socket.user = { userId, role, email }
 * Nếu không   → disconnect với lỗi cụ thể
 */
const socketAuth = (socket, next) => {
  const raw = socket.handshake.auth?.token || ''
  const token = raw.startsWith('Bearer ') ? raw.slice(7) : raw

  if (!token) {
    return next(new Error('AUTH_REQUIRED'))
  }

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET)
    // Gắn user payload vào socket để các handler dùng
    socket.user = {
      userId: decoded.userId,
      role: decoded.role,
      email: decoded.email,
    }
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new Error('TOKEN_EXPIRED'))
    }
    return next(new Error('TOKEN_INVALID'))
  }
}

export default socketAuth
