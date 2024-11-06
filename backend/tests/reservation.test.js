const request = require("supertest");
const app = require("../src/app");
const { createTestUser } = require("./helpers/testUtils");
const Event = require("../src/models/Event");

describe("Reservation Endpoints", () => {
  let userToken;
  let testEvent;
  let user;

  beforeEach(async () => {
    const userAuth = await createTestUser("user");
    userToken = userAuth.token;
    user = userAuth.user;

    // Create test event
    testEvent = await Event.create({
      title: "Test Event",
      description: "Test Description",
      date: new Date("2024-12-31"),
      totalSeats: 100,
      availableSeats: 100,
      price: 50,
    });
  });

  describe("POST /api/reservations", () => {
    it("should create a reservation successfully", async () => {
      const res = await request(app)
        .post("/api/reservations")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          eventId: testEvent._id,
          numberOfSeats: 2,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.numberOfSeats).toBe(2);
      expect(res.body.status).toBe("confirmed");
    });

    it("should fail when requesting more seats than available", async () => {
      const res = await request(app)
        .post("/api/reservations")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          eventId: testEvent._id,
          numberOfSeats: 101,
        });

      expect(res.statusCode).toBe(400);
    });

    it("should handle concurrent reservations correctly", async () => {
      const numberOfConcurrentRequests = 5;
      const seatsPerRequest = 20;

      const requests = Array(numberOfConcurrentRequests)
        .fill()
        .map(() =>
          request(app)
            .post("/api/reservations")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
              eventId: testEvent._id,
              numberOfSeats: seatsPerRequest,
            })
        );

      const results = await Promise.all(requests);
      const successfulReservations = results.filter(
        (res) => res.statusCode === 201
      );

      // Check that we didn't oversell
      const updatedEvent = await Event.findById(testEvent._id);
      expect(updatedEvent.availableSeats).toBe(
        100 - successfulReservations.length * seatsPerRequest
      );
    });
  });

  describe("GET /api/reservations", () => {
    it("should get user reservations", async () => {
      // Create a test reservation first
      await request(app)
        .post("/api/reservations")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          eventId: testEvent._id,
          numberOfSeats: 2,
        });

      const res = await request(app)
        .get("/api/reservations")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
    });
  });
});
