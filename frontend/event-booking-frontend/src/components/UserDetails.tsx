// src/components/UserDetails.tsx

import React, { useEffect, useState } from "react";
import { fetchUserDetails } from "../services/api";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Avatar,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

const UserDetails: React.FC = () => {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUserDetails = async () => {
      const token = sessionStorage.getItem("token"); // Retrieve the token from storage
      if (token) {
        try {
          const response = await fetchUserDetails(token);
          setUserDetails(response.data); // Store user details in state
        } catch (error) {
          setError("Failed to fetch user details."); // Handle error
          console.error("Error fetching user details:", error);
        }
      } else {
        setError("No token found. User is not authenticated.");
      }
    };

    getUserDetails();
  }, []);

  // Render user details or error message
  return (
    <Box
      sx={{
        backgroundColor: "#121212", // Dark background
        minHeight: "100vh",
        padding: "20px",
        color: "#d8c48c", // Sepia/yellow text
      }}
    >
      <IconButton
        onClick={() => (window.location.href = "/user-dashboard")}
        sx={{ position: "absolute", top: 20, right: 20, color: "#d8c48c" }} // Icon color
      >
        <ArrowBack />
      </IconButton>
      <Typography variant="h4" align="center" gutterBottom>
        User Details
      </Typography>
      {error && (
        <Typography variant="body1" color="error" align="center">
          {error}
        </Typography>
      )}
      {userDetails ? (
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={8} md={6}>
            <Card sx={{ background: "#1e1e1e", borderRadius: 2 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 2,
                  }}
                >
                  <Avatar
                    sx={{ width: 56, height: 56, marginRight: 2 }}
                    src="https://via.placeholder.com/56" // Placeholder for user's avatar
                    alt="User Avatar"
                  />
                  <Typography variant="h5" sx={{ color: "#f0e68c" }}>
                    {userDetails.details?.firstName || "First Name"}{" "}
                    {userDetails.details?.lastName || "Last Name"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#2a2a2a",
                    padding: 2,
                    borderRadius: 1,
                    marginBottom: 2,
                  }}
                >
                  <Typography variant="body1" sx={{ color: "#d8c48c" }}>
                    <strong>Email:</strong> {userDetails.email || "N/A"}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#d8c48c" }}>
                    <strong>Role:</strong> {userDetails.role || "N/A"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#2a2a2a",
                    padding: 2,
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body1" sx={{ color: "#d8c48c" }}>
                    <strong>First Name:</strong>{" "}
                    {userDetails.details?.firstName || "N/A"}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#d8c48c" }}>
                    <strong>Last Name:</strong>{" "}
                    {userDetails.details?.lastName || "N/A"}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#d8c48c" }}>
                    <strong>Phone No:</strong>{" "}
                    {userDetails.details?.phoneNumber || "N/A"}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#d8c48c" }}>
                    <strong>Bio:</strong> {userDetails.details?.bio || "N/A"}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Typography variant="body1" align="center" sx={{ color: "#d8c48c" }}>
          Loading user details...
        </Typography>
      )}
    </Box>
  );
};

export default UserDetails;
