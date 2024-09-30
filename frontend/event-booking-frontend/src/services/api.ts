import axios from "axios";

const API_URL =
  "https://murmuring-headland-34820-123c1fb063f5.herokuapp.com/api";

// User authentication
export const login = async (email: string, password: string) => {
  return await axios.post(`${API_URL}/auth/login`, { email, password });
};

export const adminLogin = async (email: string, password: string) => {
  return await axios.post(`${API_URL}/auth/login/admin`, { email, password });
};

// src/services/api.ts

export const registerNewUser = async (
  email: string,
  password: string,
  details: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    bio?: string;
  } // Include details
) => {
  return await axios.post(`${API_URL}/auth/register`, {
    email,
    password,
    details,
  });
};

export const registerNewAdmin = async (
  data: { email: string; password: string },
  token: string | null
) => {
  return await axios.post(`${API_URL}/auth/register/admin`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Bookings
export const fetchUserBookings = async (token: string) => {
  return await axios.get(`${API_URL}/bookings/mybookings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const bookEvent = async (
  eventId: string,
  numberOfTickets: number,
  token: string
) => {
  return await axios.post(
    `${API_URL}/bookings/book`,
    { eventId, numberOfTickets },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// Fetch user details (requires token)
export const fetchUserDetails = async (token: string) => {
  return await axios.get(`${API_URL}/auth/user/details`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Events

// Fetch available events (no token needed)
export const fetchAvailableEvents = async () => {
  return await axios.get(`${API_URL}/events`);
};

// Fetch all events for admin (requires token)
export const fetchAllEvents = async (token: string) => {
  return await axios.get(`${API_URL}/events`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Create an event (requires admin token)
export const createEvent = async (
  eventData: {
    name: string;
    startDate: string;
    endDate: string;
    description: string;
    ticketPrice: number;
    category: string;
  },
  token: string
) => {
  return await axios.post(`${API_URL}/events`, eventData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Modify an event (requires admin token)
export const modifyEvent = async (
  eventId: number,
  eventData: {
    name?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
    description?: string;
    ticketPrice?: number;
    category?: string;
  },
  token: string
) => {
  return await axios.put(`${API_URL}/events/${eventId}`, eventData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Delete an event (requires admin token)
export const deleteEvent = async (eventId: number, token: string) => {
  return await axios.delete(`${API_URL}/events/${eventId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Search events by name and/or location (no token needed)
export const searchEvents = async (query: {
  name?: string;
  location?: string;
}) => {
  const { name, location } = query;
  const searchParams = new URLSearchParams();
  if (name) searchParams.append("name", name);
  if (location) searchParams.append("location", location);
  return await axios.get(`${API_URL}/events?${searchParams.toString()}`);
};

// Function to check if the user is logged in
export const checkAuth = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/check-auth`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`, // Use the stored token
      },
    });

    if (!response.ok) {
      throw new Error("Not authenticated");
    }

    return await response.json(); // Return the user data
  } catch (error) {
    console.error("Error checking authentication:", error);
    return null; // Handle errors as necessary
  }
};

// Function to check if the admin is logged in
export const checkAdminAuth = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/check-admin`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`, // Use the stored token
      },
    });

    if (!response.ok) {
      throw new Error("Not an admin or not authenticated");
    }

    return await response.json(); // Return the admin data
  } catch (error) {
    console.error("Error checking admin authentication:", error);
    return null; // Handle errors as necessary
  }
};

// Delete a booking
export const deleteBooking = async (bookingId: number, token: string) => {
  try {
    const response = await axios.delete(
      `${API_URL}/bookings/bookings/${bookingId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to delete booking:", error);
    throw error;
  }
};
