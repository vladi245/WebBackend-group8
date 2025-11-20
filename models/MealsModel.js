import pool from "../src/db.js";

export const MealsModel = {
  
  createEntry: async ({ userId, foodId, mealType }) => {
    const res = await pool.query(
      `INSERT INTO food_records (user_id, food_id, meal_type)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, foodId, mealType]
    );
    return res.rows[0]; 
  },

  
  removeEntryById: async ({ userId, recordId }) => {
    const res = await pool.query(
      `DELETE FROM food_records
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [recordId, userId]
    );
    return res.rows[0]; 
  },

  
  getTodayStats: async (userId) => {
    const res = await pool.query(
      `SELECT
         COUNT(*)::int AS total_meals,
         COALESCE(SUM(f.calories_intake), 0)::int AS calories_eaten
       FROM food_records fr
       JOIN foods f ON f.id = fr.food_id
       WHERE fr.user_id = $1`,
      [userId]
    );

    const row = res.rows[0];

    return {
      totalMeals: row.total_meals,
      caloriesEaten: row.calories_eaten,
      averageIntake: row.calories_eaten,
    };
  },

  
  getMeals: async (userId) => {
    const res = await pool.query(
      `SELECT
         fr.id,
         fr.meal_type AS "mealType",
         fr.food_id AS "foodId",
         f.name,
         f.calories_intake AS "calories"
       FROM food_records fr
       JOIN foods f ON f.id = fr.food_id
       WHERE fr.user_id = $1
       ORDER BY fr.timestamp ASC`,
      [userId]
    );

    return res.rows; 
  },
};
