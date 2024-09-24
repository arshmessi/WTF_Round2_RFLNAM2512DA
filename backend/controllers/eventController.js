import Event from "../models/Event.js";
import Booking from "../models/Booking.js";

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while fetching events", error });
  }
};
export const createEvent = async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(405).json({ message: "Access denied." });
  }

  const { name, date, location, description, ticketPrice } = req.body;

  try {
    // Check for existing event with the same details
    const existingEvent = await Event.findOne({
      where: { name, date, location, description, ticketPrice },
    });
    if (existingEvent) {
      res
        .status(400)
        .json({ message: "Event with the same details already exists." });
      return res;
    }

    // Create the event
    const event = await Event.create({
      name,
      date,
      location,
      description,
      ticketPrice,
    });
    res.status(201).json(event);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while creating the event", error });
  }
};

export const deleteEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    // Find the event using the eventId directly
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Allow deletion only for admins
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Forbidden: You do not have permission to delete this event",
      });
    }

    await Booking.destroy({
      where: {
        eventId: eventId,
      },
    });

    // Now delete the event
    await event.destroy();

    return res.status(204).send(); // No content response
  } catch (error) {
    console.error("Error deleting event:", error);
    return res
      .status(500)
      .json({ error: "Failed to delete event", details: error.message });
  }
};

export const modifyEvent = async (req, res) => {
  const { eventId } = req.params;
  const { name, date, location } = req.body; // Adjust as needed for your event model

  try {
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Allow modification only for admins
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Forbidden: You do not have permission to modify this event",
      });
    }

    // Update the event details
    event.name = name || event.name; // Only update fields provided
    event.date = date || event.date;
    event.location = location || event.location;

    await event.save();
    return res.status(200).json({ message: "Event modified successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to modify event", details: error.message });
  }
};
