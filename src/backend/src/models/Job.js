import mongoose from 'mongoose'
import { JOB_STATUS } from '../common/constants.js'

const jobSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    createdByHR: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    requirements: { type: String, default: '' },
    benefits: { type: String, default: '' },
    salaryRange: {
      min: Number,
      max: Number,
    },
    location: { type: String, default: '' },
    employmentType: { type: String, default: '' },
    experienceLevel: { type: String, default: '' },
    skills: [String],
    status: {
      type: String,
      enum: Object.values(JOB_STATUS),
      default: JOB_STATUS.DRAFT,
    },
    expiresAt: Date,
  },
  { timestamps: true }
)

// Index cho search
jobSchema.index({ title: 'text', description: 'text', skills: 'text' })
jobSchema.index({ status: 1, createdAt: -1 })

const Job = mongoose.model('Job', jobSchema)
export default Job
