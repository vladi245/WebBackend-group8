import pool from "../src/db.js";

export const HydrationModel = {

  //get todas hydration data for a user
  getToday: async (userId) => {
    const res = await pool.query(
      `
      SELECT 
        id,
        goal_ml,
        current_ml,
        DATE(recorded_at) as date
      FROM hydration_records
      WHERE user_id = $1
        AND DATE(recorded_at) = CURRENT_DATE
      ORDER BY recorded_at DESC
      LIMIT 1
      `,
      [userId]
    );

    return res.rows[0] || null;
  },

  //create or update todays hydration record
  upsertToday: async ({ userId, goalMl, currentMl }) => {
    //try to update existing record for today
    const updateRes = await pool.query(
      `
      UPDATE hydration_records
      SET goal_ml = COALESCE($2, goal_ml),
          current_ml = COALESCE($3, current_ml),
          updated_at = NOW()
      WHERE user_id = $1
        AND DATE(recorded_at) = CURRENT_DATE
      RETURNING *
      `,
      [userId, goalMl, currentMl]
    );

    if (updateRes.rows[0]) {
      return updateRes.rows[0];
    }

    //no record for today create one
    const insertRes = await pool.query(
      `
      INSERT INTO hydration_records (user_id, goal_ml, current_ml)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [userId, goalMl || 2000, currentMl || 0]
    );

    return insertRes.rows[0];
  },

  //add water to todays intake
  addWater: async ({ userId, amountMl }) => {
    //first ensure we have a record for today
    const today = await HydrationModel.getToday(userId);
    
    if (!today) {
      //create a new record with the added amount
      return await HydrationModel.upsertToday({
        userId,
        goalMl: 2000,
        currentMl: amountMl
      });
    }

    //update existing record
    const res = await pool.query(
      `
      UPDATE hydration_records
      SET current_ml = current_ml + $2,
          updated_at = NOW()
      WHERE user_id = $1
        AND DATE(recorded_at) = CURRENT_DATE
      RETURNING *
      `,
      [userId, amountMl]
    );

    return res.rows[0];
  },

  //remove water from todays intake
  removeWater: async ({ userId, amountMl }) => {
    const res = await pool.query(
      `
      UPDATE hydration_records
      SET current_ml = GREATEST(0, current_ml - $2),
          updated_at = NOW()
      WHERE user_id = $1
        AND DATE(recorded_at) = CURRENT_DATE
      RETURNING *
      `,
      [userId, amountMl]
    );

    return res.rows[0] || null;
  },

  //reset todays intake to zero
  resetToday: async (userId) => {
    const res = await pool.query(
      `
      UPDATE hydration_records
      SET current_ml = 0,
          updated_at = NOW()
      WHERE user_id = $1
        AND DATE(recorded_at) = CURRENT_DATE
      RETURNING *
      `,
      [userId]
    );

    return res.rows[0] || null;
  },

  //update the daily goal
  updateGoal: async ({ userId, goalMl }) => {
    return await HydrationModel.upsertToday({ userId, goalMl, currentMl: null });
  },

  //get weekly hydration stats
  getWeeklyStats: async (userId) => {
    const res = await pool.query(
      `
      SELECT 
        DATE(recorded_at) as date,
        goal_ml,
        current_ml
      FROM hydration_records
      WHERE user_id = $1
        AND recorded_at >= CURRENT_DATE - INTERVAL '7 days'
      ORDER BY recorded_at ASC
      `,
      [userId]
    );

    return res.rows;
  }

};
