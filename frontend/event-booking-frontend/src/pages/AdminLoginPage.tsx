import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Import the custom useAuth hook

const AdminLogin: React.FC = () => {
  const { adminLogin } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // New loading state

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous error
    setLoading(true); // Set loading state to true

    try {
      await adminLogin(email, password);
      navigate("/admin-dashboard"); // Only navigate if login is successful
    } catch (err) {
      console.error("Admin Login failed:", err);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {error && <p>{error}</p>} {/* Display error message */}
    </div>
  );
};

export default AdminLogin;
