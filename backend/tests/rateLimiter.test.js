const request = require("supertest");
const app = require("../src/app");
const Redis = require("ioredis-mock");

// Mock Redis client
jest.mock("ioredis", () => require("ioredis-mock"));

describe("Rate Limiter Middleware", () => {
  beforeEach(async () => {
    const redis = new Redis();
    await redis.flushall();
  });

  describe("API Rate Limiting", () => {
    it("should allow requests within the rate limit", async () => {
      const responses = await Promise.all(
        Array(5)
          .fill()
          .map(() => request(app).get("/api/events"))
      );

      responses.forEach((res) => {
        expect(res.status).not.toBe(429);
      });
    });

    it("should block requests exceeding the rate limit", async () => {
      // Make 101 requests (exceeding the 100 limit)
      const responses = await Promise.all(
        Array(101)
          .fill()
          .map(() => request(app).get("/api/events"))
      );

      // At least one request should be rate limited
      const rateLimited = responses.some((res) => res.status === 429);
      expect(rateLimited).toBe(true);
    });

    it("should include retry-after header in rate limit response", async () => {
      // Make enough requests to trigger rate limit
      const responses = await Promise.all(
        Array(101)
          .fill()
          .map(() => request(app).get("/api/events"))
      );

      const limitedResponse = responses.find((res) => res.status === 429);
      expect(limitedResponse.body).toHaveProperty("retryAfter");
      expect(typeof limitedResponse.body.retryAfter).toBe("number");
    });
  });
});
