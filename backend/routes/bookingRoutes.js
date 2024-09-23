import express from "express";
import {
  bookEvent,
  getUserBookings,
} from "../controllers/bookingController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/book", authMiddleware, bookEvent);
router.get("/mybookings", authMiddleware, getUserBookings);

export default router;
