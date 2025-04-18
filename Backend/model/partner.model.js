const mongoose = require("mongoose");
const validator = require("validator");

const partnerSchema = new mongoose.Schema(
  {
    aadhaar: {
      type: String,
      required: [true, "Please provide Aadhaar number"],
      validate: {
        validator: (val) => /^\d{12}$/.test(val),
        message: "Aadhaar must be a 12-digit number",
      },
    },
    pan: {
      type: String,
      required: [true, "Please provide PAN number"],
      uppercase: true,
      validate: {
        validator: (val) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val),
        message: "Invalid PAN format",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Partner", partnerSchema);
