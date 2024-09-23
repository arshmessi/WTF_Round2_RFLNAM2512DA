import Event from "../models/Event.js";

export const getAllEvents = async (req, res) => {
  const events = await Event.findAll();
  res.json(events);
};

export const createEvent = async (req, res) => {
  const { name, date, location, description, ticketPrice } = req.body;
  const event = await Event.create({
    name,
    date,
    location,
    description,
    ticketPrice,
  });
  res.status(201).json(event);
};
