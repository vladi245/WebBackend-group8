import { DeskModel } from "../../models/Desk.js";
import pool from "../../src/db.js";

// Mock the DB
jest.mock("../../src/db.js", () => ({
  query: jest.fn()
}));

describe("DeskModel.getAllDesks", () => {
  it("calls the correct SQL function without parameters", async () => {
    const fakeDesks = [
      { id: 'cd:fb:1a:53:fb:e6', height: 1000 },
      { id: 'cd:fb:1a:53:fb:e7', height: 1200 }
    ];

    pool.query.mockResolvedValue({ rows: fakeDesks });

    const result = await DeskModel.getAllDesks();

    expect(pool.query).toHaveBeenCalledWith("SELECT * FROM desk_list()");
    expect(result).toEqual(fakeDesks);
    expect(result.length).toBe(2);
  });

  it("returns an empty array when there are no desks", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await DeskModel.getAllDesks();

    expect(result).toEqual([]);
  });
});

describe("DeskModel.getDeskById", () => {
  it("calls the correct SQL function with the id", async () => {
    const fakeDesk = { id: "cd:fb:1a:53:fb:e6", height: 1000 };

    pool.query.mockResolvedValue({ rows: [fakeDesk] });

    const result = await DeskModel.getDeskById('cd:fb:1a:53:fb:e6');

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM desk_get($1)",
      ["cd:fb:1a:53:fb:e6"]
    );
    expect(result).toEqual(fakeDesk);
  });

  it("returns null when desk is not found", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await DeskModel.getDeskById("cd:fb:1a:53:fb:e6");

    expect(result).toBeNull();
  });
});

describe("DeskModel.createDesk", () => {
  it("calls the correct SQL function with id and height", async () => {
    const fakeDesk = { id: 'cd:fb:1a:53:fb:e6', height: 1000 };

    pool.query.mockResolvedValue({ rows: [fakeDesk] });

    const result = await DeskModel.createDesk({ id: 'cd:fb:1a:53:fb:e6', height: 1000 });

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM desk_create($1, $2)",
      ['cd:fb:1a:53:fb:e6', 1000]
    );
    expect(result).toEqual(fakeDesk);
  });

  it("returns null when creation fails", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await DeskModel.createDesk({ id: 'cd:fb:1a:53:fb:e6', height: 1000 });

    expect(result).toBeNull();
  });
});

describe("DeskModel.updateDeskHeight", () => {
  it("calls the correct SQL function with id and new height", async () => {
    const fakeDesk = { id: 'cd:fb:1a:53:fb:e6', height: 1200 };

    pool.query.mockResolvedValue({ rows: [fakeDesk] });

    const result = await DeskModel.updateDeskHeight('cd:fb:1a:53:fb:e6', 1200);

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM desk_update($1, $2)",
      ['cd:fb:1a:53:fb:e6', 1200]
    );
    expect(result).toEqual(fakeDesk);
  });

  it("returns null when update fails", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await DeskModel.updateDeskHeight('cd:fb:1a:53:fb:e6', 1200);

    expect(result).toBeNull();
  });
});
