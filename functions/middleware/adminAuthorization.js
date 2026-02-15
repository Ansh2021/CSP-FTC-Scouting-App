import jwt from "jsonwebtoken";
import { defineSecret } from "firebase-functions/params";

const JWT_SECRET = defineSecret("JWT_SECRET");

export function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  const jwtSecret = JWT_SECRET.value();

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);

    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Admin only" });
    }

    next();
  } catch {
    return res
      .status(401)
      .json({ error: "Unauthorized: Invalid or expired token" });
  }
}
