const request = require("supertest");
const app = require("../src/app");
const { createTestUser } = require("./helpers/testUtils");

describe("Event Endpoints", () => {
  let adminToken;
  let userToken;
  let testEvent;

  beforeEach(async () => {
    const admin = await createTestUser("admin");
    const user = await createTestUser("user");
    adminToken = admin.token;
    userToken = user.token;

    // Create a test event
    const eventRes = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Test Event",
        description: "Test Description",
        date: new Date("2024-12-31"),
        totalSeats: 100,
        price: 50,
      });

    testEvent = eventRes.body;
  });

  describe("GET /api/events", () => {
    it("should get all events", async () => {
      const res = await request(app).get("/api/events");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe("POST /api/events", () => {
    it("should create event when admin", async () => {
      const res = await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          title: "New Event",
          description: "New Description",
          date: new Date("2024-12-31"),
          totalSeats: 100,
          price: 50,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.title).toBe("New Event");
    });

    it("should not create event when user", async () => {
      const res = await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          title: "New Event",
          description: "New Description",
          date: new Date("2024-12-31"),
          totalSeats: 100,
          price: 50,
        });

      expect(res.statusCode).toBe(403);
    });
  });

  describe("PUT /api/events/:id", () => {
    it("should update event when admin", async () => {
      const res = await request(app)
        .put(`/api/events/${testEvent._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          title: "Updated Event",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe("Updated Event");
    });
  });

  describe("DELETE /api/events/:id", () => {
    it("should delete event when admin", async () => {
      const res = await request(app)
        .delete(`/api/events/${testEvent._id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
    });
  });
});
