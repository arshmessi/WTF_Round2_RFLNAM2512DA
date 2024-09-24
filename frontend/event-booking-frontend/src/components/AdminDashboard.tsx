import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  fetchAvailableEvents,
  fetchUserBookings,
  registerNewAdmin,
  bookEvent,
} from "../services/api";
import EventBookingForm from "./EventBookingForm";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AdminDashboard: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [events, setEvents] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [newAdminUsername, setNewAdminUsername] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const loadBookings = async () => {
      if (!authContext?.token) {
        console.log("No admin logged in or token missing");
        alert("No admin logged in. Redirecting to login page."); // Notify user
        navigate("/admin/login"); // Redirect to admin login page
        return;
      }
      try {
        const bookingsResponse = await fetchUserBookings(authContext.token);
        setBookings(bookingsResponse.data || []);
      } catch (error) {
        console.error("Failed to load user bookings:", error);
      } finally {
        setLoadingBookings(false);
      }
    };

    const loadEvents = async () => {
      try {
        const eventsResponse = await fetchAvailableEvents();
        setEvents(eventsResponse.data);
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoadingEvents(false);
      }
    };

    loadEvents();
    loadBookings();
  }, [authContext, navigate]); // Include navigate in dependency array

  const handleRegisterAdmin = async () => {
    if (!authContext?.token) return;
    try {
      await registerNewAdmin(
        { email: newAdminUsername, password: "defaultPassword" },
        authContext.token
      );
      setNewAdminUsername("");
    } catch (error) {
      console.error("Failed to register admin", error);
    }
  };

  const handleBooking = async (eventId: string, tickets: number) => {
    if (!authContext?.token) {
      console.log("No admin logged in or token missing");
      return;
    }

    try {
      await bookEvent(eventId, tickets, authContext.token);
      await fetchUserBookings(authContext.token).then((response) =>
        setBookings(response.data || [])
      );
    } catch (error) {
      console.error("Failed to book event:", error);
    }
  };

  if (loadingBookings || loadingEvents) return <div>Loading...</div>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div>
        <h2>Your Bookings</h2>
        <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div
                key={booking.id}
                style={{
                  display: "inline-block",
                  marginRight: "16px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "8px",
                  width: "200px",
                  boxSizing: "border-box",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  height: "auto",
                }}
              >
                <p style={{ margin: 0 }}>
                  <strong>Event:</strong> {booking.Event.name} <br />
                  <strong>Date:</strong>{" "}
                  {new Date(booking.Event.date).toLocaleDateString()} <br />
                  <strong>Location:</strong> {booking.Event.location} <br />
                  <strong>Tickets:</strong> {booking.numberOfTickets} <br />
                </p>
                <button
                  onClick={() => {
                    /* Cancel booking logic */
                  }}
                >
                  Cancel
                </button>
              </div>
            ))
          ) : (
            <p>No bookings found.</p>
          )}
        </div>

        <h2>Available Events</h2>
        <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
          {events.length > 0 ? (
            events.map((event) => (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event.id)}
                style={{
                  display: "inline-block",
                  marginRight: "16px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "8px",
                  width: "200px",
                  boxSizing: "border-box",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  height: "auto",
                }}
              >
                <h3
                  style={{
                    margin: "0",
                    fontSize: "1rem",
                    whiteSpace: "normal",
                  }}
                >
                  {event.name}
                </h3>
                <p style={{ margin: 0, whiteSpace: "normal" }}>
                  <strong>Date:</strong>{" "}
                  {new Date(event.date).toLocaleDateString()} <br />
                  <strong>Location:</strong> {event.location} <br />
                  <strong>Description:</strong>
                  <span style={{ display: "block", whiteSpace: "normal" }}>
                    {event.description}
                  </span>
                  <strong>Ticket Price:</strong> ${event.ticketPrice}
                </p>
              </div>
            ))
          ) : (
            <p>No events available.</p>
          )}
        </div>

        {selectedEvent && (
          <EventBookingForm
            eventId={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onBook={handleBooking}
          />
        )}
      </div>

      <h2>Register New Admin</h2>
      <input
        type="text"
        value={newAdminUsername}
        onChange={(e) => setNewAdminUsername(e.target.value)}
        placeholder="Enter new admin username"
      />
      <button onClick={handleRegisterAdmin}>Register Admin</button>
    </div>
  );
};

export default AdminDashboard;
