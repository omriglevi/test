const Mongoose = require("mongoose")
require('dotenv').config()

const uri = process.env.MONGODB_URI

const connectDB = async () => {
    if (!uri) {
        throw new Error(
            'MongoDB URI is missing! Please provide one to proceed.'
        )
    }

    console.log('Connecting to MongoDB');
    await Mongoose.connect(uri)
    console.log('MongoDB Connected')
}

module.exports = { connectDB }
