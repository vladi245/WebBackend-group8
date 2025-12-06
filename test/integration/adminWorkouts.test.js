import { api } from "../setup/testApp.js";
import { generateToken } from "../setup/token.js";
import * as WorkoutModelModule from "../../models/Workout.js";

// --- Mock WorkoutModel ---
WorkoutModelModule.WorkoutModel = {
  getAll: jest.fn(() => [
    { id: 1, name: "Push-ups", calories_burned: 100, sets: 3, reps: 12, muscle_group: ["chest", "arms"] },
    { id: 2, name: "Squats", calories_burned: 150, sets: 4, reps: 15, muscle_group: ["legs", "glutes"] }
  ]),
  create: jest.fn(({ name, calories_burned, sets, reps, muscle_group }) => ({
    id: 3, name, calories_burned, sets, reps, muscle_group
  })),
  deleteById: jest.fn((id) => true)
};

describe("GET /admin/workouts", () => {
  const token = generateToken();

  it("returns all workouts", async () => {
    const res = await api.get("/admin/workouts").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toHaveProperty("name", "Push-ups");
  });

  it("returns 401 without token", async () => {
    const res = await api.get("/admin/workouts");
    expect(res.status).toBe(401);
  });
});

describe("POST /admin/workouts", () => {
  const token = generateToken();

  it("creates a new workout", async () => {
    const newWorkout = {
      name: "Lunges",
      calories_burned: 120,
      sets: 3,
      reps: 15,
      muscle_group: ["legs", "glutes"]
    };

    const res = await api.post("/admin/workouts")
      .set("Authorization", `Bearer ${token}`)
      .send(newWorkout);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", 3);
    expect(res.body).toMatchObject(newWorkout);
  });

  it("returns 401 without token", async () => {
    const res = await api.post("/admin/workouts").send({
      name: "Lunges",
      calories_burned: 120,
      sets: 3,
      reps: 15,
      muscle_group: ["legs", "glutes"]
    });
    expect(res.status).toBe(401);
  });
});

describe("DELETE /admin/workouts/:id", () => {
  const token = generateToken();

  it("deletes a workout", async () => {
    const res = await api.delete("/admin/workouts/1").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Workout deleted");
  });

  it("returns 401 without token", async () => {
    const res = await api.delete("/admin/workouts/1");
    expect(res.status).toBe(401);
  });
});
