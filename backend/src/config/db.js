const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // If already connected, return
    if (mongoose.connection.readyState === 1) {
      return;
    }

    const uri =
      process.env.NODE_ENV === "test"
        ? process.env.MONGODB_TEST_URI
        : process.env.MONGODB_URI;

    // const conn = await mongoose.connect(uri, {
    //       dbName:
    //         process.env.NODE_ENV === "test"
    //           ? "test_event_reservation"
    //           : "event_reservation",
    //     });

    await mongoose.connect(uri, {
      dbName:
        process.env.NODE_ENV === "test"
          ? "test_event_reservation"
          : "event_reservation",
    });
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // process.exit(1);
    throw error;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB Disconnected");
  } catch (error) {
    console.error(`Error disconnecting: ${error.message}`);
  }
};

module.exports = { connectDB, disconnectDB };
