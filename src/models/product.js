const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        set: (value) => {
            if (value < 0 || value === undefined || value === null) {
                return 0;
            }
            return value;
        },
        default: 0
    },
    create_At: {
        type: Date,
        default: Date.now
    },
    update_At: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Product', productSchema);