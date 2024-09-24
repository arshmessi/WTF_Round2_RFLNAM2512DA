import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { TextField, Button, Typography } from "@mui/material";

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { register } = useContext(AuthContext)!; // Make sure to have register method in AuthContext
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error state
    try {
      await register(username, password);
      navigate("/user-dashboard"); // Redirect to user dashboard after registration
    } catch (error) {
      setError("Registration failed. Please try again.");
      console.error("Registration failed:", error);
    }
  };

  return (
    <div>
      <Typography variant="h4">Register</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Register
        </Button>
      </form>
      <Button onClick={() => navigate("/")}>Back to Login</Button>
    </div>
  );
};

export default RegisterPage;
