// src/components/Register.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerNewUser } from "../services/api";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const details = {
      firstName,
      lastName,
      phoneNumber,
      bio,
    };

    try {
      const response = await registerNewUser(email, password, details);
      setSuccessMessage(response.data.message);
      setTimeout(() => {
        navigate("/login", {
          state: { message: "User registered successfully. Please log in." },
        });
      }, 2000);
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        setError("User already exists. Please try logging in.");
      } else if (err.response && err.response.status === 500) {
        setError("An error occurred during registration. Please try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleRegister}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "300px",
        margin: "auto",
        mt: 4,
        bgcolor: "#1E1E1E", // Change background color to white or other light color
        color: "#333", // Change text color to dark gray
        padding: 3,
        borderRadius: 2,
        boxShadow: 2, // Add some shadow for depth
      }}
    >
      <Typography variant="h4" textAlign="center" color="#1976d2">
        {" "}
        {/* Change to your primary color */}
        Register
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
      />
      <TextField
        label="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
        fullWidth
      />
      <TextField
        label="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
        fullWidth
      />
      <TextField
        label="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        required
        fullWidth
      />
      <TextField
        label="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        fullWidth
        multiline
        rows={3}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary" // Use the primary color defined in your theme
        fullWidth
        sx={{
          bgcolor: "#1976d2", // Set button color to primary
          "&:hover": {
            bgcolor: "#115293", // Darken on hover
          },
        }}
      >
        Register
      </Button>

      <Typography variant="body2" textAlign="center" mt={2}>
        Already have an account? <a href="/login">Login here</a>.
      </Typography>
    </Box>
  );
};

export default Register;
