import { UserModel } from "../../models/User.js";
import pool from "../../src/db.js";

// Mock DB
jest.mock("../../src/db.js", () => ({
  query: jest.fn()
}));

describe("UserModel.getAll", () => {
  it("returns rows from DB", async () => {
    const fakeRows = [
      { id: 1, name: "John Doe" }
    ];

    pool.query.mockResolvedValue({ rows: fakeRows });

    const users = await UserModel.getAll();

    expect(pool.query).toHaveBeenCalledWith("SELECT * FROM user_get()");
    expect(users).toEqual(fakeRows);
  });
});
