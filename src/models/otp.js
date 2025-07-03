const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        default: new Date(Date.now() + 60 * 1000),
        index: { expires: '1m' }
    }
})

module.exports = mongoose.model('otp', otpSchema);