import { WorkoutRecordModel } from "../../models/WorkoutRecord.js";
import pool from "../../src/db.js";

jest.mock("../../src/db.js", () => ({
  query: jest.fn()
}));

describe("WorkoutRecordModel", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("addRecord", () => {
    it("inserts a new record and returns the joined workout record", async () => {
      const insertedId = 10;
      const joinedRecord = { record_id: 10, workout_name: "Push-up", calories_burned: 50 };

      // Mock insertion
      pool.query.mockResolvedValueOnce({ rows: [{ record_id: insertedId }] });
      // Mock join select
      pool.query.mockResolvedValueOnce({ rows: [joinedRecord] });

      const result = await WorkoutRecordModel.addRecord({ workout_id: 1, user_id: 2, timestamp: null });

      expect(pool.query).toHaveBeenNthCalledWith(
        1,
        "SELECT * FROM workoutrecord_model($1, $2, $3)",
        [1, 2, null]
      );

      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        "SELECT * FROM workoutrecord_get($1, $2)",
        [2, insertedId]
      );

      expect(result).toEqual(joinedRecord);
    });
  });

  describe("getRecordsByUser", () => {
    it("returns all records for a user", async () => {
      const records = [
        { record_id: 1, workout_id: 1 },
        { record_id: 2, workout_id: 2 }
      ];
      pool.query.mockResolvedValue({ rows: records });

      const result = await WorkoutRecordModel.getRecordsByUser(1, 50);

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM workoutrecord_user($1, $2)",
        [1, 50]
      );
      expect(result).toEqual(records);
    });

    it("returns empty array if no records exist", async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await WorkoutRecordModel.getRecordsByUser(1, 50);

      expect(result).toEqual([]);
    });
  });

  describe("getAggregatedStatsByUser", () => {
    it("returns total, weekly, and daily stats", async () => {
      const now = new Date();
      const todayStr = now.toISOString().slice(0, 10);

      pool.query
        .mockResolvedValueOnce({ rows: [{ total_workouts: 5, total_calories: 500, total_records: 10 }] }) // total
        .mockResolvedValueOnce({ rows: [{ week_calories: 300, week_records: 6 }] }) // week
        .mockResolvedValueOnce({ rows: [{ day: now, calories: "100", records: "2" }] }); // daily

      const result = await WorkoutRecordModel.getAggregatedStatsByUser(1);

      expect(pool.query).toHaveBeenNthCalledWith(1, "SELECT * FROM workoutrecord_stats($1)", [1]);
      expect(pool.query).toHaveBeenNthCalledWith(2, "SELECT * FROM workoutrecord_week($1)", [1]);
      expect(pool.query).toHaveBeenNthCalledWith(3, "SELECT * FROM workoutrecord_day($1)", [1]);

      expect(result.total_workouts).toBe(5);
      expect(result.total_calories).toBe(500);
      expect(result.total_minutes).toBe(150); // 10 records * 15
      expect(result.week_calories).toBe(300);
      expect(result.week_minutes).toBe(90);   // 6 records * 15
      expect(result.daily.find(d => d.date === todayStr).calories).toBe(100);
      expect(result.daily.find(d => d.date === todayStr).minutes).toBe(30); // 2 records * 15
    });

    it("handles empty daily and weekly data", async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ total_workouts: 0, total_calories: 0, total_records: 0 }] })
        .mockResolvedValueOnce({ rows: [{ week_calories: 0, week_records: 0 }] })
        .mockResolvedValueOnce({ rows: [] });

      const result = await WorkoutRecordModel.getAggregatedStatsByUser(1);

      expect(result.total_workouts).toBe(0);
      expect(result.total_calories).toBe(0);
      expect(result.total_minutes).toBe(0);
      expect(result.week_calories).toBe(0);
      expect(result.week_minutes).toBe(0);
      expect(result.daily.every(d => d.calories === 0 && d.minutes === 0)).toBe(true);
    });
  });

  describe("deleteById", () => {
    it("calls the correct SQL function with id and user_id", async () => {
      pool.query.mockResolvedValue({});

      await WorkoutRecordModel.deleteById(5, 1);

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT *FROM workoutrecord_delete($1, $2)",
        [5, 1]
      );
    });

    it("works with only id parameter", async () => {
      pool.query.mockResolvedValue({});

      await WorkoutRecordModel.deleteById(5);

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT *FROM workoutrecord_delete($1, $2)",
        [5, null]
      );
    });
  });

});
