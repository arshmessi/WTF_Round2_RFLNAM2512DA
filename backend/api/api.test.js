// test/api.test.js
import request from "supertest";
import app from "../app.js"; // Adjust the path to your app.js
import sequelize from "../utils/db.js"; // Adjust as per your DB config
import User from "../models/User.js"; // Adjust as per your model structure
import Event from "../models/Event.js"; // Adjust as per your model structure
import Booking from "../models/Booking.js"; // Adjust as per your model structure
import seedDatabase from "../utils/seed.js"; // Path to your seed script
import bcrypt from "bcryptjs";

// Test suite
describe("API Tests", () => {
  let adminToken, userToken;
  let adminId, userId;
  let eventId;

  beforeAll(async () => {
    await sequelize.sync({ force: true }); // Reset the database
    await seedDatabase(); // Run seeders

    // Login as admin (assume admin@example.com exists due to seeding)
    adminToken = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@example.com", password: "admin123" })
      .then((res) => res.body.token);
    console.log("Admin token", adminToken);
    // Login as a regular user (assume user@example.com exists due to seeding)
    userToken = await request(app)
      .post("/api/auth/login")
      .send({ email: "regularuser@example.com", password: "userPassword123" })
      .then((res) => res.body.token);
  });

  afterAll(async () => {
    await sequelize.close(); // Close database connection
  });

  describe("User Registration and Login", () => {
    it("should register a user successfully", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ email: "newuser@example.com", password: "password123" });
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("User registered successfully");
    });

    it("should login the user successfully", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "newuser@example.com", password: "password123" });
      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    it("should not login with incorrect password", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "newuser@example.com", password: "wrongPassword" });
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Invalid credentials");
    });
  });

  describe("Admin Registration", () => {
    it("should allow admin to register another admin", async () => {
      const res = await request(app)
        .post("/api/auth/register/admin")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ email: "admin2@example.com", password: "adminPassword" });
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Admin registered successfully");
    });

    it("should not allow non-admin to register admin", async () => {
      const res = await request(app)
        .post("/api/auth/register/admin")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ email: "admin3@example.com", password: "adminPassword" });
      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe("Only admins can register new admins.");
    });
  });

  describe("Event Management", () => {
    beforeAll(async () => {
      const res = await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Concert",
          date: new Date(),
          location: "Stadium",
          description: "Live concert",
          ticketPrice: 100,
        });
      eventId = res.body.id; // Save the event ID for later tests
    });

    it("should create an event", async () => {
      const res = await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Art Exhibition",
          date: new Date(),
          location: "Gallery",
          description: "Art showcase",
          ticketPrice: 50,
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe("Art Exhibition");
    });

    it("should not allow non-admin to create an event", async () => {
      const res = await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "Theater Play",
          date: new Date(),
          location: "Theater",
          description: "Drama performance",
          ticketPrice: 80,
        });
      expect(res.statusCode).toBe(405);
      expect(res.body.message).toBe("Access denied.");
    });

    it("should retrieve all events", async () => {
      const res = await request(app).get("/api/events");
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeDefined();
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe("Booking Management", () => {
    it("should create a booking", async () => {
      const res = await request(app)
        .post("/api/bookings/book")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          eventId: eventId,
          numberOfTickets: 2,
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.numberOfTickets).toBe(2);
    });

    it("should retrieve user's bookings", async () => {
      const res = await request(app)
        .get("/api/bookings/mybookings")
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeDefined();
      expect(res.body.length).toBeGreaterThan(0);
    });

    it("should delete a booking", async () => {
      const res = await request(app)
        .delete(`/api/bookings/bookings/${1}`) // Make sure booking ID 1 exists
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200); // Check for status code 200
      expect(res.body.message).toBe("Booking deleted successfully."); // Check for success message
    });
    it("should create a booking", async () => {
      const res = await request(app)
        .post("/api/bookings/book")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          eventId: eventId,
          numberOfTickets: 12,
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.numberOfTickets).toBe(12);
    });
    it("should create a booking", async () => {
      const res = await request(app)
        .post("/api/bookings/book")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          eventId: eventId,
          numberOfTickets: 11,
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.numberOfTickets).toBe(11);
    });
    it("should allow deleting a booking if user is  the owner", async () => {
      const res = await request(app)
        .delete(`/api/bookings/bookings/${2}`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Booking deleted successfully.");
    });
    it("should not allow deleting a booking because user is not the owner", async () => {
      const res = await request(app)
        .delete(`/api/bookings/bookings/${3}`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.statusCode).toBe(403);
      expect(res.body.error).toBe(
        "Forbidden: You do not have permission to delete this booking"
      );
    });
  });
});
