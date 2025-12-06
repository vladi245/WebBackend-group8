import { HydrationModel } from "../../models/Hydration.js";
import pool from "../../src/db.js";

jest.mock("../../src/db.js", () => ({
  query: jest.fn()
}));

describe("HydrationModel", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getToday", () => {
    it("returns the latest hydration record for today", async () => {
      const fakeRecord = { id: 1, goal_ml: 2000, current_ml: 500, date: "2025-12-06" };
      pool.query.mockResolvedValue({ rows: [fakeRecord] });

      const result = await HydrationModel.getToday(1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("FROM hydration_records"),
        [1]
      );
      expect(result).toEqual(fakeRecord);
    });

    it("returns null if no record exists today", async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await HydrationModel.getToday(1);

      expect(result).toBeNull();
    });
  });

  describe("upsertToday", () => {
    it("inserts a new record if none exists", async () => {
        const newRecord = { id: 2, goal_ml: 2000, current_ml: 300 };

        // Simulate UPDATE returning nothing (no record exists)
        pool.query.mockResolvedValueOnce({ rows: [] });

        // Simulate INSERT returning the new record
        pool.query.mockResolvedValueOnce({ rows: [newRecord] });

        const result = await HydrationModel.upsertToday({
        userId: 2,
        goalMl: 2000,
        currentMl: 300
        });

        expect(pool.query).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining("UPDATE hydration_records"),
        [2, 2000, 300]
        );

        expect(pool.query).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining("INSERT INTO hydration_records"),
        [2, 2000, 300]
        );

        expect(result).toEqual(newRecord);
    });
    });


  describe("addWater", () => {
    it("adds water to existing record", async () => {
      const fakeToday = { id: 1, goal_ml: 2000, current_ml: 500 };
      const fakeUpdated = { id: 1, goal_ml: 2000, current_ml: 800 };

      // mock getToday to return existing record
      HydrationModel.getToday = jest.fn().mockResolvedValue(fakeToday);
      pool.query.mockResolvedValue({ rows: [fakeUpdated] });

      const result = await HydrationModel.addWater({ userId: 1, amountMl: 300 });

      expect(HydrationModel.getToday).toHaveBeenCalledWith(1);
      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining("UPDATE hydration_records"), [1, 300]);
      expect(result).toEqual(fakeUpdated);
    });

    it("creates a new record if none exists", async () => {
      const fakeInserted = { id: 2, goal_ml: 2000, current_ml: 250 };
      HydrationModel.getToday = jest.fn().mockResolvedValue(null);
      HydrationModel.upsertToday = jest.fn().mockResolvedValue(fakeInserted);

      const result = await HydrationModel.addWater({ userId: 2, amountMl: 250 });

      expect(HydrationModel.getToday).toHaveBeenCalledWith(2);
      expect(HydrationModel.upsertToday).toHaveBeenCalledWith({ userId: 2, goalMl: 2000, currentMl: 250 });
      expect(result).toEqual(fakeInserted);
    });
  });

  describe("removeWater", () => {
    it("decreases water intake but not below 0", async () => {
      const fakeUpdated = { id: 1, current_ml: 400 };
      pool.query.mockResolvedValue({ rows: [fakeUpdated] });

      const result = await HydrationModel.removeWater({ userId: 1, amountMl: 100 });

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining("GREATEST(0, current_ml - $2)"), [1, 100]);
      expect(result).toEqual(fakeUpdated);
    });

    it("returns null if no record is updated", async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await HydrationModel.removeWater({ userId: 1, amountMl: 100 });

      expect(result).toBeNull();
    });
  });

  describe("resetToday", () => {
    it("resets current_ml to 0", async () => {
      const fakeUpdated = { id: 1, current_ml: 0 };
      pool.query.mockResolvedValue({ rows: [fakeUpdated] });

      const result = await HydrationModel.resetToday(1);

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining("SET current_ml = 0"), [1]);
      expect(result).toEqual(fakeUpdated);
    });

    it("returns null if no record exists", async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await HydrationModel.resetToday(1);

      expect(result).toBeNull();
    });
  });

  describe("updateGoal", () => {
    it("calls upsertToday with new goal", async () => {
      const fakeUpdated = { id: 1, goal_ml: 2500, current_ml: 500 };
      HydrationModel.upsertToday = jest.fn().mockResolvedValue(fakeUpdated);

      const result = await HydrationModel.updateGoal({ userId: 1, goalMl: 2500 });

      expect(HydrationModel.upsertToday).toHaveBeenCalledWith({ userId: 1, goalMl: 2500, currentMl: null });
      expect(result).toEqual(fakeUpdated);
    });
  });

  describe("getWeeklyStats", () => {
    it("returns hydration records from last 7 days", async () => {
      const fakeRecords = [
        { date: "2025-12-01", goal_ml: 2000, current_ml: 1800 },
        { date: "2025-12-02", goal_ml: 2000, current_ml: 1900 }
      ];
      pool.query.mockResolvedValue({ rows: fakeRecords });

      const result = await HydrationModel.getWeeklyStats(1);

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining("AND recorded_at >= CURRENT_DATE - INTERVAL '7 days'"), [1]);
      expect(result).toEqual(fakeRecords);
    });

    it("returns empty array if no records exist", async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await HydrationModel.getWeeklyStats(1);

      expect(result).toEqual([]);
    });
  });

});
