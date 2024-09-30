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
  }, [navigate]);

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
        backgroundColor: "#1A1B1B", // Dark background color
        color: "#E0C090", // Pale yellow/sepia text color
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          style={{ color: "#E0C090" }}
        >
          Login
        </Typography>
        {errorMessage && (
          <Alert
            severity="error"
            style={{ marginBottom: "16px", color: "#E0C090" }}
          >
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
            InputProps={{
              style: { color: "#E0C090" }, // Input text color
            }}
            InputLabelProps={{
              style: { color: "#E0C090" }, // Input label color
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#E0C090", // Border color
                },
                "&:hover fieldset": {
                  borderColor: "#E0C090", // Hover border color
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#E0C090", // Focused border color
                },
              },
            }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              style: { color: "#E0C090" }, // Input text color
            }}
            InputLabelProps={{
              style: { color: "#E0C090" }, // Input label color
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#E0C090", // Border color
                },
                "&:hover fieldset": {
                  borderColor: "#E0C090", // Hover border color
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#E0C090", // Focused border color
                },
              },
            }}
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
          style={{ marginTop: "16px", color: "#E0C090" }} // Button text color
        >
          Register
        </Button>
      </div>
    </div>
  );
};

export default Login;
