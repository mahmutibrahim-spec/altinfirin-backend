// src/config/db.js
// Establishes and manages the MongoDB connection via Mongoose.

import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // These options silence deprecation warnings in Mongoose 8+
    })

    console.log(`✅ MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`)
    // Exit process on failure — no point running without a DB
    process.exit(1)
  }
}

// Re-emit mongoose connection events for visibility in logs
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected')
})

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected')
})

export default connectDB
