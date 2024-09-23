import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";
import User from "./User.js";
import Event from "./Event.js";

const Booking = sequelize.define("Booking", {
  numberOfTickets: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false }, // Add userId field
  eventId: { type: DataTypes.INTEGER, allowNull: false }, // Add eventId field
});

// Associations
Booking.belongsTo(User, { foreignKey: "userId" });
Booking.belongsTo(Event, { foreignKey: "eventId" });

export default Booking;
