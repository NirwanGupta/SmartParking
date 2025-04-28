const mongoose = require("mongoose");
const validator = require("validator");

const parkingSlotSchema = new mongoose.Schema(
  {
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parking", // assuming another model 'Parking' exists (for location)
    },
    floor: {
      type: String,
      required: [true, "Floor cannot be empty"],
    },
    slot: {
      type: Number,
      required: [true, "Slot cannot be empty"],
    },
    inWaiting: {
      type: Boolean,
      default: false,
    },
    isOccupied: {
      type: Boolean,
      default: false,
    },
    parkingInfo: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: [true, "User ID is required"],
        },
        vehicleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Vehicle",
          required: [true, "Vehicle ID is required"],
        },
        startTime: {
          type: Date,
          required: [true, "Start time is required"],
          default: Date.now, // optional default
        },
        endTime: {
          type: Date,
          required: [true, "End time is required"],
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ParkingSlot", parkingSlotSchema);
