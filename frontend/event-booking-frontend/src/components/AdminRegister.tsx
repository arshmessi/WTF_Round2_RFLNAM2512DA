// src/components/AdminRegister.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerNewAdmin, checkAdminAuth } from "../services/api";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";

const AdminRegister: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // Handle error messages
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in
    const verifyUser = async () => {
      const userResponse = await checkAdminAuth();
      if (!userResponse) {
        console.log("User is now allowed to access admin regestration");
        navigate("/");
      } else {
        console.log("Admin verified successfully ");
      }
    };

    verifyUser();
  }, [navigate]); // Include navigate in dependency array

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error before new attempt
    setSuccessMessage(null); // Reset success message

    try {
      const data = { email, password };
      const token = sessionStorage.getItem("token");
      const response = await registerNewAdmin(data, token); // Call your admin registration API
      setSuccessMessage(response.data.message);
      // On success, redirect to login with success message
      setTimeout(() => {
        navigate("/admin-login", {
          state: { message: "Admin registered successfully. Please log in." },
        });
      }, 2000); // Redirect after 2 seconds to show message
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        setError("Admin already exists. Please try logging in.");
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
        Admin Register
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
        Already have an account? <a href="/admin-login">Login here</a>.
      </Typography>
    </Box>
  );
};

export default AdminRegister;
