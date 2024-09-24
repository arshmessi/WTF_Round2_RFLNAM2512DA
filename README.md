# Event Booking Application

## Table of Contents

1. [Backend Setup](#backend-setup)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Running the Backend](#running-the-backend)
   - [Environment Variables](#environment-variables)
   - [Testing the Backend](#testing-the-backend)
   - [API Testing](#api-testing)
   - [Unit Tests](#unit-tests)
2. [Frontend Setup](#frontend-setup)

---

## Backend Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.x or higher)
- **npm** or **yarn**
- **SQLite** (bundled with Node.js)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/event-booking-app.git
   cd event-booking-app/backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

### Running the Backend

1. Make sure your environment variables are set up (see the section below).
2. Run the development server:

   ```bash
   npm run dev
   ```

   The backend server should be running on `http://localhost:5000`.

### Environment Variables

Create a `.env` file in the `backend` directory and add the following:

```
PORT=5000
JWT_SECRET=your_jwt_secret
DATABASE_URL=sqlite::memory:  # Or a persistent file like sqlite://database.sqlite
```

---

### Testing the Backend

There are two types of testing you can perform for the backend:

- **API Testing** (using `curl` or Postman to test endpoints)
- **Unit Testing** (using Jest and Supertest)

---

### API Testing

You can use the following **curl** commands to test the API functionality. Each section demonstrates how to make HTTP requests to specific endpoints.

#### 1. **Register User**

```bash
curl -X POST http://localhost:5000/api/auth/register \
-H "Content-Type: application/json" \
-d '{"email": "testuser@example.com", "password": "password123"}'
```

#### 2. **Login User**

```bash
curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email": "testuser@example.com", "password": "password123"}'
```

#### 3. **Admin Registration**

```bash
curl -X POST http://localhost:5000/api/auth/register/admin \
-H "Authorization: Bearer YOUR_JWT_TOKEN" \
-H "Content-Type: application/json" \
-d '{"email": "adminuser@example.com", "password": "adminpass123"}'
```

#### 4. **Admin Login**

```bash
curl -X POST http://localhost:5000/api/auth/login/admin \
-H "Content-Type: application/json" \
-d '{"email": "adminuser@example.com", "password": "adminpass123"}'
```

#### 5. **Get All Events**

```bash
curl -X GET http://localhost:5000/api/events \
-H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 6. **Create an Event** (Admin only)

```bash
curl -X POST http://localhost:5000/api/events \
-H "Authorization: Bearer YOUR_JWT_TOKEN" \
-H "Content-Type: application/json" \
-d '{"name": "Concert", "date": "2024-10-01", "location": "Stadium", "description": "A grand music concert", "ticketPrice": 50.00}'
```

#### 7. **Delete an Event** (Admin only)

```bash
curl -X DELETE http://localhost:5000/api/events/{eventId} \
-H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 8. **Book Event**

```bash
curl -X POST http://localhost:5000/api/bookings/book \
-H "Authorization: Bearer YOUR_JWT_TOKEN" \
-H "Content-Type: application/json" \
-d '{"eventId": 1, "numberOfTickets": 2}'
```

#### 9. **View Bookings**

```bash
curl -X GET http://localhost:5000/api/bookings/mybookings \
-H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 10. **Delete Booking**

```bash
curl -X DELETE http://localhost:5000/api/bookings/bookings/{bookingId} \
-H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Unit Tests

Unit tests verify the core functionality of each API endpoint using **Jest** and **Supertest**. You can run the unit tests to make sure your routes and services behave as expected.

#### 1. Install Testing Dependencies

Make sure you have installed **Jest** and **Supertest**:

```bash
npm install --save-dev jest supertest
```

#### 2. Writing Unit Tests

Below is an example of unit tests for authentication and booking API routes:

- **Authentication Test Example** (`/tests/auth.test.js`):

```js
import request from "supertest";
import app from "../app.js"; // Assuming your app.js contains the express app

describe("Auth API", () => {
  it("should register a user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "testuser@example.com", password: "password123" });

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
```

- **Booking Test Example** (`/tests/booking.test.js`):

```js
import request from "supertest";
import app from "../app.js";

describe("Booking API", () => {
  let token;

  // Before running tests, login as a user
  beforeAll(async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "testuser@example.com", password: "password123" });

    token = res.body.token; // Capture token for authenticated requests
  });

  it("should book an event", async () => {
    const res = await request(app)
      .post("/api/bookings/book")
      .set("Authorization", `Bearer ${token}`)
      .send({ eventId: 1, numberOfTickets: 2 });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("bookingId");
  });

  it("should get user bookings", async () => {
    const res = await request(app)
      .get("/api/bookings/mybookings")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});
```

#### 3. Running Unit Tests

To run your unit tests, simply use:

```bash
npm run test
```

Jest will automatically pick up and execute all tests in the `/tests/` directory.

---

## Frontend Setup

---
