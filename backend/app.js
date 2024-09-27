import express from "express";
import sequelize from "./utils/db.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import seedDatabase from "./utils/seed.js";
import User from "./models/User.js";
import cors from "cors";

const PORT = process.env.PORT || 5000; // Default to 5000 for local testing
const app = express();

const corsOptions = {
  origin: "http://localhost:3000", // Specify the allowed origin (your frontend URL)
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow credentials (cookies, authorization headers)
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests
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

    app.listen(PORT, () => console.log("Server running on port ", PORT));
  } catch (error) {
    console.error("Error initializing database or server:", error);
  }
};

// Run the start function
startServer();

export default app;
