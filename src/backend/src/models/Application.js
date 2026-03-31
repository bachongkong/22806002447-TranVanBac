import mongoose from 'mongoose'
import { APPLICATION_STATUS } from '../common/constants.js'

const applicationSchema = new mongoose.Schema(
  {
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    cvId: { type: mongoose.Schema.Types.ObjectId, ref: 'CV', required: true },
    coverLetter: { type: String, default: '' },
    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: APPLICATION_STATUS.SUBMITTED,
    },
    statusHistory: [
      {
        status: String,
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        changedAt: { type: Date, default: Date.now },
        note: String,
      },
    ],
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

// Prevent duplicate application: 1 candidate chỉ apply 1 lần cho 1 job
applicationSchema.index({ candidateId: 1, jobId: 1 }, { unique: true })

const Application = mongoose.model('Application', applicationSchema)
export default Application
