import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret_in_production";

export function generateToken(payload = {}) {
  const defaultPayload = {
    id: 1,
    email: "test@test.com",
    type: "admin"
  };

  return jwt.sign({ ...defaultPayload, ...payload }, JWT_SECRET, {
    expiresIn: "1h"
  });
}
