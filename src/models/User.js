const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String, required: true, trim: true
    },
    password: {
        type: String, required: true, trim: true
    },
    email: {
        type: String, required: true, trim: true, unique: true
    },
    role: {
        type: String, required: true, default: 'user', enum: ['user', 'admin']
    }
})

module.exports = mongoose.model('User', userSchema);