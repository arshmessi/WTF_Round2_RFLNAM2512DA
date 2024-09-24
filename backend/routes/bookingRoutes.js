import express from "express";
import {
  bookEvent,
  getUserBookings,
  deleteBooking,
} from "../controllers/bookingController.js";
import { checkEventAndUser } from "../middlewares/bookingMiddleware.js";
import {
  adminMiddleware,
  authMiddleware,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/book", checkEventAndUser, bookEvent);
router.get("/mybookings", authMiddleware, getUserBookings);
router.delete("/bookings/:bookingId", authMiddleware, deleteBooking);

export default router;
