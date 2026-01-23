const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/devstinder'
    await mongoose.connect(mongoURI)
    console.log("Mongo connected successfully")
  } catch (error) {
    console.error("Mongo connection error:", error)
    process.exit(1)
  }
}

module.exports = connectDB