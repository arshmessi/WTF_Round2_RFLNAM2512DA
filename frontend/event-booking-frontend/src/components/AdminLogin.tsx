// src/components/AdminLogin.tsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { checkAdminAuth } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import {
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useContext(AuthContext)!;
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAdmin = async () => {
      const userResponse = await checkAdminAuth();
      if (userResponse) {
        navigate("/admin-dashboard"); // Redirect to admin dashboard if logged in
      }
    };

    verifyAdmin();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await adminLogin(email, password);
      // const newToken = sessionStorage.getItem("token");
      const adminCheck = await checkAdminAuth();
      if (adminCheck) {
        navigate("/admin-dashboard");
      } else {
        setError("Incorrect Email or password. Please try again.");
      }
    } catch (err) {
      setError("Admin Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh", // Use minHeight to ensure the background covers the entire viewport
        backgroundColor: "#1A1B1B",
        color: "#E0C090",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          style={{ color: "#E0C090" }}
        >
          Admin Login
        </Typography>
        {error && (
          <Alert
            severity="error"
            style={{ marginBottom: "16px", color: "#E0C090" }}
          >
            {error}
          </Alert>
        )}
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            slotProps={{
              input: {
                style: { color: "#E0C090" }, // Input text color
              },
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
            required
            slotProps={{
              input: {
                style: { color: "#E0C090" }, // Input text color
              },
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
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} style={{ color: "#E0C090" }} />
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
