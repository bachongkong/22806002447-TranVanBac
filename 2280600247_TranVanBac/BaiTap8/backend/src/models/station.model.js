const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema(
  {
    stationCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    stationName: {
      type: String,
      required: true,
      trim: true,
    },
    line: {
      type: String,
      required: true,
    },
    zone: {
      type: Number,
      min: 1,
      max: 3,
      default: 1,
    },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Station", stationSchema);
