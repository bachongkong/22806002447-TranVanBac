import mongoose from 'mongoose'
import { INTERVIEW_TYPES } from '../common/constants.js'

const interviewSchema = new mongoose.Schema(
  {
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
    roundNumber: { type: Number, default: 1 },
    scheduledAt: { type: Date, required: true },
    interviewerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    type: {
      type: String,
      enum: Object.values(INTERVIEW_TYPES),
      default: INTERVIEW_TYPES.ONLINE,
    },
    meetingLink: { type: String, default: '' },
    location: { type: String, default: '' },
    notes: { type: String, default: '' },
    result: { type: String, default: '' },
  },
  { timestamps: true }
)

const Interview = mongoose.model('Interview', interviewSchema)
export default Interview
