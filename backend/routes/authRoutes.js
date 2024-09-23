import express from "express";
import { register, login } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { registerAdmin } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/register/admin", authMiddleware, registerAdmin);

export default router;
