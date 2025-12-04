import pool from "../src/db.js";

export const HydrationModel = {

  //get todays hydration data for a user
  getToday: async (userId) => {
    const res = await pool.query(
      "SELECT * FROM hydration_records($1)",
      [userId]
    );

    return res.rows[0] || null;
  },

  //create or update todays hydration record
  upsertToday: async ({ userId, goalMl, currentMl }) => {
    //try to update existing record for today
    const updateRes = await pool.query(
      "SELECT * FROM hydration_update($1, $2, $3)",
      [userId, goalMl, currentMl]
    );

    if (updateRes.rows[0]) {
      return updateRes.rows[0];
    }

    //no record for today create one
    const insertRes = await pool.query(
      "SELECT * FROM hydration_create($1, $2, $3)",
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
      "SELECT * FROM hydration_add($1, $2)",
      [userId, amountMl]
    );

    return res.rows[0];
  },

  //remove water from todays intake
  removeWater: async ({ userId, amountMl }) => {
    const res = await pool.query(
      "SELECT * FROM hydration_remove($1, $2)",
      [userId, amountMl]
    );

    return res.rows[0] || null;
  },

  //reset todays intake to zero
  resetToday: async (userId) => {
    const res = await pool.query(
      "SELECT * FROM hydration_reset($1)",
      [userId]
    );

    return res.rows[0] || null;
  },

  //update the daily goal
  updateGoal: async ({ userId, goalMl }) => {
    return await HydrationModel.upsertToday({ userId, goalMl, currentMl: null });
  },

};
