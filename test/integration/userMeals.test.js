import { api } from "../setup/testApp.js";
import { generateToken } from "../setup/token.js";
import * as MealsModelModule from "../../models/MealsModel.js";

// --- Mock MealsModel ---
MealsModelModule.MealsModel = {
  createEntry: jest.fn(),
  removeEntryById: jest.fn(),
  getTodayStats: jest.fn(),
  getWeekStats: jest.fn(),
  getAllFoods: jest.fn(),
  getMeals: jest.fn()
};

// --- POST /meals ---
describe("POST /api/meals", () => {
  const token = generateToken();

  it("adds a meal entry successfully", async () => {
    MealsModelModule.MealsModel.createEntry.mockResolvedValue({ id: 1, foodId: 1 });
    MealsModelModule.MealsModel.getTodayStats.mockResolvedValue({ calories: 500 });

    const res = await api.post("/api/meals")
      .set("Authorization", `Bearer ${token}`)
      .send({ foodId: 1 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "Meal entry added");
    expect(res.body.entry).toHaveProperty("foodId", 1);
    expect(res.body.stats).toHaveProperty("calories");
  });

  it("returns 400 if foodId missing", async () => {
    const res = await api.post("/api/meals").set("Authorization", `Bearer ${token}`).send({});
    expect(res.status).toBe(400);
  });

  it("returns 401 if user not authenticated", async () => {
    const res = await api.post("/api/meals").send({ foodId: 1 });
    expect(res.status).toBe(401);
  });
});

// --- DELETE /meals ---
describe("DELETE /api/meals", () => {
  const token = generateToken();

  it("removes a meal entry successfully", async () => {
    MealsModelModule.MealsModel.removeEntryById.mockResolvedValue(true);
    MealsModelModule.MealsModel.getTodayStats.mockResolvedValue({ calories: 400 });

    const res = await api.delete("/api/meals")
      .set("Authorization", `Bearer ${token}`)
      .send({ recordId: 1 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Meal entry removed");
    expect(res.body.stats).toHaveProperty("calories");
  });

  it("returns 404 if meal entry not found", async () => {
    MealsModelModule.MealsModel.removeEntryById.mockResolvedValue(false);

    const res = await api.delete("/api/meals")
      .set("Authorization", `Bearer ${token}`)
      .send({ recordId: 999 });

    expect(res.status).toBe(404);
  });

  it("returns 400 if recordId missing", async () => {
    const res = await api.delete("/api/meals").set("Authorization", `Bearer ${token}`).send({});
    expect(res.status).toBe(400);
  });

  it("returns 401 if user not authenticated", async () => {
    const res = await api.delete("/api/meals").send({ recordId: 1 });
    expect(res.status).toBe(401);
  });
});

describe("GET /meals/stats", () => {
  const token = generateToken();

  it("returns today's meal stats", async () => {
    MealsModelModule.MealsModel.getTodayStats.mockResolvedValue({ calories: 500 });

    const res = await api.get("/api/meals/stats").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("calories", 500);
  });

  it("returns 401 if user not authenticated", async () => {
    const res = await api.get("/api/meals/stats");
    expect(res.status).toBe(401);
  });
});

describe("GET /api/meals/weekly", () => {
  const token = generateToken();

  it("returns weekly meal stats", async () => {
    MealsModelModule.MealsModel.getWeekStats.mockResolvedValue([
      { date: "2025-12-01", calories: 500 },
      { date: "2025-12-02", calories: 600 }
    ]);

    const res = await api.get("/api/meals/weekly").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it("returns 401 if user not authenticated", async () => {
    const res = await api.get("/api/meals/weekly");
    expect(res.status).toBe(401);
  });
});

describe("GET /api/meals/entries", () => {
  const token = generateToken();

  it("returns all meal entries for user", async () => {
    MealsModelModule.MealsModel.getMeals.mockResolvedValue([
      { id: 1, foodId: 1 },
      { id: 2, foodId: 2 }
    ]);

    const res = await api.get("/api/meals/entries").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it("returns 401 if user not authenticated", async () => {
    const res = await api.get("/api/meals/entries");
    expect(res.status).toBe(401);
  });
});

describe("GET /api/foods", () => {
  it("returns all foods", async () => {
    MealsModelModule.MealsModel.getAllFoods.mockResolvedValue([
      { id: 1, name: "Apple", calories_intake: 95 },
      { id: 2, name: "Banana", calories_intake: 105 }
    ]);

    const res = await api.get("/api/foods");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toHaveProperty("name", "Apple");
  });

  it("handles DB errors", async () => {
    MealsModelModule.MealsModel.getAllFoods.mockRejectedValueOnce(new Error("DB error"));

    const res = await api.get("/api/foods");
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error", "Database error while getting foods");
  });
});
