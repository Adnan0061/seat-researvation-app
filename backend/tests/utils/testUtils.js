const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../src/models/User");
const Event = require("../../src/models/Event");
const { faker } = require("@faker-js/faker");

const generateTestToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "test_secret", {
    expiresIn: "1h",
  });
};

const createTestUser = async (role = "user") => {
  const user = await User.create({
    name: faker.internet.username(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role,
  });
  const token = generateTestToken(user._id);
  return { user, token };
};

const createTestEvent = async (overrides = {}) => {
  return await Event.create({
    title: faker.word.noun(),
    description: faker.lorem.paragraph(),
    date: new Date(),
    totalSeats: 100,
    availableSeats: 100,
    price: 100,
    version: 0,
    ...overrides,
  });
};

const mockSendMail = jest.fn().mockResolvedValue({ messageId: "test-id" });

jest.mock("../../src/services/emailService", () => ({
  sendReservationConfirmation: mockSendMail,
}));

module.exports = {
  generateTestToken,
  createTestUser,
  createTestEvent,
  mockSendMail,
};
