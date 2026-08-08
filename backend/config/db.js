const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("URI loaded:", !!process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("Database Connection Error:");
    console.error(error);

    process.exit(1);
  }
};

module.exports = connectDB;