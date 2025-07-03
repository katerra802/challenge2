require('dotenv').config();
const mongoose = require('mongoose');

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)

        console.log('Database connected successfully');
    }
    catch
    (error) {
        console.error('Database connection error:', error);
        throw new Error('Database connection failed');
    }
}

module.exports = connection;