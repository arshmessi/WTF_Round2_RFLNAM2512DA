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
  background: "linear-gradient(135deg, #001F3F, #0B1622)", // Midnight blue background gradient
});

const GradientContainer = styled(Box)(
  ({ randomColor }: { randomColor: string }) => ({
    background: randomColor, // Random welcome background gradient
    padding: "50px",
    borderRadius: "10px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  })
);

const EventCard = styled(Card)(({ randomColor }: { randomColor: string }) => ({
  margin: "10px",
  transition: "transform 0.2s",
  background: randomColor, // Event card gradient
  color: "#fff", // Ensure text is visible against the gradient
  "&:hover": {
    transform: "scale(1.05)",
  },
  boxShadow: "0 3px 15px rgba(0, 0, 0, 0.2)",
}));

// Function to generate a random gradient for the welcome section
const getRandomWelcomeGradient = () => {
  const colors = [
    ["#FF7F50", "#87CEFA"], // Coral and Sky Blue
    ["#FF69B4", "#00BFFF"], // Hot Pink and Deep Sky Blue
    ["#FF1493", "#87CEEB"], // Deep Pink and Light Sky Blue
    ["#FFB6C1", "#00CED1"], // Light Pink and Dark Turquoise
  ];

  const randomGradient = colors[Math.floor(Math.random() * colors.length)];
  return `linear-gradient(135deg, ${randomGradient[0]}, ${randomGradient[1]})`;
};

const getRandomEventGradient = () => {
  const baseColors = ["#40E0D0", "#87CEEB", "#008080"]; // Turquoise, SkyBlue, Teal
  const variation = Math.random() * 0.2; // 0-20% variability in brightness for one base color
  const turquoiseColor = "#40E0D0"; // Turquoise

  // Function to adjust the base color (lighten or darken)
  const adjustColor = (color: string, percent: number) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent * 255); // Convert percentage to RGB adjustment
    const R = (num >> 16) + amt; // Adjust Red
    const G = ((num >> 8) & 0x00ff) + amt; // Adjust Green
    const B = (num & 0x0000ff) + amt; // Adjust Blue

    return `#${(
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)}`;
  };

  // Generate a slightly different color from turquoise within 5% variation
  const fourthColorVariation = Math.random() * 0.1 - 0.05; // Random variation between -5% and +5%
  const fourthRandomColor = adjustColor(turquoiseColor, fourthColorVariation);

  // Randomize the gradient angle
  const angle = Math.floor(Math.random() * 360); // Random angle between 0-360 degrees

  // Adjust one of the base colors randomly
  const randomColor = adjustColor(
    baseColors[Math.floor(Math.random() * baseColors.length)],
    variation
  );

  // Return the gradient with 3 base colors, a slightly adjusted one, and the adjusted turquoise-based color
  return `linear-gradient(${angle}deg, ${baseColors[0]}, ${baseColors[1]}, ${baseColors[2]}, ${fourthRandomColor})`;
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [welcomeGradient, setWelcomeGradient] = useState<string>(
    getRandomWelcomeGradient()
  );

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
      <GradientContainer randomColor={welcomeGradient}>
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
                  <EventCard randomColor={getRandomEventGradient()}>
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
