const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 3000 // Timeout fast
        });
        console.log('MongoDB Connected...');
        global.hasMongoDB = true;
    } catch (err) {
        console.error('MongoDB Connection Failed (Expected if no local DB). Switching to In-Memory Mode.');
        global.hasMongoDB = false;
        // Do NOT exit
    }
};

module.exports = connectDB;
