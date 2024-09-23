import { Sequelize } from "sequelize";
import { DATABASE_URL } from "../config/config.js";

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "sqlite",
  storage: "./database.sqlite",
});

export default sequelize;
