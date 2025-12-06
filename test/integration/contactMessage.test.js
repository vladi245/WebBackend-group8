import { api } from "../setup/testApp.js";
import * as ContactMessageModelModule from "../../models/ContactMessageModel.js";

// --- Mock ContactMessageModel ---
ContactMessageModelModule.ContactMessageModel = {
  create: jest.fn(({ name, email, message }) => ({
    id: 1,
    name,
    email,
    message,
    created_at: new Date()
  })),
  getAll: jest.fn(() => [
    { id: 1, name: "Alice", email: "alice@test.com", message: "Hello", created_at: new Date() },
    { id: 2, name: "Bob", email: "bob@test.com", message: "Hi there", created_at: new Date() }
  ])
};

afterEach(() => {
  jest.clearAllMocks();
});

describe("POST /api/contact/", () => {
  it("creates a new contact message successfully", async () => {
    const res = await api.post("/api/contact/").send({
      name: "Alice",
      email: "alice@test.com",
      message: "Hello"
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "Message received");
    expect(res.body.data).toHaveProperty("id", 1);
  });

  it("returns 400 if required fields are missing", async () => {
    const res = await api.post("/api/contact/").send({
      name: "Alice",
      email: ""
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/All fields are required/);
  });
});

describe("GET /api/contact/", () => {
  it("returns all contact messages", async () => {
    const res = await api.get("/api/contact/");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toHaveProperty("name", "Alice");
  });

  it("handles errors gracefully", async () => {
    // simulate DB error
    ContactMessageModelModule.ContactMessageModel.getAll.mockRejectedValueOnce(new Error("DB error"));

    const res = await api.get("/api/contact/");
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error", "Database error while fetching messages");
  });
});
