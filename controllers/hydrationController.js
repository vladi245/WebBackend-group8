import { HydrationModel } from "../models/Hydration.js";

// Helper to get user ID from request
function getUserId(req) {
  if (req?.user?.id) return req.user.id;
  if (req?.body?.userId) return req.body.userId;
  if (req?.query?.userId) return req.query.userId;
  return null;
}

export const hydrationController = {

  // GET /api/hydration
  // Get today's hydration data
  getToday: async (req, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      let data = await HydrationModel.getToday(userId);

      // If no record exists for today, create one with defaults
      if (!data) {
        data = await HydrationModel.upsertToday({
          userId,
          goalMl: 2000,
          currentMl: 0
        });
      }

      res.json({
        goalMl: data.goal_ml,
        currentMl: data.current_ml,
        date: data.date
      });
    } catch (err) {
      console.error("Error fetching hydration data:", err);
      res.status(500).json({ error: "Database error while fetching hydration data" });
    }
  },

  // POST /api/hydration/add
  // Add water to today's intake
  addWater: async (req, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const { amount } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Valid amount is required" });
      }

      const data = await HydrationModel.addWater({
        userId,
        amountMl: amount
      });

      res.json({
        message: "Water added",
        goalMl: data.goal_ml,
        currentMl: data.current_ml
      });
    } catch (err) {
      console.error("Error adding water:", err);
      res.status(500).json({ error: "Database error while adding water" });
    }
  },

  // POST /api/hydration/remove
  // Remove water from today's intake
  removeWater: async (req, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const { amount } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Valid amount is required" });
      }

      const data = await HydrationModel.removeWater({
        userId,
        amountMl: amount
      });

      if (!data) {
        return res.status(404).json({ error: "No hydration record found for today" });
      }

      res.json({
        message: "Water removed",
        goalMl: data.goal_ml,
        currentMl: data.current_ml
      });
    } catch (err) {
      console.error("Error removing water:", err);
      res.status(500).json({ error: "Database error while removing water" });
    }
  },

  // POST /api/hydration/reset
  // Reset today's intake to zero
  resetToday: async (req, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const data = await HydrationModel.resetToday(userId);

      if (!data) {
        // No record to reset, create one with zero
        const newData = await HydrationModel.upsertToday({
          userId,
          goalMl: 2000,
          currentMl: 0
        });

        return res.json({
          message: "Hydration reset",
          goalMl: newData.goal_ml,
          currentMl: newData.current_ml
        });
      }

      res.json({
        message: "Hydration reset",
        goalMl: data.goal_ml,
        currentMl: data.current_ml
      });
    } catch (err) {
      console.error("Error resetting hydration:", err);
      res.status(500).json({ error: "Database error while resetting hydration" });
    }
  },

  // PUT /api/hydration/goal
  // Update the daily water goal
  updateGoal: async (req, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const { goal } = req.body;

      if (!goal || goal <= 0) {
        return res.status(400).json({ error: "Valid goal is required" });
      }

      const data = await HydrationModel.updateGoal({
        userId,
        goalMl: goal
      });

      res.json({
        message: "Goal updated",
        goalMl: data.goal_ml,
        currentMl: data.current_ml
      });
    } catch (err) {
      console.error("Error updating goal:", err);
      res.status(500).json({ error: "Database error while updating goal" });
    }
  },

  // GET /api/hydration/weekly
  // Get weekly hydration stats
  getWeeklyStats: async (req, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const data = await HydrationModel.getWeeklyStats(userId);

      const stats = data.map(row => ({
        date: row.date,
        goalMl: row.goal_ml,
        currentMl: row.current_ml,
        percentage: Math.round((row.current_ml / row.goal_ml) * 100)
      }));

      res.json({ weekly: stats });
    } catch (err) {
      console.error("Error fetching weekly stats:", err);
      res.status(500).json({ error: "Database error while fetching weekly stats" });
    }
  }

};
