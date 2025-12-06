import { api } from "../setup/testApp.js";
import { generateToken } from "../setup/token.js";
import * as FoodModelModule from "../../models/Food.js";

// --- Mock FoodModel ---
FoodModelModule.FoodModel = {
  getAll: jest.fn(() => [
    { id: 1, name: "Apple", calories_intake: 95 },
    { id: 2, name: "Banana", calories_intake: 105 }
  ]),
  create: jest.fn(({ name, calories_intake }) => ({ id: 3, name, calories_intake })),
  deleteById: jest.fn((id) => true)
};

describe("GET /admin/foods", () => {
  const token = generateToken();

  it("returns all foods", async () => {
    const res = await api.get("/admin/foods").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toHaveProperty("name", "Apple");
  });

  it("returns 401 without token", async () => {
    const res = await api.get("/admin/foods");
    expect(res.status).toBe(401);
  });
});

describe("POST /admin/foods", () => {
  const token = generateToken();

  it("creates a new food", async () => {
    const res = await api.post("/admin/foods")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Orange", calories_intake: 62 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", 3);
    expect(res.body).toHaveProperty("name", "Orange");
  });

  it("returns 401 without token", async () => {
    const res = await api.post("/admin/foods").send({ name: "Orange", calories_intake: 62 });
    expect(res.status).toBe(401);
  });
});

describe("DELETE /admin/foods/:id", () => {
  const token = generateToken();

  it("deletes a food item", async () => {
    const res = await api.delete("/admin/foods/1").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Food deleted");
  });

  it("returns 401 without token", async () => {
    const res = await api.delete("/admin/foods/1");
    expect(res.status).toBe(401);
  });
});
