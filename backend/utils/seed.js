import sequelize from "./utils/db.js";
import User from "./models/User.js";
import bcrypt from "bcrypt";

const seedDatabase = async () => {
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
    password: await bcrypt.hash("adminPassword123", 10),
    role: "admin", // Set role to 'admin'
  });

  console.log("Database seeded with users:");
  console.log(`Regular User: ${regularUser.email}`);
  console.log(`Admin User: ${adminUser.email}`);
};

seedDatabase()
  .then(() => {
    console.log("Seeding completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  });
