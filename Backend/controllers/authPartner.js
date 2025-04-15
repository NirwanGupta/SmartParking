const CustomError = require("../errors");
const Partner = require("../model/partner"); // assuming you have a Partner model
const User=require('../model/user.model')
const registerPartner = async (req, res) => {
  const { name, email, password, aadhaar, pan } = req.body;

  if (!name || !email || !password || !aadhaar || !pan) {
    throw new CustomError.BadRequestError(
      "Please provide all required details: name, email, password, Aadhaar, PAN"
    );
  }

  // Aadhaar must be exactly 12 digits
  if (!/^\d{12}$/.test(aadhaar)) {
    throw new CustomError.BadRequestError(
      "Aadhaar number must be exactly 12 digits"
    );
  }

  // Optional PAN validation (Indian PAN format)
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panRegex.test(pan)) {
    throw new CustomError.BadRequestError("Invalid PAN format");
  }

  // Check if user already exists
  const existingPartner = await Partner.findOne({ email });
  if (existingPartner) {
    throw new CustomError.BadRequestError(
      "Partner already registered with this email"
    );
  }

  // Create partner entry
  const partner = await Partner.create({
    name,
    email,
    password, // ensure this gets hashed inside the model
    aadhaar,
    pan,
  });

  res
    .status(201)
    .json({
      msg: "Partner registered successfully. Please verify your email.",
    });
};
