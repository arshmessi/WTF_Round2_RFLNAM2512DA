import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  fetchUserBookings,
  fetchAvailableEvents,
  bookEvent,
  deleteBooking,
  checkAdminAuth,
} from "../services/api";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Modal,
} from "@mui/material";

const UserDashboard: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [bookings, setBookings] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [tickets, setTickets] = useState<number>(1); // Manage ticket quantity

  const navigate = useNavigate();

  useEffect(() => {
    const loadBookings = async () => {
      const verifyAdmin = async () => {
        const userResponse = await checkAdminAuth();
        if (!userResponse) {
          navigate("/admin-login");
        }
      };

      verifyAdmin();
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.log("No user logged in or token missing");
        alert("No user logged in. Redirecting to home page.");
        navigate("/");
        return;
      }
      try {
        const bookingsResponse = await fetchUserBookings(token);
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
  }, [navigate, authContext]);

  const handleBooking = async (eventId: string, tickets: number) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.log("No user logged in or token missing");
      return;
    }

    try {
      await bookEvent(eventId, tickets, token);
      const bookingsResponse = await fetchUserBookings(token);
      setBookings(bookingsResponse.data || []);
      setSelectedEvent(null); // Close modal after booking
    } catch (error) {
      console.error("Failed to book event:", error);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.log("No user logged in or token missing");
      return;
    }

    try {
      await deleteBooking(bookingId, token);
      const bookingsResponse = await fetchUserBookings(token);
      setBookings(bookingsResponse.data || []);
    } catch (error) {
      console.error("Failed to cancel booking:", error);
    }
  };

  const handleRegisterAdmin = () => {
    navigate("/admin-register");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  const handleEventManagement = () => {
    navigate("/event-management");
  };

  const handleTicketChange = (change: number) => {
    setTickets((prev) => Math.max(1, prev + change)); // Ensure at least 1 ticket
  };

  if (loadingBookings || loadingEvents) return <div>Loading...</div>;

  return (
    <Container>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ marginBottom: 2 }}
      >
        <Box>
          <Button
            variant="contained"
            onClick={handleRegisterAdmin}
            sx={{ marginRight: 1 }}
          >
            Register New Admin
          </Button>
          <Button variant="contained" onClick={handleEventManagement}>
            Manage Events
          </Button>
        </Box>
        <Button variant="outlined" onClick={handleLogout}>
          Logout
        </Button>
      </Grid>

      <Typography variant="h4" gutterBottom>
        Your Bookings
      </Typography>
      <div style={{ overflowX: "auto", whiteSpace: "nowrap", marginBottom: 4 }}>
        <Box display="flex">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <Box
                key={booking.id}
                sx={{ display: "inline-block", minWidth: 200, marginRight: 2 }}
              >
                <Card sx={{ minWidth: 200 }}>
                  <CardContent>
                    <Typography variant="h6">
                      Booking ID: {booking.id}
                    </Typography>
                    <Typography variant="body1">
                      Event: {booking.Event.name}
                    </Typography>
                    <Typography variant="body2">
                      Date: {new Date(booking.Event.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">
                      Location: {booking.Event.location}
                    </Typography>
                    <Typography variant="body2">
                      Tickets: {booking.numberOfTickets}
                    </Typography>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Cancel
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            ))
          ) : (
            <Typography variant="body1">No bookings found.</Typography>
          )}
        </Box>
      </div>

      <Typography variant="h4" gutterBottom>
        Available Events
      </Typography>
      <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
        <Box display="flex">
          {events.length > 0 ? (
            events.map((event) => (
              <Box
                key={event.id}
                sx={{ display: "inline-block", minWidth: 200, marginRight: 2 }}
              >
                <Card
                  onClick={() => {
                    setSelectedEvent(event);
                    setTickets(1);
                  }}
                  sx={{ minWidth: 200, cursor: "pointer" }}
                >
                  <CardContent>
                    <Typography variant="h6">{event.name}</Typography>
                    <Typography variant="body2">
                      Date: {new Date(event.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">
                      Location: {event.location}
                    </Typography>
                    <Typography variant="body2">
                      Description: {event.description}
                    </Typography>
                    <Typography variant="body2">
                      Ticket Price: ${event.ticketPrice}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))
          ) : (
            <Typography variant="body1">No events available.</Typography>
          )}
        </Box>
      </div>

      {/* Modal for Booking Event */}
      <Modal
        open={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "1px solid #ccc",
            borderRadius: "16px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            p: 4,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6">{selectedEvent?.name}</Typography>
          <Typography variant="body2">
            Date: {new Date(selectedEvent?.date).toLocaleDateString()}
          </Typography>
          <Typography variant="body2">
            Location: {selectedEvent?.location}
          </Typography>
          <Typography variant="body2">
            Description: {selectedEvent?.description}
          </Typography>
          <Typography variant="body2">
            Ticket Price: ${selectedEvent?.ticketPrice}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
            <Button onClick={() => handleTicketChange(-1)}>-</Button>
            <Typography sx={{ margin: "0 8px" }}>{tickets}</Typography>
            <Button onClick={() => handleTicketChange(1)}>+</Button>
          </Box>

          <Box sx={{ marginTop: 2 }}>
            <Button
              variant="contained"
              onClick={() => handleBooking(selectedEvent.id, tickets)}
              sx={{ marginRight: 1 }}
            >
              Book
            </Button>
            <Button variant="outlined" onClick={() => setSelectedEvent(null)}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default UserDashboard;
