require('dotenv').config();
const mongoose = require('mongoose');

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            maxPoolSize: 10, // Maximum number of connections in the pool
            minPoolSize: 1, // Minimum number of connections in the pool
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if no server is found
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        });
    }
    catch
    (error) {
        console.error('Database connection error:', error);
        throw new Error('Database connection failed');
    }
}

module.exports = connection;