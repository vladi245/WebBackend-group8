import { MealsModel } from "../../models/MealsModel.js";
import pool from "../../src/db.js";

jest.mock("../../src/db.js", () => ({
  query: jest.fn()
}));

describe("MealsModel", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createEntry", () => {
    it("creates a meal record for a user", async () => {
      const fakeRecord = { id: 1, user_id: 1, food_id: 2 };
      pool.query.mockResolvedValue({ rows: [fakeRecord] });

      const result = await MealsModel.createEntry({ userId: 1, foodId: 2 });

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM meal_records($1, $2)",
        [1, 2]
      );
      expect(result).toEqual(fakeRecord);
    });

    it("returns undefined if no row is returned", async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await MealsModel.createEntry({ userId: 1, foodId: 2 });

      expect(result).toBeUndefined();
    });
  });

  describe("getAllFoods", () => {
    it("returns a list of foods", async () => {
      const fakeFoods = [
        { id: 1, name: "Apple" },
        { id: 2, name: "Banana" }
      ];
      pool.query.mockResolvedValue({ rows: fakeFoods });

      const result = await MealsModel.getAllFoods();

      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM meal_list()");
      expect(result).toEqual(fakeFoods);
    });

    it("returns empty array when no foods exist", async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await MealsModel.getAllFoods();

      expect(result).toEqual([]);
    });
  });

  describe("removeEntryById", () => {
    it("removes a meal record by ID", async () => {
      const fakeRemoved = { id: 1, user_id: 1, food_id: 2 };
      pool.query.mockResolvedValue({ rows: [fakeRemoved] });

      const result = await MealsModel.removeEntryById({ userId: 1, recordId: 1 });

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM meal_delete($1, $2)",
        [1, 1]
      );
      expect(result).toEqual(fakeRemoved);
    });

    it("returns undefined if no row is removed", async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await MealsModel.removeEntryById({ userId: 1, recordId: 1 });

      expect(result).toBeUndefined();
    });
  });

  describe("getTodayStats", () => {
    it("returns today's meal statistics", async () => {
      const fakeRow = { total_meals: 3, calories_eaten: 1500 };
      pool.query.mockResolvedValue({ rows: [fakeRow] });

      const result = await MealsModel.getTodayStats(1);

      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM meal_today($1)", [1]);
      expect(result).toEqual({
        totalMeals: 3,
        caloriesEaten: 1500,
        averageIntake: 1500
      });
    });

    it("throws an error if no row is returned", async () => {
      pool.query.mockResolvedValue({ rows: [] });

      // Since getTodayStats assumes rows[0] exists, it will throw if undefined
      await expect(MealsModel.getTodayStats(1)).rejects.toThrow();
    });
  });

  describe("getMeals", () => {
    it("returns all meals for a user", async () => {
      const fakeMeals = [
        { id: 1, food_id: 2 },
        { id: 2, food_id: 3 }
      ];
      pool.query.mockResolvedValue({ rows: fakeMeals });

      const result = await MealsModel.getMeals(1);

      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM meal_get($1)", [1]);
      expect(result).toEqual(fakeMeals);
    });

    it("returns empty array if no meals exist", async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await MealsModel.getMeals(1);

      expect(result).toEqual([]);
    });
  });

  describe("getWeekStats", () => {
    it("returns weekly stats including total and average", async () => {
      const fakeRows = [
        { day: new Date("2025-12-01"), calories: "100" },
        { day: new Date("2025-12-02"), calories: "200" },
      ];
      pool.query.mockResolvedValue({ rows: fakeRows });

      const result = await MealsModel.getWeekStats(1);

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM meal_clear($1, $2, $3)"), expect.any(Array));
      expect(result).toHaveProperty("week");
      expect(result).toHaveProperty("total");
      expect(result).toHaveProperty("average");
      expect(result.total).toBe(300);
      expect(result.average).toBe(150);
      expect(result.week.length).toBe(7);
    });

    it("returns zero stats if no meals were recorded", async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await MealsModel.getWeekStats(1);

      expect(result.total).toBe(0);
      expect(result.average).toBe(0);
      expect(result.week.every(d => d.caloriesEaten === 0)).toBe(true);
    });
  });

});
