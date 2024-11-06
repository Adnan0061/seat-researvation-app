const jwt = require("jsonwebtoken");
const User = require("../../src/models/User");

const generateTestToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "test_secret");
};

const createTestUser = async (role = "user") => {
  const user = await User.create({
    name: "Test User",
    email: `test${Date.now()}@example.com`,
    password: "password123",
    role,
  });
  const token = generateTestToken(user._id);
  return { user, token };
};

module.exports = {
  generateTestToken,
  createTestUser,
};
