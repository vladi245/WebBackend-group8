import pool from "../src/db.js";

export const MealsModel = {


  createEntry: async ({ userId, foodId }) => {
    const res = await pool.query(
      "SELECT * FROM meal_records($1, $2)",
      [userId, foodId]
    );

    return res.rows[0];
  },

  getAllFoods: async () => {
    const res = await pool.query("SELECT * FROM meal_list()");
    return res.rows;
  },


  removeEntryById: async ({ userId, recordId }) => {
    const res = await pool.query(
      "SELECT * FROM meal_delete($1, $2)",
      [userId, recordId]
    );

    return res.rows[0];
  },



  getTodayStats: async (userId) => {
    const res = await pool.query(
      "SELECT * FROM meal_today($1)",
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
      "SELECT * FROM meal_get($1)",
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
      "SELECT * FROM meal_clear($1, $2, $3)",
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
