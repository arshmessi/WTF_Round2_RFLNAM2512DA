// src/pages/HomePage.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Container,
  Box,
  styled,
} from "@mui/material";
import { fetchAvailableEvents } from "../services/api"; // Import the fetch function

// Styled components
const PageContainer = styled(Box)({
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  background:
    "linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(50, 50, 50, 0.7))", // Darker gradient for the whole page
});

const GradientContainer = styled(Box)({
  background:
    "linear-gradient(135deg, rgba(255, 100, 150, 0.8), rgba(100, 200, 255, 0.8))",
  padding: "50px",
  borderRadius: "10px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
});

const EventCard = styled(Card)({
  margin: "10px",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "scale(1.05)",
  },
  boxShadow: "0 3px 15px rgba(0, 0, 0, 0.2)",
});

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetchAvailableEvents(); // Call the imported function
        setEvents(response.data); // Update state with the fetched events
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <PageContainer>
      <GradientContainer>
        <Typography
          variant="h3"
          style={{ marginBottom: "20px", color: "#fff" }}
        >
          Welcome to the Event Booking Application
        </Typography>
        <div style={{ marginBottom: "30px" }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/login")}
            style={{ marginRight: "10px" }}
          >
            User Login
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/admin-login")}
          >
            Admin Login
          </Button>
        </div>
        <Typography
          variant="h5"
          style={{ color: "#fff", marginBottom: "20px" }}
        >
          Upcoming Events
        </Typography>
        {loading ? (
          <Typography variant="h6" style={{ color: "#fff" }}>
            Loading events...
          </Typography>
        ) : (
          <Container>
            <Grid container spacing={2} justifyContent="center">
              {events.map((event) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={event.id}>
                  <EventCard>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {event.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Date: {new Date(event.date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Location: {event.location}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Price: ${event.ticketPrice}
                      </Typography>
                    </CardContent>
                  </EventCard>
                </Grid>
              ))}
            </Grid>
          </Container>
        )}
      </GradientContainer>
    </PageContainer>
  );
};

export default HomePage;
