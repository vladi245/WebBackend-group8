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

describe("UserModel.deleteById", () => {
  it("calls the correct SQL function with the user ID", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    await UserModel.deleteById(5);

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM user_delete($1)",
      [5]
    );
  });
});

describe("UserModel.create", () => {
  it("creates a user with full arguments", async () => {

    const fakeUser = { id: 10, name: "Bob" };

    pool.query.mockResolvedValue({ rows: [fakeUser] });

    const data = {
      name: "Bob",
      email: "bob@test.com",
      password_hash: "hashed123",
      type: "admin",
      current_desk_id: 2,
      standing_height: 120,
      sitting_height: 75,
      user_height: 180
    };

    const user = await UserModel.create(data);

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM user_create($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        data.name,
        data.email,
        data.password_hash,
        data.type,
        data.current_desk_id,
        data.standing_height,
        data.sitting_height,
        data.user_height
      ]
    );

    expect(user).toEqual(fakeUser);
  });


  it("uses default values when some fields are missing", async () => {

    const fakeUser = { id: 11, name: "Alice" };

    pool.query.mockResolvedValue({ rows: [fakeUser] });

    const data = {
      name: "Alice",
      email: "alice@test.com",
      password_hash: "abc123"
    };

    const user = await UserModel.create(data);

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM user_create($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        "Alice",
        "alice@test.com",
        "abc123",
        "standard",
        null,
        null,
        null,
        null
      ]
    );

    expect(user).toEqual(fakeUser);
  });
});

describe("UserModel.findByEmail", () => {

    const fakeUser = { id: 11, name: "Alice" , email: "test@example.com" };

  it("calls the correct SQL function with the email", async () => {
    pool.query.mockResolvedValue({ rows: [fakeUser] });

    const result = await UserModel.findByEmail("test@example.com");

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM user_email($1)",
      ["test@example.com"]
    );
    expect(result).toEqual(fakeUser);
  });

  it("returns null when no user is found", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await UserModel.findByEmail("missing@test.com");

    expect(result).toBeNull();
  });
});

describe("UserModel.getById", () => {
  it("calls the correct SQL function with the ID", async () => {

    const fakeUser = { id: 5, name: "John" };

    pool.query.mockResolvedValue({ rows: [fakeUser] });

    const result = await UserModel.getById(5);

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM user_id($1)",
      [5]
    );
    expect(result).toEqual(fakeUser);
  });

  it("returns null when no user exists", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await UserModel.getById(123);

    expect(result).toBeNull();
  });
});

describe("UserModel.updateType", () => {
  it("calls the correct SQL function with id and type", async () => {
    const fakeUser = { id: 1, type: "standard" };

    pool.query.mockResolvedValue({ rows: [fakeUser] });

    const result = await UserModel.updateType(1, "standard");

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM user_update($1, $2)",
      [1, "standard"]
    );

    expect(result).toEqual(fakeUser);
  });

  it("returns null when no row is returned", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await UserModel.updateType(1, "admin");

    expect(result).toBeNull();
  });
});

describe("UserModel.updateName", () => {
  it("calls the correct SQL function with id and name", async () => {
    const fakeUser = { id: 1, name: "Alice" };

    pool.query.mockResolvedValue({ rows: [fakeUser] });

    const result = await UserModel.updateName(1, "Alice");

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM user_update_name($1, $2)",
      [1, "Alice"]
    );
    expect(result).toEqual(fakeUser);
  });

  it("returns null when no row is returned", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await UserModel.updateName(1, "Alice");

    expect(result).toBeNull();
  });
});

describe("UserModel.updateUserHeight", () => {
  it("calls the correct SQL function with id and height", async () => {
    const fakeUser = { id: 1, user_height: 190 };

    pool.query.mockResolvedValue({ rows: [fakeUser] });

    const result = await UserModel.updateUserHeight(1, 190);

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM user_updateheight($1, $2)",
      [1, 190]
    );
    expect(result).toEqual(fakeUser);
  });

  it("returns null when no row is returned", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await UserModel.updateUserHeight(1, 190);

    expect(result).toBeNull();
  });
});



