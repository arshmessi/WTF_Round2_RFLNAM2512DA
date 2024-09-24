import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  fetchUserBookings,
  fetchAvailableEvents,
  bookEvent,
  deleteBooking, // Import deleteBooking API
  checkAdminAuth,
} from "../services/api";
import EventBookingForm from "./EventBookingForm";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const UserDashboard: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [bookings, setBookings] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const loadBookings = async () => {
      const verifyAdmin = async () => {
        const userResponse = await checkAdminAuth();
        if (!userResponse) {
          navigate("/admin-login"); // Redirect to admin login if not an admin
        }
      };

      verifyAdmin();
      const token = sessionStorage.getItem("token"); // Get token from sessionStorage
      if (!token) {
        console.log("No user logged in or token missing");
        alert("No user logged in. Redirecting to home page."); // Notify user
        navigate("/"); // Redirect to home page
        return;
      }
      try {
        const bookingsResponse = await fetchUserBookings(token); // Use token from sessionStorage
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
        setEvents(eventsResponse.data || []);
      } catch (error) {
        console.error("Failed to load available events:", error);
      } finally {
        setLoadingEvents(false);
      }
    };

    loadBookings();
    loadEvents();
  }, [navigate, authContext]); // Include navigate and authContext in dependency array

  const handleBooking = async (eventId: string, tickets: number) => {
    const token = sessionStorage.getItem("token"); // Get token from sessionStorage
    if (!token) {
      console.log("No user logged in or token missing");
      return;
    }

    try {
      await bookEvent(eventId, tickets, token); // Use token from sessionStorage
      const bookingsResponse = await fetchUserBookings(token); // Use token from sessionStorage
      setBookings(bookingsResponse.data || []);
    } catch (error) {
      console.error("Failed to book event:", error);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    const token = sessionStorage.getItem("token"); // Get token from sessionStorage
    if (!token) {
      console.log("No user logged in or token missing");
      return;
    }

    try {
      await deleteBooking(bookingId, token); // Call deleteBooking API
      // Refresh bookings after deleting
      const bookingsResponse = await fetchUserBookings(token);
      setBookings(bookingsResponse.data || []);
    } catch (error) {
      console.error("Failed to cancel booking:", error);
    }
  };

  const handleRegisterAdmin = () => {
    navigate("/admin-register"); // Redirect to admin register page
  };
  const handleLogout = () => {
    sessionStorage.removeItem("token"); // Remove the token from sessionStorage
    navigate("/"); // Redirect to the home page
  };
  const EventManagement = () => {
    navigate("/event-management"); // Redirect to the home page
  };

  if (loadingBookings || loadingEvents) return <div>Loading...</div>;

  return (
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
                <strong>Booking ID:</strong> {booking.id} <br />
                <strong>Event:</strong> {booking.Event.name} <br />
                <strong>Date:</strong>{" "}
                {new Date(booking.Event.date).toLocaleDateString()} <br />
                <strong>Location:</strong> {booking.Event.location} <br />
                <strong>Tickets:</strong> {booking.numberOfTickets} <br />
              </p>
              <button
                onClick={() => handleCancelBooking(booking.id)} // Call handleCancelBooking
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
                style={{ margin: "0", fontSize: "1rem", whiteSpace: "normal" }}
              >
                {event.name}
              </h3>
              <p style={{ margin: 0, whiteSpace: "normal" }}>
                <strong>Date:</strong>{" "}
                {new Date(event.date).toLocaleDateString()} <br />
                <strong>Location:</strong> {event.location} <br />
                <strong>Description:</strong>{" "}
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

      {/* Register Admin Button */}
      <button onClick={handleRegisterAdmin} style={{ marginTop: "20px" }}>
        Register New Admin
      </button>
      {/* Logout Button */}
      <button onClick={handleLogout} style={{ marginTop: "20px" }}>
        Logout
      </button>
      <button onClick={EventManagement} style={{ marginTop: "20px" }}>
        Manage Events
      </button>
    </div>
  );
};

export default UserDashboard;
