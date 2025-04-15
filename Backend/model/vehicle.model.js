const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: [true, "License plate is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parkingSlot: {
      address: {
        type: String,
        trim: true,
      },
      floor: {
        type: String,
        trim: true,
      },
      slot: {
        type: String,
        trim: true,
      },
    },
    checkInTime: {
      type: Date,
    },
    checkOutTime: {
      type: Date,
    },
    isParked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);