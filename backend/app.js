import express from "express";
import sequelize from "./utils/db.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import seedDatabase from "./utils/seed.js";
import User from "./models/User.js";

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);

// Start the server and sync the database
const startServer = async () => {
  try {
    // Sync the database (with 'alter: true' for non-destructive updates)
    await sequelize.sync({ alter: true });
    const userCount = await User.count();

    if (userCount === 0) {
      await seedDatabase();
      console.log("Database seeded.");
    }

    app.listen(5000, () => console.log("Server running on port 5000"));
  } catch (error) {
    console.error("Error initializing database or server:", error);
  }
};

// Run the start function
startServer();

export default app;
