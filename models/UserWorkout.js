import { get } from "../routes/workout.js";
import pool from "../src/db.js";

export const UserWorkoutModel = {
    getAll: async () => {
        const res = await pool.query("SELECT * FROM user_workouts ORDER BY id ASC");
        return res.rows;
    },
    createWorkoutEntry: async ({ userId, workoutId }) => {
        const res = await pool.query(
            `
      INSERT INTO workout_records (user_id, workout_id)
      VALUES ($1, $2)
      RETURNING *
      `,
            [userId, workoutId]
        );

        return res.rows[0];
    },



    removeEntryById: async ({ userId, recordId }) => {
        const res = await pool.query(
            `
      DELETE FROM workout_records
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
        COUNT(*)::int AS total_workouts,
        COALESCE(SUM(f.calories_burned), 0)::int AS calories_burned
      FROM workout_records wr
      JOIN workouts f ON f.id = wr.workout_id
      WHERE wr.user_id = $1
      `,
            [userId]
        );

        const row = res.rows[0];

        return {
            totalMeals: row.total_meals,
            caloriesEaten: row.calories_eaten,
        };
    },


    getWorkouts: async (userId) => {
        const res = await pool.query(
            `
      SELECT
        wr.id,
        wr.workout_id AS "workoutId",
        w.name,
        w.calories_burned AS "calories",
        w.sets,
        w.reps,
        w.muscle_group AS "muscleGroup",
        wr.timestamp
      FROM workout_records wr
      JOIN workouts w ON w.id = wr.workout_id
      WHERE wr.user_id = $1
      ORDER BY wr.timestamp DESC
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
        DATE(wr.timestamp) AS day,
        COALESCE(SUM(w.calories_burned), 0)::int AS calories
      FROM workout_records wr
      JOIN workouts w ON w.id = wr.workout_id
      WHERE wr.user_id = $1
        AND wr.timestamp >= $2
        AND wr.timestamp <= $3
      GROUP BY DATE(wr.timestamp)
      ORDER BY DATE(wr.timestamp)
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
        let totalWorkouts = 0;

        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);

            const dayKey = d.toISOString().slice(0, 10);
            const calories = map[dayKey] || 0;

            week.push({
                day: dayLabels[i],
                caloriesBurned: calories,
            });

            total += calories;
            if (calories > 0) totalWorkouts++;
        }

        return { week, total, totalWorkouts };
    },
};