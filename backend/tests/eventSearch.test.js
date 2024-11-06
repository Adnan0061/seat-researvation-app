const request = require("supertest");
const app = require("../src/app");
const Event = require("../models/Event");
const { setupTestDB } = require("./helpers/setupTestDB");

setupTestDB();

describe("Event Search API", () => {
  beforeEach(async () => {
    // Create test events
    await Event.create([
      {
        title: "Concert A",
        description: "Rock concert",
        date: new Date("2024-06-01"),
        totalSeats: 100,
        availableSeats: 50,
        price: 50,
      },
      {
        title: "Concert B",
        description: "Jazz concert",
        date: new Date("2024-07-01"),
        totalSeats: 100,
        availableSeats: 0,
        price: 75,
      },
      {
        title: "Theater Show",
        description: "Drama performance",
        date: new Date("2024-08-01"),
        totalSeats: 100,
        availableSeats: 100,
        price: 100,
      },
    ]);
  });

  describe("GET /api/events/search", () => {
    it("should search events by query string", async () => {
      const res = await request(app)
        .get("/api/events/search")
        .query({ query: "concert" });

      expect(res.status).toBe(200);
      expect(res.body.events.length).toBe(2);
      expect(res.body.events[0].title).toMatch(/Concert/);
    });

    it("should filter events by date range", async () => {
      const res = await request(app).get("/api/events/search").query({
        startDate: "2024-06-01",
        endDate: "2024-07-31",
      });

      expect(res.status).toBe(200);
      expect(res.body.events.length).toBe(2);
    });

    it("should filter events by price range", async () => {
      const res = await request(app).get("/api/events/search").query({
        minPrice: 70,
        maxPrice: 100,
      });

      expect(res.status).toBe(200);
      expect(res.body.events.length).toBe(2);
    });

    it("should filter events with available seats", async () => {
      const res = await request(app)
        .get("/api/events/search")
        .query({ hasAvailableSeats: "true" });

      expect(res.status).toBe(200);
      expect(res.body.events.length).toBe(2);
      expect(res.body.events.every((e) => e.availableSeats > 0)).toBe(true);
    });

    it("should handle pagination correctly", async () => {
      const res = await request(app)
        .get("/api/events/search")
        .query({ limit: 2, skip: 1 });

      expect(res.status).toBe(200);
      expect(res.body.events.length).toBe(2);
      expect(res.body.page).toBe(1);
      expect(res.body.total).toBe(3);
    });

    it("should handle invalid search parameters", async () => {
      const res = await request(app)
        .get("/api/events/search")
        .query({ minPrice: "invalid" });

      expect(res.status).toBe(400);
    });
  });
});
