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
        // total calories overall and total_workouts counted by distinct days with >=1 record
        // Also compute total_records for minutes (15 minutes per record)
        const totalRes = await pool.query(
            `SELECT COUNT(DISTINCT date_trunc('day', wr.timestamp)) AS total_workouts,
                    COALESCE(SUM(COALESCE(w.calories_burned,0)),0) AS total_calories,
                    COUNT(*) AS total_records
       FROM workout_records wr
       JOIN workouts w ON wr.workout_id = w.id
       WHERE wr.user_id = $1`,
            [user_id]
        );

        // calories and record counts in the last 7 days
        const weekRes = await pool.query(
            `SELECT COUNT(*) AS week_records, COALESCE(SUM(COALESCE(w.calories_burned,0)),0) AS week_calories
       FROM workout_records wr
       JOIN workouts w ON wr.workout_id = w.id
       WHERE wr.user_id = $1 AND wr.timestamp >= (now() - interval '6 days')::timestamp`,
            [user_id]
        );

        // daily totals for last 7 days (including today) — return date, calories and record count
        const daysRes = await pool.query(
            `SELECT date_trunc('day', wr.timestamp) AS day,
                    COALESCE(SUM(COALESCE(w.calories_burned,0)),0) AS calories,
                    COUNT(*) AS records
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
                calories: parseInt(r.calories, 10) || 0,
                records: parseInt(r.records, 10) || 0
            };
        });

        const dailySeries = days.map(day => ({
            date: day,
            calories: (dailyMap[day] && dailyMap[day].calories) || 0,
            minutes: ((dailyMap[day] && dailyMap[day].records) || 0) * 15
        }));

        const totalRecords = parseInt(totalRes.rows[0].total_records, 10) || 0;
        const weekRecords = parseInt(weekRes.rows[0].week_records, 10) || 0;

        return {
            total_workouts: parseInt(totalRes.rows[0].total_workouts, 10) || 0,
            total_calories: parseInt(totalRes.rows[0].total_calories, 10) || 0,
            total_minutes: totalRecords * 15,
            week_calories: parseInt(weekRes.rows[0].week_calories, 10) || 0,
            week_minutes: weekRecords * 15,
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