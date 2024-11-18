const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");

describe("Auth Endpoints", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body.email).toBe("test@example.com");
    });

    it("should not register a user with existing email", async () => {
      await User.create({
        name: "Existing User",
        email: "existing@example.com",
        password: "password123",
      });

      const res = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "existing@example.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await User.create({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });
    });

    it("should login with valid credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
    });

    it("should not login with invalid password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /api/auth/validate", () => {
    it("should validate token successfully", async () => {
      // First register a user
      const registerRes = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      const token = registerRes.body.token;

      // Then validate the token
      const validateRes = await request(app)
        .get("/api/auth/validate")
        .set("Authorization", `Bearer ${token}`);

      expect(validateRes.status).toBe(200);
      expect(validateRes.body.success).toBe(true);
      expect(validateRes.body.data).toHaveProperty("email", "test@example.com");
    });

    it("should fail with invalid token", async () => {
      const res = await request(app)
        .get("/api/auth/validate")
        .set("Authorization", "Bearer invalid_token");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
