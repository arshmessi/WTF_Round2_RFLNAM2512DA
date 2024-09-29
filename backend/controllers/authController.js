import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET } from "../config/config.js";

export const register = async (req, res) => {
  const { email, password, details } = req.body; // Added details to the request body
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({
      email,
      password: hashedPassword,
      details,
    }); // Include details in user creation
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "User already exists" });
    }
    // Handle other potential errors
    return res
      .status(500)
      .json({ message: "An error occurred during registration", error });
  }
};

export const registerAdmin = async (req, res) => {
  const { email, password, details } = req.body; // Added details to the request body

  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Only admins can register new admins." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const admin = await User.create({
      email,
      password: hashedPassword,
      role: "admin",
      details,
    });
    res.status(201).json({ message: "Admin registered successfully", admin });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Admin already exists" });
    }
    return res
      .status(500)
      .json({ message: "An error occurred during admin registration", error });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
    res.json({ token, details: user.details }); // Include user details in the response
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred during login", error });
  }
};

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await User.findOne({ where: { email, role: "admin" } });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ error: "Invalid admin credentials" });
    }
    const token = jwt.sign({ id: admin.id, role: admin.role }, JWT_SECRET);
    res.json({ token, details: admin.details }); // Include admin details in the response
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred during admin login", error });
  }
};
