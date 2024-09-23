import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";
import User from "./User.js";
import Event from "./Event.js";

const Booking = sequelize.define("Booking", {
  numberOfTickets: { type: DataTypes.INTEGER, allowNull: false },
});

Booking.belongsTo(User);
Booking.belongsTo(Event);

export default Booking;
