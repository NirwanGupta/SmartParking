const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: [true, "License plate is required"],
      unique: true,
      trim: true,
      uppercase: true, // Standard format
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
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model
      required: true,
    },
    parkingSlot: {
      type: String, // Can be an ID if using a ParkingSlot model
    },
    checkInTime: {
      type: Date,
    },
    checkOutTime: {
      type: Date, // Null until checked out
    },
    isParked: {
      type: Boolean,
      default: false, // When the car is parked, it's true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
