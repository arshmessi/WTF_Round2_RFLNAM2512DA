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

// Other API functions as needed...
