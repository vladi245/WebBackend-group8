export const dashboardController = {
    getUserStats: async (req, res) => {
      try {
        const userStats = await DashboardModel.getUserStats(req.user.id);
        res.json({ success: true, data: userStats });
      } catch (err) {
        console.error("Error getting user stats:", err);
        res.status(500).json({ error: "Database error while getting user stats" });
      }
    },

    getCaloriesStats: async (req, res) => {
      try {
        const caloriesStats = await DashboardModel.getCalories(req.user.id);
        res.json({ success: true, data: caloriesStats });
      } catch (err) {
        console.error("Error getting calories stats:", err);
        res.status(500).json({ error: "Database error while getting calories stats" });
      }
    },
  
    getFoodStats: async (req, res) => {
      try {
        const foodStats = await DashboardModel.getFoodStats(req.user.id);
        res.json({ success: true, data: foodStats });
      } catch (err) {
        console.error("Error getting food stats:", err);
        res.status(500).json({ error: "Database error while getting food stats" });
      }
    },
  
    getWaterStats: async (req, res) => {
      try {
        const waterStats = await DashboardModel.getWaterStats(req.user.id);
        res.json({ success: true, data: waterStats });
      } catch (err) {
        console.error("Error getting water stats:", err);
        res.status(500).json({ error: "Database error while getting water stats" });
      }
    },
  
    getWorkoutStats: async (req, res) => {
      try {
        const workoutStats = await DashboardModel.getWorkoutStats(req.user.id);
        res.json({ success: true, data: workoutStats });
      } catch (err) {
        console.error("Error getting workout stats:", err);
        res.status(500).json({ error: "Database error while getting workout stats" });
      }
    },
    
    getStandingStats: async (req, res) => {
        try {
          const standingStats = await DashboardModel.getStandingStats(req.user.id);
          res.json({ success: true, data: standingStats });
        } catch (err) {
          console.error("Error getting standing stats:", err);
          res.status(500).json({ error: "Database error while getting standing stats" });
        }
      },
  
    getFriendsActivity: async (req, res) => {
      try {
        const friendsActivity = await DashboardModel.getFriendsActivity(req.user.id);
        res.json({ success: true, data: friendsActivity });
      } catch (err) {
        console.error("Error getting friends' activity:", err);
        res.status(500).json({ error: "Database error while getting friends' activity" });
      }
    },
  };