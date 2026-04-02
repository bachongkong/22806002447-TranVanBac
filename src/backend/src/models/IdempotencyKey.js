import mongoose from 'mongoose'

const idempotencyKeySchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requestPath: { type: String, required: true },
    status: {
      type: String,
      enum: ['processing', 'completed', 'error'],
      default: 'processing',
    },
    responseBody: { type: mongoose.Schema.Types.Mixed },
    responseStatus: { type: Number },
    // Tự động xóa sau 24 tiếng (86400 giây) để tiết kiệm db
    createdAt: { type: Date, default: Date.now, expires: 86400 },
  }
)

// Đảm bảo mỗi user có 1 key unique tại một thời điểm
idempotencyKeySchema.index({ key: 1, userId: 1 }, { unique: true })

const IdempotencyKey = mongoose.model('IdempotencyKey', idempotencyKeySchema)
export default IdempotencyKey
