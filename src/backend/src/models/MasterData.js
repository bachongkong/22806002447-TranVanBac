import mongoose from 'mongoose'

const masterDataSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

// Ensure each type of dimension (skill, category) holds distinct values
masterDataSchema.index({ type: 1, value: 1 }, { unique: true })

const MasterData = mongoose.model('MasterData', masterDataSchema)
export default MasterData
