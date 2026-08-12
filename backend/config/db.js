const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }
  
  if (!process.env.MONGO_URI) {
    console.warn("MONGO_URI environment variable is not defined");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("Database Connection Error:", error.message);
    // Avoid process.exit(1) in serverless functions to prevent FUNCTION_INVOCATION_FAILED
  }
};

module.exports = connectDB;