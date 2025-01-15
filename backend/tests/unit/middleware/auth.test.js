const jwt = require("jsonwebtoken");
const { protect, isAdmin } = require("../../../src/middleware/auth");
const User = require("../../../src/models/User");
const { createTestUser } = require("../../utils/testUtils");

describe("Auth Middleware", () => {
  let testUser;
  let testToken;
  describe("Protect Middleware", () => {
    beforeEach(async () => {
      const { user, token } = await createTestUser();
      testUser = user;
      testToken = token;
    });

    // Test scenario 1: No token provided
    it("should return 401 when no token is provided", async () => {
      const req = { headers: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("Not authorized, no token"),
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    // Test scenario 2: Invalid token format
    it("should return 401 when token format is invalid", async () => {
      const req = {
        headers: {
          authorization: "InvalidTokenFormat",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("Not authorized, no token"),
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    // Test scenario 3: Valid token, successful authentication
    it("should call next() when token is valid", async () => {
      const req = {
        headers: {
          authorization: `Bearer ${testToken}`,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await protect(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user._id.toString()).toBe(testUser._id.toString());
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    // Test scenario 4: Expired token
    it("should return 401 when token is expired", async () => {
      // Create an expired token
      const expiredToken = jwt.sign(
        { id: testUser._id },
        process.env.JWT_SECRET || "your_jwt_secret",
        { expiresIn: "-1d" } // Expired token
      );

      const req = {
        headers: {
          authorization: `Bearer ${expiredToken}`,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Not authorized, token failed",
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    // Test scenario 5: User no longer exists
    it("should return 401 when user no longer exists", async () => {
      // Delete the user
      await User.findByIdAndDelete(testUser._id);

      const req = {
        headers: {
          authorization: `Bearer ${testToken}`,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Not authorized, user not found",
        })
      );
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("isAdmin middleware", () => {
    it("should block non-admin users", async () => {
      const req = {
        user: { role: "user" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      try {
        await isAdmin(req, res, next);
      } catch (error) {
        expect(res.status).toHaveBeenCalledWith(403);
        expect(error.message).toBe("Not authorized as admin");
      }
    });
  });
});
