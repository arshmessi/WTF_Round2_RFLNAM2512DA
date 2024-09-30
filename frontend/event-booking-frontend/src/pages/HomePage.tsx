import React, { useState, useEffect } from "react";
import { fetchAvailableEvents, searchEvents } from "../services/api";
import eventImages from "../utils/images";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface Event {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  ticketPrice: number;
  description: string;
  category: keyof typeof eventImages;
}

const StyledCard = styled(Card)(() => ({
  transition: "transform 0.3s, box-shadow 0.3s",
  position: "relative",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
  },
}));

const CardFront = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
});

const CardBack = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#1E1E1E", // Background for the back of the card
  color: "#F5F5DC", // Text color for the back of the card
  height: "100%",
});

const calculateDuration = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const durationInHours =
    Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60);

  return convertDuration(durationInHours);
};

const convertDuration = (hours: number) => {
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  let durationString = "";

  if (days > 0) {
    durationString += `${days} day${days > 1 ? "s" : ""} `;
  }

  if (remainingHours > 0) {
    durationString += `${remainingHours} hour${remainingHours > 1 ? "s" : ""}`;
  }

  return durationString.trim() || "0 hours";
};

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<{
    name?: string;
    location?: string;
  }>({});
  const [events, setEvents] = useState<Event[]>([]);
  const [noResultsFound, setNoResultsFound] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null); // Track flipped card ID
  const navigate = useNavigate();

  const loadEvents = async () => {
    try {
      const response = await fetchAvailableEvents();
      setEvents(response.data || []);
      setNoResultsFound(false);
    } catch (error) {
      console.error(error);
      setSnackbarOpen(true);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await searchEvents(searchQuery);
      if (response.data.length === 0) {
        setNoResultsFound(true);
      } else {
        setEvents(response.data);
        setNoResultsFound(false);
      }
    } catch (error) {
      console.error(error);
      setSnackbarOpen(true);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery({});
    loadEvents();
    setNoResultsFound(false);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleAdminLogin = () => {
    navigate("/admin-login");
  };

  const toggleCardFlip = (eventId: string) => {
    setFlippedCardId((prev) => (prev === eventId ? null : eventId)); // Toggle the flipped card
  };

  useEffect(() => {
    loadEvents();
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.backgroundColor = "#1E1E1E";
  }, []);

  return (
    <div
      style={{
        height: "100%",
        padding: "20px",
        backgroundColor: "#1A1B1B",
        color: "#F5F5DC",
        position: "relative",
      }}
    >
      {/* Top-right corner buttons */}
      <div style={{ position: "absolute", top: "20px", right: "20px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          style={{ marginRight: "10px" }}
        >
          Login
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAdminLogin}
        >
          Admin Login
        </Button>
      </div>

      <Typography variant="h3" gutterBottom>
        Event Listings
      </Typography>

      <div style={{ marginBottom: "20px" }}>
        <TextField
          label="Search by Name"
          variant="outlined"
          value={searchQuery.name || ""}
          onChange={(e) =>
            setSearchQuery({ ...searchQuery, name: e.target.value })
          }
          style={{ marginRight: "10px" }}
        />
        <TextField
          label="Search by Location"
          variant="outlined"
          value={searchQuery.location || ""}
          onChange={(e) =>
            setSearchQuery({ ...searchQuery, location: e.target.value })
          }
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          style={{ marginLeft: "10px" }}
        >
          Search
        </Button>
        <Button
          variant="outlined"
          onClick={handleClearSearch}
          style={{ marginLeft: "10px" }}
        >
          Clear Search
        </Button>
      </div>

      {noResultsFound && (
        <Typography variant="h6" color="error">
          No results found.
        </Typography>
      )}

      <Grid container spacing={2}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={event.id}>
            <StyledCard onClick={() => toggleCardFlip(event.id)}>
              {flippedCardId === event.id ? (
                <CardBack
                  sx={{
                    maxHeight: "30vh", // Set max height to 60%
                    overflowY: "auto", // Enable vertical scrolling
                    marginTop: 2,
                    marginBottom: 2,
                  }}
                >
                  <Typography variant="h6">Event Description</Typography>

                  <Typography>{event.description}</Typography>
                </CardBack>
              ) : (
                <CardFront>
                  <img
                    src={eventImages[event.category] || eventImages.other}
                    alt={event.name}
                    style={{
                      height: "140px",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <Typography variant="h5">{event.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    <LocationOnIcon style={{ marginRight: "5px" }} />
                    {event.location}
                  </Typography>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <AccessTimeIcon style={{ marginRight: "5px" }} />
                    <Typography variant="body2">
                      Start Date:{" "}
                      {new Date(event.startDate).toLocaleDateString()}
                    </Typography>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body2">
                      Duration:{" "}
                      {calculateDuration(event.startDate, event.endDate)}
                    </Typography>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <MonetizationOnIcon style={{ marginRight: "5px" }} />
                    <Typography variant="body2">
                      ${event.ticketPrice.toFixed(2)}
                    </Typography>
                  </div>
                </CardFront>
              )}
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message="An error occurred while fetching data."
        autoHideDuration={3000}
      />
    </div>
  );
};

export default HomePage;
