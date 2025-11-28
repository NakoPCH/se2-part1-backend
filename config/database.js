// config/database.js

import mongoose from "mongoose";

/**
 * Connects to MongoDB if MONGO_URI is provided.
 * If not, the app will transparently fall back to mock data.
 */
export const connectDatabase = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.log("[DB] MONGO_URI not set. Using in-memory mock data only.");
    return;
  }

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("[DB] MongoDB connected.");
  } catch (error) {
    console.error("[DB] MongoDB connection error:", error.message);
    console.error("[DB] Falling back to in-memory mock data.");
  }
};
