import pool from "../src/db.js";

export const WorkoutRecordModel = {
    addRecord: async ({ workout_id, user_id, timestamp = null }) => {
        const insert = await pool.query(
            `INSERT INTO workout_records (workout_id, user_id, timestamp)
       VALUES ($1, $2, COALESCE($3, now()))
       RETURNING id`,
            [workout_id, user_id, timestamp]
        );
        const insertedId = insert.rows[0].id;

        // Return joined record including workout metadata so frontend can render name/calories
        const res = await pool.query(
            `SELECT wr.id as record_id, w.id as workout_id, w.name, w.calories_burned, w.sets, w.reps, w.muscle_group, wr.timestamp
       FROM workout_records wr
       JOIN workouts w ON wr.workout_id = w.id
       WHERE wr.id = $1`,
            [insertedId]
        );

        return res.rows[0];
    },

    getRecordsByUser: async (user_id, limit = 100) => {
        const res = await pool.query(
            `SELECT wr.id as record_id, w.id as workout_id, w.name, w.calories_burned, w.sets, w.reps, w.muscle_group, wr.timestamp
       FROM workout_records wr
       JOIN workouts w ON wr.workout_id = w.id
       WHERE wr.user_id = $1
       ORDER BY wr.timestamp DESC
       LIMIT $2`,
            [user_id, limit]
        );
        return res.rows;
    },

    getAggregatedStatsByUser: async (user_id) => {
        // total calories overall, total_workouts (distinct days) and total exercises
        // Each exercise will be treated as a 15-minute chunk when computing minutes
        const totalRes = await pool.query(
            `SELECT COUNT(DISTINCT date_trunc('day', wr.timestamp)) AS total_workouts,
                    COALESCE(SUM(COALESCE(w.calories_burned,0)),0) AS total_calories,
                    COUNT(*) AS total_exercises
       FROM workout_records wr
       JOIN workouts w ON wr.workout_id = w.id
       WHERE wr.user_id = $1`,
            [user_id]
        );

        // calories and exercise counts in the last 7 days
        const weekRes = await pool.query(
            `SELECT COALESCE(SUM(COALESCE(w.calories_burned,0)),0) AS week_calories,
                    COUNT(*) AS week_exercises
       FROM workout_records wr
       JOIN workouts w ON wr.workout_id = w.id
       WHERE wr.user_id = $1 AND wr.timestamp >= (now() - interval '6 days')::timestamp`,
            [user_id]
        );

        // daily totals for last 7 days (including today) — return date, exercises count and calories
        const daysRes = await pool.query(
            `SELECT date_trunc('day', wr.timestamp) AS day,
                    COUNT(*) AS exercises,
                    COALESCE(SUM(COALESCE(w.calories_burned,0)),0) AS calories
       FROM workout_records wr
       JOIN workouts w ON wr.workout_id = w.id
       WHERE wr.user_id = $1 AND wr.timestamp >= (now() - interval '6 days')::timestamp
       GROUP BY day
       ORDER BY day ASC`,
            [user_id]
        );

        // Normalize daily to YYYY-MM-DD strings and ensure there are entries for all 7 days
        // Build a UTC-based 7-day window to match PostgreSQL date_trunc('day', ...) which is in UTC
        const now = new Date();
        const nowUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(nowUtc);
            d.setUTCDate(nowUtc.getUTCDate() - i);
            d.setUTCHours(0, 0, 0, 0);
            days.push(d.toISOString().slice(0, 10));
        }

        const dailyMap = {};
        daysRes.rows.forEach(r => {
            const key = (r.day && r.day.toISOString) ? r.day.toISOString().slice(0, 10) : new Date(r.day).toISOString().slice(0, 10);
            dailyMap[key] = {
                exercises: parseInt(r.exercises, 10) || 0,
                calories: parseInt(r.calories, 10) || 0
            };
        });

        const dailySeries = days.map(day => {
            const entry = dailyMap[day] || { exercises: 0, calories: 0 };
            const minutes = (entry.exercises || 0) * 15;
            return { date: day, exercises: entry.exercises, calories: entry.calories, minutes };
        });

        const totalExercises = parseInt(totalRes.rows[0].total_exercises, 10) || 0;
        const weekExercises = parseInt(weekRes.rows[0].week_exercises, 10) || 0;

        return {
            total_workouts: parseInt(totalRes.rows[0].total_workouts, 10) || 0,
            total_calories: parseInt(totalRes.rows[0].total_calories, 10) || 0,
            total_minutes: totalExercises * 15,
            week_calories: parseInt(weekRes.rows[0].week_calories, 10) || 0,
            week_minutes: weekExercises * 15,
            daily: dailySeries
        };
    }
    ,

    deleteById: async (id, user_id = null) => {
        if (user_id) {
            // ensure the record belongs to the user
            await pool.query('DELETE FROM workout_records WHERE id = $1 AND user_id = $2', [id, user_id]);
        } else {
            await pool.query('DELETE FROM workout_records WHERE id = $1', [id]);
        }
    }
};
