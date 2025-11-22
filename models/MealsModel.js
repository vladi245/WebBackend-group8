import pool from "../src/db.js";

export const MealsModel = {


  createEntry: async ({ userId, foodId }) => {
    const res = await pool.query(
      `
      INSERT INTO food_records (user_id, food_id)
      VALUES ($1, $2)
      RETURNING *
      `,
      [userId, foodId]
    );

    return res.rows[0];
  },

  getAllFoods: async () => {
    const res = await pool.query(
      `
      SELECT 
        id,
        name,
        calories_intake AS calories
      FROM foods
      ORDER BY id ASC
      `
    );

    return res.rows;
  },


  removeEntryById: async ({ userId, recordId }) => {
    const res = await pool.query(
      `
      DELETE FROM food_records
      WHERE id = $1 AND user_id = $2
      RETURNING *
      `,
      [recordId, userId]
    );

    return res.rows[0];
  },

  

  getTodayStats: async (userId) => {
    const res = await pool.query(
      `
      SELECT
        COUNT(*)::int AS total_meals,
        COALESCE(SUM(f.calories_intake), 0)::int AS calories_eaten
      FROM food_records fr
      JOIN foods f ON f.id = fr.food_id
      WHERE fr.user_id = $1
      `,
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
      `
      SELECT
        fr.id,
        fr.food_id AS "foodId",
        f.name,
        f.calories_intake AS "calories"
      FROM food_records fr
      JOIN foods f ON f.id = fr.food_id
      WHERE fr.user_id = $1
      ORDER BY fr.timestamp ASC
      `,
      [userId]
    );

    return res.rows;
  },

  //stats used for graph and weekly avg
  getWeekStats: async (userId) => {

    //getDay does 0=sunday 1=monday and so on
    const now = new Date();
    const day = now.getDay();

    // if today is sunday - 0, monday was 6 days ago, otherwiee its day minus 1 
    const daysSinceMonday = day === 0 ? 6 : day - 1;

    //monday midnight
    const monday = new Date(now);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(now.getDate() - daysSinceMonday);

    //sunday 23:59:59
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const startIso = monday.toISOString();
    const endIso = sunday.toISOString();

    //query calories grouped by day
    const res = await pool.query(
      `
      SELECT
        DATE(fr.timestamp) AS day,
        COALESCE(SUM(f.calories_intake), 0)::int AS calories
      FROM food_records fr
      JOIN foods f ON f.id = fr.food_id
      WHERE fr.user_id = $1
        AND fr.timestamp >= $2
        AND fr.timestamp <= $3
      GROUP BY DATE(fr.timestamp)
      ORDER BY DATE(fr.timestamp)
      `,
      [userId, startIso, endIso]
    );

    const map = {};

    res.rows.forEach((r) => {
      const key =
        typeof r.day === "string"
          ? r.day
          : r.day.toISOString().slice(0, 10);

      map[key] = parseInt(r.calories, 10) || 0;
    });

  
    const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const week = [];

    let total = 0;
    let daysWithMeals = 0;

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);

      const dayKey = d.toISOString().slice(0, 10);
      const calories = map[dayKey] || 0;

      week.push({
        day: dayLabels[i],
        caloriesEaten: calories,
      });

      total += calories;
      if (calories > 0) daysWithMeals++;
    }

    //average only over days that actually had meals
    const average = daysWithMeals > 0 ? total / daysWithMeals : 0;

    return { week, total, average };
  },
};
