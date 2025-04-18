const mongoose = require(`mongoose`);
const validator = require(`validator`);
const parkingSchema = new mongoose.Schema(
  {
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
            occupiedSlotNumbers: [{ type: Number, default: [] }],
          },
          fourWheeler: {
            totalSlots: { type: Number, required: true },
            occupiedSlots: { type: Number, default: 0 },
            ratePerHour: { type: Number, required: true },
            occupiedSlotNumbers: [{ type: Number, default: [] }],
          },
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Parking", parkingSchema);