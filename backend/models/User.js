import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";

const User = sequelize.define(
  "User",
  {
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: "user" },
    details: {
      type: DataTypes.JSON, // Use JSON type to store additional user details as an object
      allowNull: true,
    },
  },
  {
    timestamps: true, // Enables createdAt and updatedAt fields
  }
);

export default User;
