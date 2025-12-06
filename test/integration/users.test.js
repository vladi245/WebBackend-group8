import request from "supertest";
import app from "../../src/app.js";
import jwt from "jsonwebtoken";

// ---- Mock UserModel.getAll() ----
jest.mock("../../models/User.js", () => ({
  UserModel: {
    getAll: jest.fn().mockResolvedValue([
      { id: 1, name: "Test User 1" },
      { id: 2, name: "Test User 2" }
    ])
  }
}));

const JWT_SECRET = "change_this_secret_in_production";

function generateTestToken() {
  return jwt.sign({ id: 123, email: "test@test.com", type: "admin" }, JWT_SECRET, {
    expiresIn: "1h"
  });
}

describe("GET /api/users", () => {
  it("should return users when authorization token is valid", async () => {
    const token = generateTestToken();

    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].name).toBe("Test User 1");
  });

  it("should return 401 if missing authorization header", async () => {
    const res = await request(app).get("/api/users");

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Missing Authorization header");
  });

  it("should return 401 for invalid token", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", "Bearer invalid.token.here");

    expect(res.status).toBe(401);
  });
});
