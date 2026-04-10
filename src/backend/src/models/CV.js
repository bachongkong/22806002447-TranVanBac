import mongoose from 'mongoose'
import { CV_SOURCE_TYPES } from '../common/constants.js'

const cvSchema = new mongoose.Schema(
  {
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    fileUrl: { type: String, default: '' },
    isDefault: { type: Boolean, default: false },
    sourceType: {
      type: String,
      enum: Object.values(CV_SOURCE_TYPES),
      default: CV_SOURCE_TYPES.UPLOAD,
    },
    parsedData: {
      summary: String,
      skills: [String],
      education: [{ school: String, degree: String, field: String, from: Date, to: Date }],
      experience: [{ company: String, position: String, from: Date, to: Date, description: String }],
      projects: [{ name: String, description: String, url: String }],
    },
  },
  { timestamps: true }
)

const CV = mongoose.model('CV', cvSchema)
export default CV
