import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { createServer } from 'http'
import path from 'path'

import { env, connectDB } from './config/index.js'
import { errorHandler } from './middleware/index.js'
import apiRoutes from './routes/index.js'
import setupSocket from './sockets/index.js'

// ============================================
// Express App
// ============================================
const app = express()
const httpServer = createServer(app)

// --- Global Middleware ---
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use('/public', express.static(path.join(process.cwd(), 'public')))

// --- API Routes ---
app.use('/api', apiRoutes)

// --- Error Handler (phải đặt sau routes) ---
app.use(errorHandler)

// --- Socket.io ---
// setupSocket trả về { io, chatNamespace, notificationNamespace }
const { io, chatNamespace, notificationNamespace } = setupSocket(httpServer)

// Gắn vào app để controllers emit event qua đúng namespace:
//   req.app.get('io')                    — root io instance
//   req.app.get('chatNamespace')         — namespace /chat
//   req.app.get('notificationNamespace') — namespace /notifications
app.set('io', io)
app.set('chatNamespace', chatNamespace)
app.set('notificationNamespace', notificationNamespace)

// ============================================
// Start Server
// ============================================
const startServer = async () => {
  await connectDB()

  httpServer.listen(env.PORT, () => {
    console.log(`[OK] Server running on http://localhost:${env.PORT}`)
    console.log(`[INFO] Environment: ${env.NODE_ENV}`)
  })
}

startServer()
