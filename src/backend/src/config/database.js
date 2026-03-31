import mongoose from 'mongoose'
import env from './env.js'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI)
    console.log(`[OK] MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`[ERROR] MongoDB connection error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
