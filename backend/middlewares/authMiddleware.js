import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ error: "Invalid token", details: error.message });
  }
};

export const adminMiddleware = (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while verifying admin access",
      details: error.message,
    });
  }
};
