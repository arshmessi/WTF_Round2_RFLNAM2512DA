import sequelize from "./db.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const seedDatabase = async () => {
  try {
    // Ensure the database connection is established
    await sequelize.authenticate();
    console.log("Database connection established.");

    // Sync the database, dropping existing tables if force is true
    await sequelize.sync({ force: true });

    // Create a regular user
    const regularUser = await User.create({
      email: "regularuser@example.com",
      password: await bcrypt.hash("userPassword123", 10),
      role: "user", // Assuming 'role' is a field indicating user type
    });

    // Create an admin user
    const adminUser = await User.create({
      email: "admin@example.com",
      password: await bcrypt.hash("admin123", 10),
      role: "admin", // Set role to 'admin'
    });

    console.log("Database seeded with users:");
    console.log(`Regular User: ${regularUser.email}`);
    console.log(`Admin User: ${adminUser.email}`);
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

export default seedDatabase; // Ensure you export the function
