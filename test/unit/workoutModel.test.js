import { WorkoutModel } from "../../models/Workout.js";
import pool from "../../src/db.js";

jest.mock("../../src/db.js", () => ({
  query: jest.fn()
}));

describe("WorkoutModel", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("returns a list of workouts", async () => {
      const fakeWorkouts = [
        { id: 1, name: "Push-up", calories_burned: 50 },
        { id: 2, name: "Squat", calories_burned: 60 }
      ];
      pool.query.mockResolvedValue({ rows: fakeWorkouts });

      const result = await WorkoutModel.getAll();

      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM workout_list()");
      expect(result).toEqual(fakeWorkouts);
    });

    it("returns empty array if no workouts exist", async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await WorkoutModel.getAll();

      expect(result).toEqual([]);
    });
  });

  describe("create", () => {
    it("creates a new workout entry", async () => {
      const newWorkout = {
        id: 1,
        name: "Bench Press",
        calories_burned: 100,
        sets: 3,
        reps: 10,
        muscle_group: ["chest", "triceps"]
      };

      pool.query.mockResolvedValue({ rows: [newWorkout] });

      const result = await WorkoutModel.create({
        name: "Bench Press",
        calories_burned: 100,
        sets: 3,
        reps: 10,
        muscle_group: ["chest", "triceps"]
      });

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM workout_create($1, $2, $3, $4, $5)",
        ["Bench Press", 100, 3, 10, JSON.stringify(["chest", "triceps"])]
      );
      expect(result).toEqual(newWorkout);
    });

    it("returns undefined if no row is returned", async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await WorkoutModel.create({
        name: "Bench Press",
        calories_burned: 100,
        sets: 3,
        reps: 10,
        muscle_group: ["chest", "triceps"]
      });

      expect(result).toBeUndefined();
    });
  });

  describe("deleteById", () => {
    it("calls the correct SQL function with the workout ID", async () => {
      pool.query.mockResolvedValue({});

      await WorkoutModel.deleteById(5);

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM workout_delete($1)",
        [5]
      );
    });
  });

});
