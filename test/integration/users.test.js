import { api } from "../setup/testApp.js";
import { generateToken } from "../setup/token.js";
import { mockFunction } from "../setup/mockDb.js";

describe("GET /api/users", () => {
  let UserModel;

  beforeAll(async () => {
    await mockFunction(
      "../../models/User.js",
      "getAll",
      [
        { id: 1, name: "Test User 1" },
        { id: 2, name: "Test User 2" }
      ]
    );

    //import after mocking
    UserModel = await import("../../models/User.js");
  });

  it("returns a list of users with valid token", async () => {
    const token = generateToken();

    const res = await api
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });
});
