import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login: React.FC = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      await authContext?.login(username, password);
      navigate("/user-dashboard"); // Adjust path as needed
    } catch (err) {
      setError("User login failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
      <button
        type="button"
        onClick={() => {
          navigate("/register"); // Adjust path as needed
        }}
      >
        Register
      </button>
    </form>
  );
};

export default Login;
