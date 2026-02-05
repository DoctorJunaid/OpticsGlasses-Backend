const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const dbUri = process.env.DATABASE_URI;

    if (!dbUri) {
      throw new Error("DATABASE_URI is not defined in environment variables");
    }

    // Attempt to connect
    const conn = await mongoose.connect(dbUri, {
      // Mongoose 6+ has these as default, but good to be explicit for stability
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'opticsGlasses' // Ensure correct database name is used
    });

    console.log(`✅ Database connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    // DO NOT process.exit(1) on serverless environments like Vercel
    // Instead, throw the error so the calling function can handle it or let it respond with 500
    throw error;
  }
};

module.exports = connectDB;