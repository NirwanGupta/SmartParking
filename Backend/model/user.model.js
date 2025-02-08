const mongoose = require(`mongoose`);
const validator = require(`validator`);
const bcrypt = require(`bcryptjs`);

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Provide your name"],
        maxlength: 30,
        minlength: 3,
    },
    password: {
        type: String,
        required: [true, "Enter your passwprd"],
        minlength: 8,
    },
    email: {
        type: String,
        required: [true, "Please provide valid email"],
        validate: {
            validator: validator.isEmail,
            message: "Please provide a valid email",
        },
        unique: true,
    },
    phone: {
        type: String,
        validate: {
            validator: function(value) {
                return this.phone.length === 10 && !isNaN(this.phone);
            },
            message: "Please enter a valid phone number",
        },
    },
    vehicles: {
        type: [String],
        default: [],
    },
    role: {
        type: String,
        enum: ['admin','user'],
        default: 'user',
    },
    image: {
        type: String,
    },
    verificationToken: String,
    isVerified: {
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
},{timestamps: true});

userSchema.pre(`save`, async function() {
    if(!this.isModified('password'))    return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};

module.exports = mongoose.model('User', userSchema);