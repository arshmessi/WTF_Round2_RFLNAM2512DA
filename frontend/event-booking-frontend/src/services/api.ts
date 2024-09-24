// src/services/api.ts
import axios from "axios";

const API_URL = "http://localhost:5000/api";

// User authentication
export const login = async (email: string, password: string) => {
  return await axios.post(`${API_URL}/auth/login`, { email, password });
};

export const adminLogin = async (email: string, password: string) => {
  return await axios.post(`${API_URL}/auth/login/admin`, { email, password });
};

export const registerNewUser = async (email: string, password: string) => {
  return await axios.post(`${API_URL}/auth/register`, { email, password });
};

export const registerNewAdmin = async (
  data: { email: string; password: string },
  token: string
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

// Events
export const fetchAvailableEvents = async () => {
  return await axios.get(`${API_URL}/events`);
};

export const fetchAllEvents = async (token: string) => {
  return await axios.get(`${API_URL}/events`, {
    headers: { Authorization: `Bearer ${token}` },
  });
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

// Other API functions as needed...
