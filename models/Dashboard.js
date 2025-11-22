import pool from "../src/db.js";

export const DashboardModel = {
    getCalories: async () => {
     const res = await pool.query(`
        SELECT 
          COUNT(*) as total_foods,
          COALESCE(SUM(calories_intake), 0) as total_calories_intake,
          COALESCE(AVG(calories_intake), 0) as avg_calories_per_food
        FROM foods
      `);
      return res.rows[0];
    },

    getWater: async () => {
        const res = await pool.query(`
          SELECT 
            COUNT(*) AS total_entries,
            COALESCE(SUM(water_intake), 0) AS total_water_intake,
            COALESCE(AVG(water_intake), 0) AS avg_water_per_entry
          FROM water
        `);
        return res.rows[0];
      },

      getWorkout: async () => {
        const res = await pool.query(`
          SELECT 
            day,
            COALESCE(SUM(minutes), 0) AS minutes
          FROM workouts
          GROUP BY day
          ORDER BY day
        `);
        return res.rows;
      },

      getWorkoutStats: async () => {
        const res = await pool.query(`
          SELECT 
            COUNT(*) as total_workouts,
            COALESCE(SUM(calories_burned), 0) as total_calories_burned,
            COALESCE(AVG(calories_burned), 0) as avg_calories_per_workout
          FROM workouts
        `);
        return res.rows[0];
      },


      getStandingStats: async () => {
        const res = await pool.query(`
          SELECT 
            COUNT(*) AS total_entries,
            COALESCE(SUM(standing_time), 0) AS total_standing_time,
            COALESCE(AVG(standing_time), 0) AS avg_standing_time_per_entry
          FROM standing 
        `);
        return res.rows[0];
      },

      getFriendsActivity: async () => {
        const res = await pool.query(`
          SELECT 
            id,
            username,
            action,
            time_ago AS "timeAgo"
          FROM friends_activity
          ORDER BY time_ago ASC
        `);
        return res.rows;
      }
    };

    // i have to look our database schema to make sure about table names and column names 
