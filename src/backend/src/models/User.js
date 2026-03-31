import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { ROLES, USER_STATUS } from '../common/constants.js'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // không trả về khi query
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.CANDIDATE,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
    },
    profile: {
      fullName: { type: String, default: '' },
      avatar: { type: String, default: '' },
      phone: { type: String, default: '' },
      address: { type: String, default: '' },
      // Candidate-specific
      skills: [String],
      education: [
        {
          school: String,
          degree: String,
          field: String,
          from: Date,
          to: Date,
        },
      ],
      experience: [
        {
          company: String,
          position: String,
          from: Date,
          to: Date,
          description: String,
        },
      ],
      portfolioLinks: [String],
      expectedSalary: Number,
      preferredLocation: String,
      // HR-specific
      roleTitle: { type: String, default: '' },
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      default: null,
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
)

// Hash password trước khi save
userSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) return
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12)
})

// So sánh password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash)
}

const User = mongoose.model('User', userSchema)
export default User
