import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function generateAccessToken(userId: string, role: string) {
  return jwt.sign({ sub: userId, role }, env.JWT_SECRET, { expiresIn: "15m" });
}
