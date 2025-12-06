import { api } from "../setup/testApp.js";
import { generateToken } from "../setup/token.js";
import * as HydrationModelModule from "../../models/Hydration.js";

// --- Mock HydrationModel ---
HydrationModelModule.HydrationModel = {
  getToday: jest.fn(),
  upsertToday: jest.fn(),
  addWater: jest.fn(),
  removeWater: jest.fn(),
  resetToday: jest.fn(),
  updateGoal: jest.fn(),
  getWeeklyStats: jest.fn()
};

describe("GET /api/hydration", () => {
  const token = generateToken();

  it("returns today's hydration data", async () => {
    HydrationModelModule.HydrationModel.getToday.mockResolvedValue({
      goal_ml: 2000,
      current_ml: 500,
      date: "2025-12-06"
    });

    const res = await api.get("/api/hydration").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("goalMl", 2000);
    expect(res.body).toHaveProperty("currentMl", 500);
  });

  it("returns 401 if user not authenticated", async () => {
    const res = await api.get("/api/hydration");
    expect(res.status).toBe(401);
  });
});

describe("POST /api/hydration/add", () => {
  const token = generateToken();

  it("adds water successfully", async () => {
    HydrationModelModule.HydrationModel.addWater.mockResolvedValue({
      goal_ml: 2000,
      current_ml: 600
    });

    const res = await api.post("/api/hydration/add")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 100 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Water added");
    expect(res.body.currentMl).toBe(600);
  });

  it("returns 400 for invalid amount", async () => {
    const res = await api.post("/api/hydration/add")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: -10 });
    expect(res.status).toBe(400);
  });

  it("returns 401 if user not authenticated", async () => {
    const res = await api.post("/api/hydration/add").send({ amount: 100 });
    expect(res.status).toBe(401);
  });
});

describe("POST /hydration/remove", () => {
  const token = generateToken();

  it("removes water successfully", async () => {
    HydrationModelModule.HydrationModel.removeWater.mockResolvedValue({
      goal_ml: 2000,
      current_ml: 400
    });

    const res = await api.post("/api/hydration/remove")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 100 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Water removed");
    expect(res.body.currentMl).toBe(400);
  });

  it("returns 404 if no record found", async () => {
    HydrationModelModule.HydrationModel.removeWater.mockResolvedValue(null);

    const res = await api.post("/api/hydration/remove")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 100 });

    expect(res.status).toBe(404);
  });

  it("returns 400 for invalid amount", async () => {
    const res = await api.post("/api/hydration/remove")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 0 });
    expect(res.status).toBe(400);
  });

  it("returns 401 if user not authenticated", async () => {
    const res = await api.post("/api/hydration/remove").send({ amount: 100 });
    expect(res.status).toBe(401);
  });
});

describe("POST /api/hydration/reset", () => {
  const token = generateToken();

  it("resets today's hydration", async () => {
    HydrationModelModule.HydrationModel.resetToday.mockResolvedValue({
      goal_ml: 2000,
      current_ml: 0
    });

    const res = await api.post("/api/hydration/reset").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Hydration reset");
  });

  it("returns 401 if user not authenticated", async () => {
    const res = await api.post("/api/hydration/reset");
    expect(res.status).toBe(401);
  });
});

describe("PUT /api/hydration/goal", () => {
  const token = generateToken();

  it("updates the daily goal", async () => {
    HydrationModelModule.HydrationModel.updateGoal.mockResolvedValue({
      goal_ml: 2500,
      current_ml: 500
    });

    const res = await api.put("/api/hydration/goal")
      .set("Authorization", `Bearer ${token}`)
      .send({ goal: 2500 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Goal updated");
    expect(res.body.goalMl).toBe(2500);
  });

  it("returns 400 for invalid goal", async () => {
    const res = await api.put("/api/hydration/goal")
      .set("Authorization", `Bearer ${token}`)
      .send({ goal: -100 });
    expect(res.status).toBe(400);
  });

  it("returns 401 if user not authenticated", async () => {
    const res = await api.put("/api/hydration/goal").send({ goal: 2500 });
    expect(res.status).toBe(401);
  });
});

describe("GET /api/hydration/weekly", () => {
  const token = generateToken();

  it("returns weekly stats", async () => {
    HydrationModelModule.HydrationModel.getWeeklyStats.mockResolvedValue([
      { date: "2025-12-01", goal_ml: 2000, current_ml: 1800 },
      { date: "2025-12-02", goal_ml: 2000, current_ml: 2000 }
    ]);

    const res = await api.get("/api/hydration/weekly").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.weekly).toHaveLength(2);
    expect(res.body.weekly[0]).toHaveProperty("percentage", 90);
  });

  it("returns 401 if user not authenticated", async () => {
    const res = await api.get("/api/hydration/weekly");
    expect(res.status).toBe(401);
  });
});
