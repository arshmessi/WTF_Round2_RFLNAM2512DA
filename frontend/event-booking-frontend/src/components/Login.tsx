// src/components/Login.tsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { TextField, Button, Typography, Alert } from "@mui/material";
import { checkAuth } from "../services/api";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { login } = useContext(AuthContext)!;
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in
    const verifyUser = async () => {
      const userResponse = await checkAuth();
      if (userResponse) {
        navigate("/user-dashboard"); // Redirect to user dashboard if logged in
      }
    };

    verifyUser();
  }, [navigate]); // Include navigate in dependency array

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      const newToken = sessionStorage.getItem("token"); // Check sessionStorage directly
      if (newToken) {
        console.log("Token here is ", newToken);
        navigate("/user-dashboard"); // Redirect to user dashboard after login
      } else {
        setErrorMessage("Incorrect Email or password. Please try again.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("Login failed. Please try again later.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        {errorMessage && (
          <Alert severity="error" style={{ marginBottom: "16px" }}>
            {errorMessage}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "16px" }}
          >
            Login
          </Button>
        </form>
        <Button
          onClick={() => navigate("/register")}
          color="secondary"
          fullWidth
          style={{ marginTop: "16px" }}
        >
          Register
        </Button>
      </div>
    </div>
  );
};

export default Login;
