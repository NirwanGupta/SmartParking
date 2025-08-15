const mongoose = require(`mongoose`);
const validator = require(`validator`);

const parkingSchema = new mongoose.Schema(
  {
    organization: {
      type: String,
      required: true,
    },
    buildingName: {
      type: String,
      required: true,
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
        ratePerHour: { type: Number, required: true },
        occupiedSlotNumbers: [
          {
            slotNumber: { type: Number, required: true },
            occupiedUntil: { type: Date, required: true }, // when slot becomes free
          }
        ],
      },
      fourWheeler: {
        totalSlots: { type: Number, required: true },
        ratePerHour: { type: Number, required: true },
        occupiedSlotNumbers: [
          {
            slotNumber: { type: Number, required: true },
            occupiedUntil: { type: Date, required: true },
          }
        ],
      },
    },
  ],
}

  },
  { timestamps: true }
);

module.exports = mongoose.model("Parking", parkingSchema);
