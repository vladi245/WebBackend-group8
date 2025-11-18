import { WorkoutModel } from "../models/Workout.js";

export const adminWorkoutsController = {
  getAllWorkouts: async (req, res) => {
    try {
      const workouts = await WorkoutModel.getAll();
      res.json(workouts);
    } catch (err) {
      console.error("Error getting workouts:", err);
      res.status(500).json({ error: "Database error while getting workouts" });
    }
  },

  createWorkout: async (req, res) => {
    try {
      const { name, calories_burned, sets, reps, muscle_group } = req.body;
      const workout = await WorkoutModel.create({
        name,
        calories_burned,
        sets,
        reps,
        muscle_group
      });
      res.json(workout);
    } catch (err) {
      console.error("Error creating workout:", err);
      res.status(500).json({ error: "Database error while creating workout" });
    }
  },

  deleteWorkout: async (req, res) => {
    try {
      await WorkoutModel.deleteById(req.params.id);
      res.json({ message: "Workout deleted" });
    } catch (err) {
      console.error("Error deleting workout:", err);
      res.status(500).json({ error: "Database error while deleting workout" });
    }
  }
};
