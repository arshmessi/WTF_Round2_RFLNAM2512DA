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
      expect(res.body.error).toBe("Access denied");
    });
  });

  describe("Event Management", () => {
    beforeAll(async () => {
      const res = await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Concert",
          startDate: new Date().toISOString(), // Ensure the date is in the correct format
          endDate: new Date(new Date().getTime() + 7200 * 1000).toISOString(), // End date 2 hours later
          location: "Stadium",
          description: "Live concert",
          ticketPrice: 100,
          category: "Music",
        });
      eventId = res.body.id;
      // Save the event ID for later tests
    });

    it("should create an event", async () => {
      const res = await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Art Exhibition",
          startDate: new Date().toISOString(), // Updated to use startDate
          endDate: new Date(new Date().getTime() + 7200 * 1000).toISOString(), // End date 2 hours later
          location: "Gallery",
          description: "Art showcase",
          ticketPrice: 50,
          category: "Art", // Added category
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
          startDate: new Date().toISOString(),
          endDate: new Date(
            new Date().setDate(new Date().getDate() + 3)
          ).toISOString(),
          description: "Drama performance",
          ticketPrice: 80,
          category: "Theater",
        });
      expect(res.statusCode).toBe(405);
      expect(res.body.message).toBe("Access denied.");
    });

    it("should modify an event", async () => {
      const res = await request(app)
        .put(`/api/events/${eventId}`)
        .send({
          name: "Updated Event",
          startDate: new Date().toISOString(), // Updated to use startDate
          endDate: new Date(new Date().getTime() + 3600 * 1000).toISOString(), // End date 1 hour later
          location: "New Location",
        })
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Event modified successfully.");
    });
    it("should retrieve all events", async () => {
      const res = await request(app).get("/api/events");
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeDefined();
      expect(res.body.length).toBeGreaterThan(0);
    });
  });
  let bookingID;
  let bookingID2;
  let bookingID3;

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
      bookingID = res.body.id;
    });
    it("should create a booking2", async () => {
      const res = await request(app)
        .post("/api/bookings/book")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          eventId: eventId,
          numberOfTickets: 5,
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.numberOfTickets).toBe(5);
      bookingID2 = res.body.id;
    });
    it("should create a booking3", async () => {
      const res = await request(app)
        .post("/api/bookings/book")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          eventId: eventId,
          numberOfTickets: 10,
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.numberOfTickets).toBe(10);
      bookingID3 = res.body.id;
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
        .delete(`/api/bookings/bookings/${bookingID}`) // Make sure booking ID 1 exists
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200); // Check for status code 200
      expect(res.body.message).toBe("Booking deleted successfully."); // Check for success message
    });

    it("should allow deleting a booking if user is the owner", async () => {
      const res = await request(app)
        .delete(`/api/bookings/bookings/${bookingID2}`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Booking deleted successfully.");
    });

    it("should not allow deleting a booking because user is not the owner", async () => {
      const res = await request(app)
        .delete(`/api/bookings/bookings/${bookingID3}`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.statusCode).toBe(403);
      expect(res.body.error).toBe(
        "Forbidden: You do not have permission to delete this booking"
      );
    });

    it("should delete an event", async () => {
      const res = await request(app)
        .delete(`/api/events/${eventId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(204); // No content
    });
  });

  describe("Event Search API", () => {
    it("should return events filtered by name", async () => {
      const res = await request(app).get("/api/events?name=Art");
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it("should return events filtered by location", async () => {
      const res = await request(app).get("/api/events?location=Galler");
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThan(0); // Adjust according to your test events
    });

    it("should return events filtered by both name and location", async () => {
      const res = await request(app).get("/api/events?name=Art&location=Gall");
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThan(0); // Adjust according to your test events
    });

    it("should return 411 if no events match the criteria", async () => {
      const res = await request(app).get("/api/events?name=nonexistent");
      expect(res.statusCode).toEqual(411);
      expect(res.body.message).toBe("No events found matching the criteria.");
    });
  });
});
