const mongoose = require("mongoose");

const passengerRecordSchema = new mongoose.Schema(
  {
    passengerId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    passengerName: {
      type: String,
      required: true,
      trim: true,
    },
    stationCode: {
      type: String,
      required: true,
      index: true,
    },
    entryStation: {
      type: String,
      required: true,
    },
    exitStation: {
      type: String,
      required: true,
    },
    tripDate: {
      type: Date,
      required: true,
      index: true,
    },
    fare: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "mobile"],
      default: "card",
    },
    status: {
      type: String,
      enum: ["completed", "cancelled", "pending"],
      default: "completed",
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common query patterns
passengerRecordSchema.index({ stationCode: 1, tripDate: -1 });
passengerRecordSchema.index({ status: 1, tripDate: -1 });
passengerRecordSchema.index({ passengerId: 1, tripDate: -1 });

module.exports = mongoose.model("PassengerRecord", passengerRecordSchema);
