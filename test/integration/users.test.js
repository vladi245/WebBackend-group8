import { api } from "../setup/testApp.js";
import { generateToken } from "../setup/token.js";
import * as UserModelModule from "../../models/User.js";

// --- Mock UserModel ---
UserModelModule.UserModel = {
  getUserHeight: jest.fn(),
  updateUserHeight: jest.fn(),
  updateName: jest.fn(),
  getAll: jest.fn(), // required by other routes in same router
};

describe("GET /api/users/:id/height", () => {
  const token = generateToken();

  it("returns the user's height", async () => {
    UserModelModule.UserModel.getUserHeight.mockResolvedValue(180);

    const res = await api
      .get("/api/users/1/height")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user_height", 180);
  });

  it("returns 400 for invalid ID", async () => {
    const res = await api
      .get("/api/users/abc/height")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
  });

  it("returns 401 without token", async () => {
    const res = await api.get("/api/users/1/height");
    expect(res.status).toBe(401);
  });
});

describe("PUT /api/users/:id/heightsave", () => {
  const token = generateToken();

  it("updates the user's height successfully", async () => {
    UserModelModule.UserModel.updateUserHeight.mockResolvedValue({
      id: 1,
      user_height: 175,
    });

    const res = await api
      .put("/api/users/1/heightsave")
      .set("Authorization", `Bearer ${token}`)
      .send({ height: 175 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("user_height", 175);
  });

  it("returns 400 for invalid height", async () => {
    const res = await api
      .put("/api/users/1/heightsave")
      .set("Authorization", `Bearer ${token}`)
      .send({ height: "bad" });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Height is required/);
  });

  it("returns 404 when user is not found", async () => {
    UserModelModule.UserModel.updateUserHeight.mockResolvedValue(null);

    const res = await api
      .put("/api/users/1/heightsave")
      .set("Authorization", `Bearer ${token}`)
      .send({ height: 180 });

    expect(res.status).toBe(404);
  });

  it("returns 401 without token", async () => {
    const res = await api.put("/api/users/1/heightsave").send({ height: 180 });
    expect(res.status).toBe(401);
  });
});

describe("PUT /api/users/:id/name", () => {
  const token = generateToken();

  it("updates the user's name successfully", async () => {
    UserModelModule.UserModel.updateName.mockResolvedValue({
      id: 1,
      name: "John Doe"
    });

    const res = await api
      .put("/api/users/1/name")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "John Doe" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("name", "John Doe");
  });

  it("returns 400 for empty name", async () => {
    const res = await api
      .put("/api/users/1/name")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "" });

    expect(res.status).toBe(400);
  });

  it("returns 404 when user does not exist", async () => {
    UserModelModule.UserModel.updateName.mockResolvedValue(null);

    const res = await api
      .put("/api/users/1/name")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "New Name" });

    expect(res.status).toBe(404);
  });

  it("returns 401 without token", async () => {
    const res = await api.put("/api/users/1/name").send({ name: "John" });
    expect(res.status).toBe(401);
  });
});
