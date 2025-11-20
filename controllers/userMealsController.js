import { MealsModel } from "../models/MealsModel.js";

export const userMealsController = {
  addMealEntry: async (req, res) => {
    try {
      const userId = 1; // TODO: replace with real auth later
      const { foodId, mealType } = req.body;

      if (!foodId) {
        return res.status(400).json({ error: "foodId is required" });
      }

      if (!mealType) {
        return res.status(400).json({ error: "mealType is required" });
      }

      const entry = await MealsModel.createEntry({ userId, foodId, mealType });

      const stats = await MealsModel.getTodayStats(userId);

      res.status(201).json({ message: "Meal entry added", stats, entry });
    } catch (err) {
      console.error("Error adding meal entry: ", err);
      res
        .status(500)
        .json({ error: "Database error while adding meal entry" });
    }
  },

  
  removeMealEntry: async (req, res) => {
    try {
      const userId = 1;
      const { recordId } = req.body;

      if (!recordId) {
        return res.status(400).json({ error: "recordId is required" });
      }

      const deleted = await MealsModel.removeEntryById({ userId, recordId });

      if (!deleted) {
        return res.status(404).json({ error: "Meal entry not found" });
      }

      const stats = await MealsModel.getTodayStats(userId);

      res.status(200).json({ message: "Meal entry removed", stats });
    } catch (err) {
      console.error("Error removing meal entry: ", err);
      res
        .status(500)
        .json({ error: "Database error while removing meal entry" });
    }
  },

 
  getTodayStats: async (req, res) => {
    try {
      const userId = 1;
      const stats = await MealsModel.getTodayStats(userId);
      res.json(stats);
    } catch (err) {
      console.error("Error getting today's stats: ", err);
      res
        .status(500)
        .json({ error: "Database error while getting stats" });
    }
  },

  
  getMeals: async (req, res) => {
    try {
      const userId = 1;
      const meals = await MealsModel.getMeals(userId);
      res.json(meals);
    } catch (err) {
      console.error("Error getting meals: ", err);
      res
        .status(500)
        .json({ error: "Database error while getting meals" });
    }
  },
};
