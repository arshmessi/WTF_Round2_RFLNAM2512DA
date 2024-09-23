# Event Booking Application

## Table of Contents

1. [Backend Setup](#backend-setup)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Running the Backend](#running-the-backend)
   - [Environment Variables](#environment-variables)
   - [Testing the Backend](#testing-the-backend)
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

### Testing the Backend

You can use the following **curl** commands to test the API functionality:

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

#### 3. **Get All Events**

```bash
curl -X GET http://localhost:5000/api/events \
-H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 4. **Create an Event** (Admin only)

```bash
curl -X POST http://localhost:5000/api/events \
-H "Authorization: Bearer YOUR_JWT_TOKEN" \
-H "Content-Type: application/json" \
-d '{"name": "Concert", "date": "2024-10-01", "location": "Stadium", "description": "A grand music concert", "ticketPrice": 50.00}'
```

#### 5. **Book Event**

```bash
curl -X POST http://localhost:5000/api/bookings \
-H "Authorization: Bearer YOUR_JWT_TOKEN" \
-H "Content-Type: application/json" \
-d '{"eventId": 1, "numberOfTickets": 2}'
```

#### 6. **View Bookings**

```bash
curl -X GET http://localhost:5000/api/bookings \
-H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Unit Tests

You can write unit tests using **Jest** or **Mocha** (I’ll use **Jest** for this example). Install the necessary testing libraries:

```bash
npm install --save-dev jest supertest
```

#### Example Unit Test for User Authentication (`/tests/auth.test.js`):

```js
import request from "supertest";
import app from "../app.js";

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

#### Running Tests

To run the unit tests, use:

```bash
npm run test
```

---

## Frontend Setup

---
