const LoggingMiddleware = require("./LoggingMiddleware");
const checkRole = require("./CheckRoleMiddleware");
const authMiddleware = require("./AuthenticationMiddleware");
const {
  ErrorHandler,
  AsyncWrapController,
  HandledError,
} = require("./ErrorHandlingMiddleware");
const db = require("../models");

// Mock the database models
jest.mock("../models", () => ({
  User: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn().mockResolvedValue({
      username: "newuser",
      email: "new@test.com",
      role: "user",
    }),
  },
}));

describe("Middleware Tests", () => {
  // LoggingMiddleware tests
  describe("LoggingMiddleware", () => {
    it("should log request details and call next", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();
      const req = { method: "GET", originalUrl: "/test", params: {}, body: {} };
      const res = {};
      const next = jest.fn();

      LoggingMiddleware(req, res, next);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Requesting GET /test /w",
        {},
        {}
      );
      expect(next).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  // CheckRoleMiddleware tests
  describe("CheckRoleMiddleware", () => {
    it("should allow access for user with correct role", async () => {
      const req = { headers: { utorid: "testuser" } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const next = jest.fn();

      db.User.findOne.mockResolvedValue({ role: "admin" });

      await checkRole(["admin"])(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should deny access for user with incorrect role", async () => {
      const req = { headers: { utorid: "testuser" } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const next = jest.fn();

      db.User.findOne.mockResolvedValue({ role: "user" });

      await checkRole(["admin"])(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith("Not authorized");
    });

    it("should handle database errors", async () => {
      const req = { headers: { utorid: "testuser" } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const next = jest.fn();

      db.User.findOne.mockRejectedValue(new Error("Database error"));

      await checkRole(["admin"])(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Server error");
    });
  });

  // AuthenticationMiddleware tests
  describe("AuthenticationMiddleware", () => {
    it("should create a new user if not found", async () => {
      const req = { headers: { utorid: "newuser", http_mail: "new@test.com" } };
      const res = {};
      const next = jest.fn();

      db.User.findByPk.mockResolvedValue(null);
      db.User.create.mockResolvedValue({
        username: "newuser",
        email: "new@test.com",
        role: "user",
      });

      await authMiddleware(req, res, next);

      expect(db.User.create).toHaveBeenCalledWith({
        username: "newuser",
        email: "new@test.com",
        role: "user",
      });
      expect(req.user).toBeDefined();
      expect(next).toHaveBeenCalled();
    });

    it("should use existing user if found", async () => {
      const existingUser = {
        username: "existinguser",
        email: "existing@test.com",
        role: "user",
      };
      const req = {
        headers: { utorid: "existinguser", http_mail: "existing@test.com" },
      };
      const res = {};
      const next = jest.fn();

      db.User.findByPk.mockResolvedValue(existingUser);

      await authMiddleware(req, res, next);

      expect(db.User.create).not.toHaveBeenCalled();
      expect(req.user).toEqual(existingUser);
      expect(next).toHaveBeenCalled();
    });

    it("should handle errors", async () => {
      const req = { headers: {} };
      const res = {};
      const next = jest.fn();

      await authMiddleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(HandledError));
      expect(next.mock.calls[0][0].code).toBe(400);
      expect(next.mock.calls[0][0].message).toBe("Missing required headers");
    });
  });

  // ErrorHandlingMiddleware tests
  describe("ErrorHandlingMiddleware", () => {
    describe("ErrorHandler", () => {
      it("should handle HandledError", () => {
        const err = new HandledError(400, "Bad Request");
        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        ErrorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Bad Request" });
      });

      it("should handle generic errors", () => {
        const err = new Error("Generic Error");
        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        ErrorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Generic Error" });
      });
    });

    describe("AsyncWrapController", () => {
      it("should wrap controller methods with AsyncDecorator", () => {
        const controller = {
          method1: jest.fn(),
          method2: jest.fn(),
        };

        AsyncWrapController(controller);

        expect(controller.method1).not.toBe(jest.fn());
        expect(controller.method2).not.toBe(jest.fn());
      });
    });
  });
});
