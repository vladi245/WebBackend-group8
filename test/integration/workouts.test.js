import { api } from "../setup/testApp.js";
import { generateToken } from "../setup/token.js";

// Mock WorkoutModel
import * as WorkoutModelModule from "../../models/Workout.js";
WorkoutModelModule.WorkoutModel.getAll = jest.fn(() => [
  {
    id: 1,
    name: "Push-ups",
    calories_burned: 100,
    sets: 3,
    reps: 12,
    muscle_group: '["chest","arms"]'
  },
  {
    id: 2,
    name: "Squats",
    calories_burned: 150,
    sets: 4,
    reps: 15,
    muscle_group: '["legs","glutes"]'
  },
]);

import * as WorkoutRecordModelModule from "../../models/WorkoutRecord.js";
WorkoutRecordModelModule.WorkoutRecordModel = {
  addRecord: jest.fn(({ workout_id, user_id }) => ({ id: 1, workout_id, user_id })),
  getAggregatedStatsByUser: jest.fn((userId) => ({
    total_workouts: 5,
    total_calories: 500,
    daily: [{ date: "2025-12-06", count: 2 }]
  })),
  getRecordsByUser: jest.fn((userId) => [
    { id: 1, workout_id: 1, user_id: userId },
    { id: 2, workout_id: 2, user_id: userId }
  ]),
  deleteById: jest.fn((id, userId) => true)
};

describe("GET /api/workouts/all", () => {
  const token = generateToken();

  it("returns all workouts", async () => {
    const res = await api.get("/api/workouts/all").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body[0].muscle_group).toEqual(["chest", "arms"]);
  });

  it("returns 401 without token", async () => {
    const res = await api.get("/api/workouts/all");
    expect(res.status).toBe(401);
  });
});

describe("GET /api/workouts", () => {
  const token = generateToken();

  it("returns user's workouts", async () => {
    const res = await api.get("/api/workouts").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body[0]).toHaveProperty("user_id");
  });

  it("returns 401 without token", async () => {
    const res = await api.get("/api/workouts");
    expect(res.status).toBe(401);
  });
});

describe("GET /api/workouts/stats", () => {
  const token = generateToken();

  it("returns user stats", async () => {
    const res = await api.get("/api/workouts/stats").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("total_workouts");
  });

  it("returns 401 without token", async () => {
    const res = await api.get("/api/workouts/stats");
    expect(res.status).toBe(401);
  });
});


describe("POST /api/workouts", () => {
  const token = generateToken();

  it("adds completed workout", async () => {
    const res = await api.post("/api/workouts")
      .set("Authorization", `Bearer ${token}`)
      .send({ workout_id: 1 });

    expect(res.status).toBe(200);
    expect(res.body.record).toHaveProperty("workout_id", 1);
  });

  it("returns 400 if workout_id missing", async () => {
    const res = await api.post("/api/workouts")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
  });

  it("returns 401 without token", async () => {
    const res = await api.post("/api/workouts").send({ workout_id: 1 });
    expect(res.status).toBe(401);
  });
});


describe("DELETE /api/workouts/:id", () => {
  const token = generateToken();

  it("deletes a workout record", async () => {
    const res = await api.delete("/api/workouts/1").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Deleted");
  });

  it("returns 401 without token", async () => {
    const res = await api.delete("/api/workouts/1");
    expect(res.status).toBe(401);
  });
});