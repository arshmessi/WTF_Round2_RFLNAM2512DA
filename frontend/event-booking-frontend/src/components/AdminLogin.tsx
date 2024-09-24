// src/components/AdminLogin.tsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { checkAdminAuth } from "../services/api";
import { AuthContext } from "../context/AuthContext"; // Import the custom useAuth hook
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
  const [loading, setLoading] = useState(false); // New loading state
  const { adminLogin } = useContext(AuthContext)!;
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in
    const verifyAdmin = async () => {
      const userResponse = await checkAdminAuth();
      if (userResponse) {
        navigate("/admin-dashboard"); // Redirect to admin dashboard if logged in
      }
    };

    verifyAdmin();
  }, [navigate]); // Include navigate in dependency array

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous error
    setLoading(true); // Set loading state to true

    try {
      await adminLogin(email, password);
      const newToken = sessionStorage.getItem("token");
      const adminCheck = await checkAdminAuth();
      if (adminCheck) {
        console.log("AdminToken here is ", newToken);
        navigate("/admin-dashboard"); // Redirect to user dashboard after login
      } else {
        setError("Incorrect Email or password. Please try again.");
      }
    } catch (err) {
      console.error("Admin Login failed:", err);
      setError("Admin Login failed. Please check your credentials.");
    } finally {
      setLoading(false); // Reset loading state
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
          Admin Login
        </Typography>
        {error && (
          <Alert severity="error" style={{ marginBottom: "16px" }}>
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
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "16px" }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
