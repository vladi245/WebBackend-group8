import { DashboardModel } from "../models/Dashboard.js";

export const adminDashboardController = {

  getStats: async (req, res) => {
    try {
      const stats = await DashboardModel.getStats();
      res.json(stats);
    } catch (err) {
      console.error("Error getting dashboard stats:", err);
      res.status(500).json({ error: "Database error while getting dashboard stats" });
    }
  },

  getUserStats: async (req, res) => {
    try {
      const userStats = await DashboardModel.getUserStats();
      res.json(userStats);
    } catch (err) {
      console.error("Error getting admin user stats:", err);
      res.status(500).json({ error:"Database error while getting dashboard user stats" });
    }
  },

  getCaloriesStats: async (req, res) => {
    try {
      const caloriesStats = await DashboardModel.getCalories();
      res.json({ success: true, data: caloriesStats });
    } catch (err) {
      console.error("Error getting calories stats:", err);
      res.status(500).json({ error: "Database error while getting calories stats" });
    }
  },

  getFoodStats: async (req, res) => {
    try {
      const foodStats = await DashboardModel.getFoodStats();
      res.json(foodStats);
    } catch (err) {
      console.error("Error getting admin food stats:", err);
      res.status(500).json({ error: "Database error while getting food stats" });
    }
  },

  getWaterStats: async (req, res) => {
    try {
      const waterStats = await DashboardModel.getWaterStats();
      res.json(waterStats);
    } catch (err) {
      console.error("Error getting water stats:", err);
      res.status(500).json({ error: "Database error while getting water stats" });
    }
  },


  getWorkoutStats: async (req, res) => {
    try {
      const workoutStats = await DashboardModel.getWorkoutStats();
      res.json(workoutStats);
    } catch (err) {
      console.error("Error getting admin workout stats:", err);
      res.status(500).json({ error: "Database error while getting workout stats" });
    }
  },


  getStandingStats: async (req, res) => {
    try {
      const standingStats = await DashboardModel.getStandingStats();
      res.json(standingStats);
    } catch (err) {
      console.error("Error getting standing stats:", err);
      res.status(500).json({ error: "Database error while getting standing stats" });
    }
  },


  getRecentActivity: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const activity = await DashboardModel.getRecentActivity(limit);
      res.json(activity);
    } catch (err) {
      console.error("Error getting admin recent activity:", err);
      res.status(500).json({ error: "Database error while getting recent activity stats" });
    }
  },

  getOverview: async (req, res) => {
    try {
      const [stats, userStats, foodStats, waterStats, workoutStats, standingStats, recentActivity] = await Promise.all([
        DashboardModel.getStats(),
        DashboardModel.getUserStats(),
        DashboardModel.getFoodStats(),
        DashboardModel.getWaterStats(),
        DashboardModel.getWorkoutStats(),
        DashboardModel.getStandingStats(),
        DashboardModel.getRecentActivity(5)
      ]);

      res.json({
        overview: stats,
        users: userStats,
        foods: foodStats,
        water: waterStats,
        workouts: workoutStats,
        standing: standingStats,
        recentActivity
      });
    } catch (err) {
      console.error("Error getting dashboard overview:", err);
      res.status(500).json({ error: "Database error while getting dashboard overview" });
    }
  }
};
