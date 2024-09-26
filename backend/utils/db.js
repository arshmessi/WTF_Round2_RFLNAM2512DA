import { Sequelize } from "sequelize";
import { DATABASE_URL } from "../config/config.js";

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "sqlite",
  storage: "./tmp/database.sqlite", // Persistent storage
  logging: true,
});

export default sequelize;
