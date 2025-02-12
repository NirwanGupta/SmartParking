const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    address: {
      type: String,
      required: [true, "Address cannot empty"],
    },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    parkingInfo: {
      twoWheeler: {
        totalSlots: { type: Number, required: true },
        occupiedSlots: { type: Number, default: 0 },
        ratePerHour: { type: Number, required: true },
      },
      fourWheeler: {
        totalSlots: { type: Number, required: true },
        occupiedSlots: { type: Number, default: 0 },
        ratePerHour: { type: Number, required: true },
      },
    },
  },
  { timestamps: true }
);

const Parking = mongoose.model("Location", parkingSchema);

module.exports = Parking;
