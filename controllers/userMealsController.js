import { MealsModel } from "../models/MealsModel.js";

//helper since the auth isnt done yet
function getUserId(req) {
  if (req?.user?.id) return req.user.id;
  if (req?.body?.userId) return req.body.userId;
  if (req?.query?.userId) return req.query.userId;
  return null;
}

export const userMealsController = {


  addMealEntry: async (req, res) => {
    try {
      const userId = getUserId(req);
      if (!userId)
        return res.status(401).json({ error: "User not authenticated" });

      const { foodId } = req.body;

      if (!foodId)
        return res.status(400).json({ error: "foodId is required" });


      const entry = await MealsModel.createEntry({
        userId,
        foodId
      });

      const stats = await MealsModel.getTodayStats(userId);

      res.status(201).json({
        message: "Meal entry added",
        stats,
        entry,
      });
    } catch (err) {
      console.error("Error adding meal entry:", err);
      res
        .status(500)
        .json({ error: "Database error while adding meal entry" });
    }
  },




  removeMealEntry: async (req, res) => {
    try {
      const userId = getUserId(req);
      if (!userId)
        return res.status(401).json({ error: "User not authenticated" });

      const { recordId } = req.body;

      if (!recordId)
        return res.status(400).json({ error: "recordId is required" });

      const deleted = await MealsModel.removeEntryById({
        userId,
        recordId,
      });

      if (!deleted)
        return res.status(404).json({ error: "Meal entry not found" });

      const stats = await MealsModel.getTodayStats(userId);

      res.json({
        message: "Meal entry removed",
        stats,
      });
    } catch (err) {
      console.error("Error removing meal entry:", err);
      res
        .status(500)
        .json({ error: "Database error while removing meal entry" });
    }
  },

  getTodayStats: async (req, res) => {
    try {
      const userId = getUserId(req);
      if (!userId)
        return res.status(401).json({ error: "User not authenticated" });

      const stats = await MealsModel.getTodayStats(userId);
      res.json(stats);
    } catch (err) {
      console.error("Error getting today's stats:", err);
      res
        .status(500)
        .json({ error: "Database error while getting stats" });
    }
  },

  getFoods: async (req, res) => {
    try {
      const foods = await MealsModel.getAllFoods();
      res.json(foods);
    } catch (err) {
      console.error("Error getting foods:", err);
      res.status(500).json({ error: "Database error while getting foods" });
    }
  },


  getMeals: async (req, res) => {
    try {
      const userId = getUserId(req);
      if (!userId)
        return res.status(401).json({ error: "User not authenticated" });

      const meals = await MealsModel.getMeals(userId);
      res.json(meals);
    } catch (err) {
      console.error("Error getting meals:", err);
      res
        .status(500)
        .json({ error: "Database error while getting meals" });
    }
  },

  getWeeklyStats: async (req, res) => {
    try {
      const userId = getUserId(req);
      if (!userId)
        return res.status(401).json({ error: "User not authenticated" });

      const data = await MealsModel.getWeekStats(userId);

      res.json(data);
    } catch (err) {
      console.error("Error getting weekly stats:", err);
      res
        .status(500)
        .json({ error: "Database error while getting weekly stats" });
    }
  },
};
