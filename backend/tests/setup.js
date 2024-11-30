require("dotenv").config({ path: ".env.test" });
const mongoose = require("mongoose");
const { connectDB, disconnectDB } = require("../src/config/db");

beforeAll(async () => {
  await connectDB();
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await disconnectDB();
});
