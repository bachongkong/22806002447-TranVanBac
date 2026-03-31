import { Server } from 'socket.io'
import { env } from '../config/index.js'

/**
 * Socket.io setup
 * Team implement event handlers ở đây
 */
const setupSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    console.log(`[SOCKET] Connected: ${socket.id}`)

    // Join user's personal room (để push notification riêng)
    socket.on('join', (userId) => {
      socket.join(`user:${userId}`)
      console.log(`[SOCKET] User ${userId} joined room`)
    })

    // TODO: Team thêm event handlers ở đây
    // socket.on('send_message', (data) => { ... })
    // socket.on('typing', (data) => { ... })

    socket.on('disconnect', () => {
      console.log(`[SOCKET] Disconnected: ${socket.id}`)
    })
  })

  return io
}

export default setupSocket
