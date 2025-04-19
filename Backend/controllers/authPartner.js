const CustomError = require("../errors");
const Partner = require("../model/partner.model");
const User = require("../model/user.model");

const registerPartner = async (req, res) => {
  const { aadhaar, pan } = req.body;
  console.log("aadhaar: ", aadhaar, "pan: ", pan);
  const user = await User.findById(req.user.userId);
  if (!user) {
    throw new CustomError.notFoundError("User not found");
  }
  if (!/^\d{12}$/.test(aadhaar)) {
    throw new CustomError.BadRequestError("Enter a valid Aadhaar number");
  }
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panRegex.test(pan)) {
    throw new CustomError.BadRequestError("Invalid PAN format");
  }
  const existingPartner = await Partner.findOne({ user: user._id });
  if (existingPartner) {
    throw new CustomError.BadRequestError(
      "Partner already registered for this user"
    );
  }
  user.isVerifiedOwner = true;
  user.role = "owner";
  await user.save();
  const partner = await Partner.create({
    aadhaar,
    pan,
    user: user._id,
  });

  res.status(201).json({
    msg: "Partner registered successfully",
    partner,
  });
};
module.exports = { registerPartner };
