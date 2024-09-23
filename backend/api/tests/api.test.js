import request from "supertest";
import app from "../../app.js";
import sequelize from "../../utils/db.js";
import User from "../../models/User.js";
import Event from "../../models/Event.js";
import Booking from "../../models/Booking.js";
import jwt from "jsonwebtoken";

const adminToken = jwt.sign({ role: "admin" }, process.env.JWT_SECRET);
const userToken = jwt.sign({ role: "user" }, process.env.JWT_SECRET);

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await User.create({
    email: "admin@example.com",
    password: "password123",
    role: "admin",
  });
  await User.create({ email: "testuser@example.com", password: "password123" });
});

describe("Auth API", () => {
  it("should register a user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "newuser@example.com", password: "password123" });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("email");
  });

  it("should login a user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "testuser@example.com", password: "password123" });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });
});

describe("Event API", () => {
  let eventId;

  it("should create an event (admin)", async () => {
    const res = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Test Event",
        date: "2023-12-01T20:00:00Z",
        location: "Test Venue",
        description: "Test Description",
        ticketPrice: 25.0,
      });

    expect(res.statusCode).toEqual(201);
    eventId = res.body.id;
  });

  it("should get all events", async () => {
    const res = await request(app).get("/api/events");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("should delete an event (admin)", async () => {
    const res = await request(app)
      .delete(`/api/events/${eventId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(204);
  });
});

describe("Booking API", () => {
  let bookingId;
  let eventId;

  beforeAll(async () => {
    const event = await Event.create({
      name: "Booking Test Event",
      date: "2023-12-01T20:00:00Z",
      location: "Test Venue",
      description: "Test Description",
      ticketPrice: 25.0,
    });
    eventId = event.id;
  });

  it("should create a booking", async () => {
    const res = await request(app)
      .post("/api/bookings/book")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ eventId, numberOfTickets: 2 });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
  });

  it("should get all bookings", async () => {
    const res = await request(app)
      .get("/api/bookings/mybookings")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});
