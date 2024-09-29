import Event from "../models/Event.js";
import Booking from "../models/Booking.js";
import { Op } from "sequelize";

export const getAllEvents = async (req, res) => {
  const { name, location } = req.query;

  try {
    console.log("Query params:", req.query);

    // Build search criteria
    const criteria = {};
    if (name) criteria.name = { [Op.like]: `%${name}%` };
    if (location) criteria.location = { [Op.like]: `%${location}%` };

    console.log("Search criteria:", criteria);

    // Fetch filtered events
    const events = await Event.findAll({ where: criteria });

    if (!events.length) {
      return res
        .status(411)
        .json({ message: "No events found matching the criteria." });
    }

    res.status(200).json(events);
  } catch (error) {
    console.error("Error retrieving events:", error.message); // Log the error message
    res.status(500).json({ message: "Failed to retrieve events." });
  }
};

export const createEvent = async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(405).json({ message: "Access denied." });
  }

  const {
    name,
    startDate,
    endDate,
    location,
    description,
    ticketPrice,
    category,
  } = req.body;

  try {
    // Check for existing event with the same details
    const existingEvent = await Event.findOne({
      where: { name, startDate, location, description, ticketPrice, category },
    });
    if (existingEvent) {
      return res
        .status(400)
        .json({ message: "Event with the same details already exists." });
    }

    // Create the event
    const event = await Event.create({
      name,
      startDate,
      endDate,
      location,
      description,
      ticketPrice,
      category,
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
  const {
    name,
    startDate,
    endDate,
    location,
    description,
    ticketPrice,
    category,
  } = req.body;

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
    event.startDate = startDate || event.startDate;
    event.endDate = endDate || event.endDate;
    event.location = location || event.location;
    event.description = description || event.description;
    event.ticketPrice = ticketPrice || event.ticketPrice;
    event.category = category || event.category; // Update category

    await event.save();
    return res.status(200).json({ message: "Event modified successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to modify event", details: error.message });
  }
};
