import Event from "../models/Event.js";

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
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Only admins can create events." });
  }

  const { name, date, location, description, ticketPrice } = req.body;

  try {
    // Check for existing event with the same details
    const existingEvent = await Event.findOne({
      where: { name, date, location, description, ticketPrice },
    });
    if (existingEvent) {
      return res
        .status(400)
        .json({ message: "Event with the same details already exists." });
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
