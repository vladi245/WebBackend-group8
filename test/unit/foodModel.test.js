import { FoodModel } from "../../models/Food.js";
import pool from "../../src/db.js";

jest.mock("../../src/db.js", () => ({
  query: jest.fn()
}));


describe("FoodModel.getAll", () => {
  it("calls the correct SQL function and returns all food items", async () => {
    const fakeFoods = [
      { id: 1, name: "Apple", calories_intake: 95 },
      { id: 2, name: "Banana", calories_intake: 105 }
    ];

    pool.query.mockResolvedValue({ rows: fakeFoods });

    const result = await FoodModel.getAll();

    expect(pool.query).toHaveBeenCalledWith("SELECT * FROM list_food()");
    expect(result).toEqual(fakeFoods);
  });

  it("returns an empty array when no food exists", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await FoodModel.getAll();

    expect(result).toEqual([]);
  });
});

describe("FoodModel.create", () => {
  it("calls the correct SQL function with name and calories_intake", async () => {
    const fakeFood = { id: 1, name: "Orange", calories_intake: 62 };

    pool.query.mockResolvedValue({ rows: [fakeFood] });

    const result = await FoodModel.create({ name: "Orange", calories_intake: 62 });

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM create_food($1, $2)",
      ["Orange", 62]
    );
    expect(result).toEqual(fakeFood);
  });

  it("returns undefined when no row is returned", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await FoodModel.create({ name: "Orange", calories_intake: 62 });

    expect(result).toBeUndefined();
  });
});

describe("FoodModel.deleteById", () => {
  it("calls the correct SQL function with the food ID", async () => {
    pool.query.mockResolvedValue({});

    await FoodModel.deleteById(5);

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT delete_food($1)",
      [5]
    );
  });
});

