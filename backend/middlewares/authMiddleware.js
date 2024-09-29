import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";
import User from "../models/User.js";

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

export const userDetails = async (req, res) => {
  const userId = req.user.id; // Get user ID from the token

  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] }, // Exclude the password from the response
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while fetching user details",
      details: error.message,
    });
  }
};
