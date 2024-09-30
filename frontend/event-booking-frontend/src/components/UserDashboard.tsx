import React, { useEffect, useState } from "react";
// import { AuthContext } from "../context/AuthContext";
import eventImages from "../utils/images";
// import { EventCategory } from "../utils/eventType";
import {
  fetchUserBookings,
  fetchAvailableEvents,
  bookEvent,
  deleteBooking,
} from "../services/api";
import { styled } from "@mui/system";
import {
  Card,
  CardContent,
  Button,
  Typography,
  Modal,
  Box,
  IconButton,
  Grid,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface Event {
  id: string;
  name: string;
  location: string;
  startDate: string; // Updated to use startDate
  endDate: string; // Updated to use endDate
  ticketPrice: number;
  category: keyof typeof eventImages; // Match the event category with your images
  description?: string; // Add description if it's included in your event data
}

const TruncatedTypography = styled(Typography)({
  display: "-webkit-box",
  overflow: "hidden",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 5,
  textOverflow: "ellipsis",
  wordWrap: "break-word",
  whiteSpace: "normal",
});

const UserDashboard: React.FC = () => {
  // const authContext = useContext(AuthContext);
  const [bookings, setBookings] = useState<any[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [tickets, setTickets] = useState<number>(1);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBookings = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
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
  }, [navigate]);

  const handleBooking = async () => {
    const token = sessionStorage.getItem("token");
    if (!token || !selectedEvent) {
      return;
    }

    try {
      await bookEvent(selectedEvent.id, tickets, token);
      const bookingsResponse = await fetchUserBookings(token);
      setBookings(bookingsResponse.data || []);
    } catch (error) {
      console.error("Failed to book event:", error);
    } finally {
      setOpenModal(false);
      setTickets(1);
      setSelectedEvent(null);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
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

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setOpenModal(true);
    setTickets(1);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEvent(null);
    setTickets(1);
  };

  const calculateDuration = (startDate: string, endDate: string): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(duration / (1000 * 3600 * 24));
    return `${days} day${days !== 1 ? "s" : ""}`;
  };

  const handleUserProfileClick = () => {
    navigate("/user-details");
  };

  if (loadingBookings || loadingEvents) return <div>Loading...</div>;

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Paper
        elevation={3}
        sx={{
          padding: 2,
          borderRadius: 2,
          marginBottom: 4,
          position: "relative",
        }}
      >
        <Button
          onClick={handleUserProfileClick}
          variant="contained"
          color="primary"
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
          }}
        >
          User Profile
        </Button>
        <Typography variant="h4" gutterBottom>
          Your Bookings
        </Typography>
        <Button
          onClick={handleLogout}
          variant="contained"
          color="error"
          sx={{ marginLeft: "auto", display: "block" }}
        >
          Logout
        </Button>
      </Paper>

      <Grid container spacing={2}>
        {bookings.length > 0 ? (
          bookings.map((booking) => {
            const event = events.find((event) => event.id === booking.eventId);
            return (
              <Grid item xs={12} sm={6} md={4} key={booking.id}>
                <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                  <CardContent>
                    {event && (
                      <img
                        src={eventImages[event.category] || eventImages.other} // Default image if category not found
                        alt={event.name}
                        style={{
                          height: "140px",
                          width: "100%",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }} // Adjust styling as needed
                      />
                    )}
                    <Typography variant="h6">
                      Booking ID: {booking.id}
                    </Typography>
                    {event && (
                      <>
                        <Typography>Event: {event.name}</Typography>
                        <Typography>
                          Start Date:{" "}
                          {new Date(event.startDate).toLocaleDateString()}
                        </Typography>
                        <Typography>
                          End Date:{" "}
                          {new Date(event.endDate).toLocaleDateString()}
                        </Typography>
                        <Typography>
                          Duration:{" "}
                          {calculateDuration(event.startDate, event.endDate)}
                        </Typography>
                        <Typography>Location: {event.location}</Typography>
                        <Typography>
                          Tickets: {booking.numberOfTickets}
                        </Typography>
                        <TruncatedTypography>
                          Event Description: {event.description}
                        </TruncatedTypography>
                      </>
                    )}
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleCancelBooking(booking.id)}
                      sx={{ marginTop: 2 }}
                    >
                      Cancel Booking
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        ) : (
          <Typography>No bookings found.</Typography>
        )}
      </Grid>

      <Paper elevation={3} sx={{ padding: 2, borderRadius: 2, marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>
          Available Events
        </Typography>
        <Grid container spacing={2}>
          {events.length > 0 ? (
            events.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <Card
                  onClick={() => handleEventClick(event)}
                  sx={{
                    boxShadow: 4,
                    borderRadius: 2,
                    cursor: "pointer",
                    transition: "transform 0.3s, background-color 0.3s",
                    backgroundColor:
                      selectedEvent?.id === event.id ? "#2C2C2C" : "inherit", // Lighter shade for selected
                    "&:hover": {
                      transform: "scale(1.03)",
                      backgroundColor: "#383838", // Lighter shade for hover
                    },
                  }}
                >
                  <CardContent>
                    {event && (
                      <img
                        src={eventImages[event.category] || eventImages.other}
                        alt={event.name}
                        style={{
                          width: "100%",
                          height: "300px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          marginBottom: 8,
                        }}
                      />
                    )}
                    <Typography variant="h6">{event.name}</Typography>
                    <Typography>Location: {event.location}</Typography>
                    <Typography>
                      Start Date:{" "}
                      {new Date(event.startDate).toLocaleDateString()}
                    </Typography>
                    <Typography>
                      End Date: {new Date(event.endDate).toLocaleDateString()}
                    </Typography>
                    <Typography>Price: ${event.ticketPrice}</Typography>
                    <TruncatedTypography>
                      Description: {event.description}
                    </TruncatedTypography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography>No events available.</Typography>
          )}
        </Grid>
      </Paper>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            color: "white",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">
            Book Tickets for {selectedEvent?.name}
          </Typography>
          <Typography>
            Price per Ticket: ${selectedEvent?.ticketPrice}
          </Typography>
          <Box display="flex" alignItems="center" marginTop={2}>
            <IconButton onClick={() => setTickets(Math.max(1, tickets - 1))}>
              <RemoveIcon />
            </IconButton>
            <Typography sx={{ marginX: 2 }}>{tickets}</Typography>
            <IconButton onClick={() => setTickets(tickets + 1)}>
              <AddIcon />
            </IconButton>
          </Box>
          <Button
            variant="contained"
            onClick={handleBooking}
            sx={{ marginTop: 2 }}
          >
            Confirm Booking
          </Button>
          <Button onClick={handleCloseModal} sx={{ marginTop: 1 }}>
            Cancel
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default UserDashboard;
