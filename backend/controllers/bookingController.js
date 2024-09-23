import Booking from "../models/Booking.js";
import Event from "../models/Event.js";

export const bookEvent = async (req, res) => {
  const { eventId, numberOfTickets } = req.body;
  const booking = await Booking.create({
    userId: req.user.id,
    eventId,
    numberOfTickets,
  });
  res.status(201).json(booking);
};

export const getUserBookings = async (req, res) => {
  const bookings = await Booking.findAll({
    where: { userId: req.user.id },
    include: Event,
  });
  res.json(bookings);
};
