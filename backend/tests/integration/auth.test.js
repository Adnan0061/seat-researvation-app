const request = require("supertest");
const app = require("../../src/app");

describe("Auth Endpoints", () => {
  const userData = {
    name: "Test User",
    email: "test@example.com",
    password: "password123",
  };
  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      console.log("should register a new user successfully start");

      const res = await request(app).post("/api/auth/register").send(userData);
      console.log(
        "should register a new user successfully res",
        res.status,
        res.body,
        res.body.email == userData.email
      );

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body.email).toBe(userData.email);
    });

    it("should not register user with existing email", async () => {
      console.log("should not register user with existing email start");

      await request(app).post("/api/auth/register").send(userData);
      const res = await request(app).post("/api/auth/register").send(userData);

      console.log(
        "should not register user with existing email res",
        res.status,
        // res,
        res.body.message
      );
      expect(res.status).toBe(400);
      expect(res.body.message).toContain("already exists");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login successfully with correct credentials", async () => {
      console.log("should login successfully with correct credentials start");

      await request(app).post("/api/auth/register").send(userData);
      const res = await request(app).post("/api/auth/login").send({
        email: userData.email,
        password: userData.password,
      });

      console.log(
        "should login successfully with correct credentials res",
        res.status,
        res.body.token
      );
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
    });

    it("should not login with incorrect password", async () => {
      console.log("should not login with incorrect password start");

      await request(app).post("/api/auth/register").send(userData);
      const res = await request(app).post("/api/auth/login").send({
        email: userData.email,
        password: "wrongpassword",
      });

      console.log("should not login with incorrect password res", res.status);
      expect(res.status).toBe(401);
    });
  });
});
