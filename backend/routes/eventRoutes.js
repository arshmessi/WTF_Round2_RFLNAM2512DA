import express from "express";
import {
  getAllEvents,
  createEvent,
  deleteEvent,
  modifyEvent,
} from "../controllers/eventController.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllEvents); // Supports query params ?name=concert&location=stadium
router.post("/", authMiddleware, createEvent);
router.delete("/:eventId", adminMiddleware, deleteEvent);
router.put("/:eventId", adminMiddleware, modifyEvent);

export default router;
