import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

const { JWT_SECRET } = config;

export function generateToken(user) {
  const payload = {
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "15m",
  });
}

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    return decoded;
  } catch (error) {
    throw new Error("Token no valido");
  }
}
