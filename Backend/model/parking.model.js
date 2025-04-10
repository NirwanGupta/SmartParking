const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema(
  {
    locationId: {
      type: String,
      default: () => uuidv4(), // generates a unique ID
      unique: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      type: String,
      required: [true, "Address cannot be empty"],
    },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    parkingInfo: {
      floors: [
        {
          name: { type: String, required: true },
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
      ],
    },
  },
  { timestamps: true }
);

const Parking = mongoose.model("Location", parkingSchema);

module.exports = Parking;
