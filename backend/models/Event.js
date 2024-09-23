import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";

const Event = sequelize.define("Event", {
  name: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  ticketPrice: { type: DataTypes.FLOAT, allowNull: false },
});

export default Event;
