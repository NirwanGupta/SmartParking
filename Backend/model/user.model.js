const mongoose = require(`mongoose`);
const validator = require(`validator`);
const bcrypt = require(`bcryptjs`);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Provide your name"],
      maxlength: 30,
      minlength: 3,
    },
    password: {
      type: String,
      required: [true, "Enter your password"],
      minlength: 8,
    },
    email: {
      type: String,
      required: [true, "Please provide a valid email"],
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email",
      },
      unique: true,
    },
    credits:{
      type:Number,
      default:0.0,
    },
    phone: {
      type: String,
      default: undefined, 
      validate: {
        validator: function (value) {
          return !value || /^[0-9]{10}$/.test(value);
        },
        message: "Phone number must be exactly 10 digits",
      },
    },
    vehicles: {
      type: [String],
      default: [],
    },
    role: {
      type: String,
      enum: ["admin", "user","owner"],
      default: "user",
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/dkirn5nxr/image/upload/f_auto,q_auto/istockphoto-1451587807-612x612_zwjgfx",
    },
    verificationToken: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    isVerifiedOwner:{
      type: Boolean,
      default: false,
    },
    verified: Date,
    passwordToken: {
      type: String,
    },
    passwordTokenExpirationDate: {
      type: Date,
    },
    location: {
      type: String,
    }
  },
  { timestamps: true }
);

userSchema.pre(`save`, async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", userSchema);
