import Event from "../models/Event.js";
import { authMiddleware } from "./authMiddleware.js";

export const checkEventAndUser = async (req, res, next) => {
  // First, use the existing authMiddleware to check for JWT and attach user to request
  authMiddleware(req, res, async () => {
    try {
      // Check if the event exists
      const event = await Event.findByPk(req.body.eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      // Ensure the user ID is attached from the authenticated user
      req.userId = req.user.id;
      next();
    } catch (error) {
      console.error("Error checking event:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
};
