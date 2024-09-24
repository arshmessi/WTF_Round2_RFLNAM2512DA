import express from "express";
import { register, login } from "../controllers/authController.js";
import {
  adminMiddleware,
  authMiddleware,
} from "../middlewares/authMiddleware.js";
import { registerAdmin, adminLogin } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/register/admin", adminMiddleware, registerAdmin);
router.post("/login/admin", adminLogin);

router.get("/check-auth", authMiddleware, (req, res) => {
  res.status(200).json({ loggedIn: true, user: req.user });
});

router.get("/check-admin", adminMiddleware, (req, res) => {
  res.status(200).json({ loggedIn: true, user: req.user });
});
export default router;
