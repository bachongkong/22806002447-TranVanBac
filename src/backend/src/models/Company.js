import mongoose from 'mongoose'
import { COMPANY_STATUS } from '../common/constants.js'

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    logo: { type: String, default: '' },
    description: { type: String, default: '' },
    website: { type: String, default: '' },
    industry: { type: String, default: '' },
    companySize: { type: String, default: '' },
    location: { type: String, default: '' },
    socialLinks: {
      linkedin: String,
      facebook: String,
    },
    status: {
      type: String,
      enum: Object.values(COMPANY_STATUS),
      default: COMPANY_STATUS.PENDING,
    },
    hrMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

const Company = mongoose.model('Company', companySchema)
export default Company
