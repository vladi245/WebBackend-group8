
import { ContactMessageModel } from "../../models/ContactMessageModel.js";
import pool from "../../src/db.js";

// Mock DB
jest.mock("../../src/db.js", () => ({
  query: jest.fn()
}));

describe("ContactMessageModel.create", () => {
  it("calls the correct SQL function with name, email, and message", async () => {
    const fakeMessage = {
      id: 1,
      name: "John",
      email: "john@example.com",
      message: "Hello!"
    };

    pool.query.mockResolvedValue({ rows: [fakeMessage] });

    const result = await ContactMessageModel.create({
      name: "John",
      email: "john@example.com",
      message: "Hello!"
    });

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM contactmessage_create($1, $2, $3)",
      ["John", "john@example.com", "Hello!"]
    );

    expect(result).toEqual(fakeMessage);
  });

  it("returns null when no row is returned", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await ContactMessageModel.create({
      name: "John",
      email: "john@example.com",
      message: "Hello!"
    });

    expect(result).toBeNull();
  });
});

describe("ContactMessageModel.getAll", () => {
  it("calls the correct SQL function without parameters", async () => {
    const fakeMessages = [
      { id: 1, name: "A", email: "a@example.com", message: "Test 1" },
      { id: 2, name: "B", email: "b@example.com", message: "Test 2" }
    ];

    pool.query.mockResolvedValue({ rows: fakeMessages });

    const result = await ContactMessageModel.getAll();

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM contactmessage_list()"
    );

    expect(result).toEqual(fakeMessages);
    expect(result.length).toBe(2);

  });

  it("returns an empty array when there are no messages", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await ContactMessageModel.getAll();

    expect(result).toEqual([]);
  });
});
