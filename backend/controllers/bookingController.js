import Booking from "../models/Booking.js";

export const bookEvent = async (req, res) => {
  const { eventId, numberOfTickets } = req.body;

  try {
    // Check if the userId and eventId are present
    if (!req.userId || !eventId) {
      return res
        .status(400)
        .json({ error: "User ID and Event ID are required" });
    }

    // Create the booking
    const booking = await Booking.create({
      userId: req.userId, // Ensure the correct user ID is being used
      eventId,
      numberOfTickets,
    });

    // Return the created booking with a success status
    res.status(201).json(booking);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error creating booking:", error);

    // Handle specific Sequelize validation errors
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({ error: "Invalid booking data" });
    }

    // Handle unique constraint violations
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "Booking already exists" });
    }

    // General server error response
    res.status(500).json({ error: "Failed to create booking" });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      include: Event,
    });

    if (!bookings.length) {
      return res
        .status(404)
        .json({ message: "No bookings found for this user." });
    }

    res.json(bookings);
  } catch (error) {
    console.error("Error retrieving user bookings:", error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving bookings." });
  }
};

export const deleteBooking = async (req, res) => {
  const { bookingId } = req.params; // Assuming bookingId is passed as a URL parameter

  try {
    // Check if the booking exists
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Check if the user is logged in
    const userId = req.user.id;

    // Allow deletion if user is the owner of the booking or if the user is an admin
    if (booking.userId === userId || req.user.role === "admin") {
      await booking.destroy(); // Delete the booking
      return res.status(204).send(); // No content response
    } else {
      return res.status(403).json({
        error: "Forbidden: You do not have permission to delete this booking",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to delete booking", details: error.message });
  }
};
