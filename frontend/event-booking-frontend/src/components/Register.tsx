// src/components/Register.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerNewUser } from "../services/api";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // Handle error messages
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error before new attempt
    setSuccessMessage(null); // Reset success message

    try {
      const response = await registerNewUser(email, password);
      setSuccessMessage(response.data.message);
      // On success, redirect to login with success message
      setTimeout(() => {
        navigate("/login", {
          state: { message: "User registered successfully. Please log in." },
        });
      }, 2000); // Redirect after 2 seconds to show message
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
      }}
    >
      <Typography variant="h4" textAlign="center">
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

      <Button type="submit" variant="contained" color="primary" fullWidth>
        Register
      </Button>

      <Typography variant="body2" textAlign="center" mt={2}>
        Already have an account? <a href="/login">Login here</a>.
      </Typography>
    </Box>
  );
};

export default Register;
