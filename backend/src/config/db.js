const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://adnanahmed0061:XXFHtD4pdlkHNHnl@cluster0.9bzau.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      {
        dbName: "event_reservation",
      }
    );
    // console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // process.exit(1);
    throw error;
  }
};

module.exports = connectDB;
