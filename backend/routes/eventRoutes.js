import express from "express";
import { getAllEvents, createEvent } from "../controllers/eventController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllEvents);
router.post("/", authMiddleware, createEvent); // Only admins can create events

export default router;
