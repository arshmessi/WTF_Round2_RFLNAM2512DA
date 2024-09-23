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
sequelize.sync().then(async () => {
  try {
    const userCount = await User.count();
    if (userCount === 0) {
      await seedDatabase(); // Create initial admin if there are no users
    }
    app.listen(5000, () => console.log("Server running on port 5000"));
  } catch (error) {
    console.error("Error initializing database:", error);
  }
});

export default app;
