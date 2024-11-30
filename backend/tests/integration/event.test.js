const request = require("supertest");
const app = require("../../src/app");
const { createTestUser, createTestEvent } = require("../utils/testUtils");

describe("Event Endpoints", () => {
  let adminToken;
  let userToken;

  beforeEach(async () => {
    const admin = await createTestUser("admin");
    const user = await createTestUser("user");
    adminToken = admin.token;
    userToken = user.token;
  });

  describe("GET /api/events", () => {
    it("should return list of events", async () => {
      await createTestEvent();
      // await createTestEvent();

      const res = await request(app).get("/api/events");
      console.log("res.body", res.body.length, "res.status", res.status);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body).toHaveLength(1);
    });

    // it("should support pagination", async () => {
    //   console.log("pagination test started");
    //   for (let i = 0; i < 15; i++) {
    //     await createTestEvent();
    //   }

    //   const res = await request(app)
    //     .get("/api/events")
    //     .query({ page: 1, limit: 10 });

    //   console.log("pagination test", res.body.length);

    //   expect(res.status).toBe(200);
    //   expect(res.body.events).toHaveLength(10);
    //   expect(res.body).toHaveProperty("totalPages");
    // });
  });

  describe("POST /api/events", () => {
    it("should create event when admin", async () => {
      console.log("create event when admin test started");

      const eventData = {
        title: "Test Event",
        description: "Test Description",
        date: new Date().toISOString(),
        totalSeats: 100,
        price: 50,
      };

      const res = await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(eventData);

      console.log("create event test", res.body);

      expect(res.status).toBe(201);
      expect(res.body.title).toBe(eventData.title);
    });

    it("should not create event when user", async () => {
      console.log("do not create event when admin test started");

      const eventData = {
        title: "Test Event",
        description: "Test Description",
        date: new Date().toISOString(),
        totalSeats: 100,
        price: 50,
      };

      const res = await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${userToken}`)
        .send(eventData);

      console.log("do not create event test", res.status);

      expect(res.status).toBe(403);
    });
  });
});
