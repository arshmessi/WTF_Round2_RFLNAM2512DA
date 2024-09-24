import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const UserDashboard: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [bookings, setBookings] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [tickets, setTickets] = useState<number>(1);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const navigate = useNavigate();

  const TruncatedTypography = styled(Typography)({
    display: "-webkit-box", // Display as a box to allow line clamping
    overflow: "hidden", // Hide overflowed content
    WebkitBoxOrient: "vertical", // Vertical box orientation
    WebkitLineClamp: 5, // Limit to 5 lines (adjust as needed)
    textOverflow: "ellipsis", // Add "..." at the end of the truncated text
    wordWrap: "break-word", // Wrap long words to the next line
    whiteSpace: "normal", // Allow the text to wrap within the box
  });
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

  const truncateDescription = (text: string, charLimit: number): string => {
    if (text.length > charLimit) {
      return text.substring(0, charLimit) + "...";
    }
    return text;
  };

  if (loadingBookings || loadingEvents) return <div>Loading...</div>;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Your Bookings</Typography>
        <Button
          onClick={handleLogout}
          style={{
            color: "white",
            backgroundColor: "red",
            borderRadius: "5px",
          }}
        >
          Logout
        </Button>
      </div>

      <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
        {bookings.length > 0 ? (
          bookings.map((booking) => {
            const event = events.find((event) => event.id === booking.eventId); // Assuming eventId is stored in booking
            return (
              <Card
                key={booking.id}
                sx={{
                  display: "inline-block",
                  marginRight: 2,
                  width: "15%",
                  height: "35%",
                  boxShadow: 3,
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  <Typography variant="h6">Booking ID: {booking.id}</Typography>
                  {event && (
                    <>
                      <Typography>Event: {event.name}</Typography>
                      <Typography>
                        Date: {new Date(event.date).toLocaleDateString()}
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
                    onClick={() => handleCancelBooking(booking.id)}
                  >
                    Cancel
                  </Button>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Typography>No bookings found.</Typography>
        )}
      </div>

      <Typography variant="h4">Available Events</Typography>
      <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
        {events.length > 0 ? (
          events.map((event) => (
            <Card
              key={event.id}
              onClick={() => handleEventClick(event)}
              sx={{
                display: "inline-block",
                marginRight: 2,
                maxWidth: "20%",
                height: "40%",
                cursor: "pointer",
                boxShadow: 4,
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant="h6">{event.name}</Typography>
                <Typography>
                  Date: {new Date(event.date).toLocaleDateString()}
                </Typography>
                <Typography>Location: {event.location}</Typography>
                <Typography>Price: ${event.ticketPrice}</Typography>
                <TruncatedTypography>
                  Description: {event.description}
                </TruncatedTypography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography>No events available.</Typography>
        )}
      </div>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: 3,
            padding: 3,
            maxWidth: "40%",
            textAlign: "center",
          }}
        >
          {selectedEvent && (
            <>
              <Typography variant="h6">{selectedEvent.name}</Typography>
              <Typography>
                Date: {new Date(selectedEvent.date).toLocaleDateString()}
              </Typography>
              <Typography>Location: {selectedEvent.location}</Typography>
              <Typography>
                Price per Ticket: ${selectedEvent.ticketPrice}
              </Typography>

              {/* Scrollable description section */}
              <Box
                sx={{
                  maxHeight: "20em", // Approximate height for 10 lines (you can adjust this based on your font size)
                  overflowY: "auto", // Enable vertical scrolling
                  marginBottom: 2,
                }}
              >
                <Typography>{selectedEvent.description}</Typography>
              </Box>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 2,
                }}
              >
                <IconButton
                  onClick={() => setTickets((prev) => Math.max(1, prev - 1))}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography variant="h6">{tickets}</Typography>
                <IconButton onClick={() => setTickets((prev) => prev + 1)}>
                  <AddIcon />
                </IconButton>
              </div>

              {/* Total Price Calculation */}
              <Typography variant="h6">
                Total Price: ${selectedEvent.ticketPrice * tickets}
              </Typography>

              <Button
                variant="contained"
                onClick={handleBooking}
                sx={{ marginRight: 1 }}
              >
                Book
              </Button>
              <Button variant="outlined" onClick={handleCloseModal}>
                Close
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default UserDashboard;
