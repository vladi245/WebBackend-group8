import { api } from "../setup/testApp.js";
import { generateToken } from "../setup/token.js"; // if needed for /me
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as UserModelModule from "../../models/User.js";

// --- Mock UserModel ---
UserModelModule.UserModel = {
  findByEmail: jest.fn(),
  create: jest.fn(),
  getById: jest.fn()
};

describe("POST /api/auth/register", () => {
  it("registers a new user successfully", async () => {
    UserModelModule.UserModel.findByEmail.mockResolvedValue(null);
    UserModelModule.UserModel.create.mockResolvedValue({
      id: 1,
      name: "Alice",
      email: "alice@test.com",
      type: "standard"
    });

    const res = await api.post("/api/auth/register").send({
      name: "Alice",
      email: "alice@test.com",
      password: "password123",
      type: "standard"
    });

    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty("id", 1);
    expect(res.body.token).toBeDefined();
  });

  it("returns 400 if required fields missing", async () => {
    const res = await api.post("/api/auth/register").send({ name: "Alice" });
    expect(res.status).toBe(400);
  });

  it("returns 409 if email already exists", async () => {
    UserModelModule.UserModel.findByEmail.mockResolvedValue({ id: 1, email: "alice@test.com" });
    const res = await api.post("/api/auth/register").send({
      name: "Alice",
      email: "alice@test.com",
      password: "password123"
    });
    expect(res.status).toBe(409);
  });
});

describe("POST /api/auth/login", () => {
  it("logs in successfully with correct credentials", async () => {
    const password_hash = await bcrypt.hash("password123", 1);
    UserModelModule.UserModel.findByEmail.mockResolvedValue({
      id: 1,
      name: "Alice",
      email: "alice@test.com",
      password_hash,
      type: "standard"
    });

    const res = await api.post("/api/auth/login").send({
      email: "alice@test.com",
      password: "password123"
    });

    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty("id", 1);
    expect(res.body.token).toBeDefined();
  });

  it("returns 400 if email/password missing", async () => {
    const res = await api.post("/api/auth/login").send({ email: "alice@test.com" });
    expect(res.status).toBe(400);
  });

  it("returns 401 if credentials invalid", async () => {
    UserModelModule.UserModel.findByEmail.mockResolvedValue({
      id: 1,
      email: "alice@test.com",
      password_hash: await bcrypt.hash("password123", 1),
    });

    const res = await api.post("/api/auth/login").send({
      email: "alice@test.com",
      password: "wrongpass"
    });

    expect(res.status).toBe(401);
  });
});

describe("GET /api/auth/me", () => {
  it("returns current user info with valid token", async () => {
    const user = { id: 1, name: "Alice", email: "alice@test.com", type: "standard" };
    UserModelModule.UserModel.getById.mockResolvedValue(user);

    const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET || "change_this_secret_in_production");

    const res = await api.get("/api/auth/me").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty("id", 1);
  });

  it("returns 401 without token", async () => {
    const res = await api.get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  it("returns 404 if user not found", async () => {
    UserModelModule.UserModel.getById.mockResolvedValue(null);

    const token = jwt.sign({ id: 999 }, process.env.JWT_SECRET || "change_this_secret_in_production");

    const res = await api.get("/api/auth/me").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});
