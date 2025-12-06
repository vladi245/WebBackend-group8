import { api } from "../setup/testApp.js";
import { generateToken } from "../setup/token.js";
import * as UserModelModule from "../../models/User.js";

// --- Mock UserModel ---
UserModelModule.UserModel = {
  getAll: jest.fn(() => [
    { id: 1, name: "Alice", type: "standard" },
    { id: 2, name: "Bob", type: "premium" }
  ]),
  deleteById: jest.fn((id) => true),
  updateType: jest.fn((id, type) => ({ id, name: "Alice", type }))
};

describe("GET /admin/users", () => {
  const token = generateToken();

  it("returns all users", async () => {
    const res = await api.get("/admin/users")
        .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toHaveProperty("name", "Alice");
  });

  it("returns 401 without token", async () => {
    const res = await api.get("/admin/users");
    expect(res.status).toBe(401);
  });
});

describe("DELETE /admin/users/:id", () => {
  const token = generateToken();

  it("deletes a user", async () => {
    const res = await api.delete("/admin/users/1")
        .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "User deleted");
  });

  it("returns 401 without token", async () => {
    const res = await api.delete("/admin/users/1");
    expect(res.status).toBe(401);
  });
});

describe("PATCH /admin/users/:id/type", () => {
  const token = generateToken();

  it("changes a user's type successfully", async () => {
    const res = await api.patch("/admin/users/1/type")
      .set("Authorization", `Bearer ${token}`)
      .send({ type: "premium" });

    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty("type", "premium");
  });

  it("returns 400 for invalid type", async () => {
    const res = await api.patch("/admin/users/1/type")
      .set("Authorization", `Bearer ${token}`)
      .send({ type: "invalid" });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Invalid type/);
  });

  it("returns 401 without token", async () => {
    const res = await api.patch("/admin/users/1/type").send({ type: "premium" });
    expect(res.status).toBe(401);
  });
});
