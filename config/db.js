const mongoose = require("mongoose");

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development and across function invocations in serverless environments.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  const dbUri = process.env.DATABASE_URI;

  if (!dbUri) {
    throw new Error("DATABASE_URI is not defined in environment variables");
  }

  if (cached.conn) {
    console.log("Using existing MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      dbName: 'opticsGlasses',
      bufferCommands: false, // Disable Mongoose buffering for faster error detection in serverless
    };

    console.log("Connecting to MongoDB...");
    cached.promise = mongoose.connect(dbUri, opts).then((mongoose) => {
      console.log("✅ New MongoDB connection established");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("❌ MongoDB connection failed:", e.message);
    throw e;
  }

  return cached.conn;
};

module.exports = connectDB;