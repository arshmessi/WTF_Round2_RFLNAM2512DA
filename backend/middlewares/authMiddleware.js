import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Store the decoded user object in req.user

    next();
  } catch (error) {
    return res
      .status(403)
      .json({ error: "Invalid token", details: error.message });
  }
};

export const adminMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    next();
  } catch (error) {
    return res
      .status(400)
      .json({ error: "Invalid token", details: error.message });
  }
};
