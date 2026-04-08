import mongoose from 'mongoose'

const savedJobSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
  },
  { timestamps: true }
)

// Mỗi candidate chỉ lưu 1 job 1 lần
savedJobSchema.index({ candidateId: 1, jobId: 1 }, { unique: true })

// Index hỗ trợ query danh sách saved jobs của candidate (sắp theo thời gian lưu)
savedJobSchema.index({ candidateId: 1, createdAt: -1 })

const SavedJob = mongoose.model('SavedJob', savedJobSchema)
export default SavedJob
