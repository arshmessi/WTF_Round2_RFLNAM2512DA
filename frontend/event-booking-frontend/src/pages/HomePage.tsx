// src/pages/HomePage.tsx

import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to the Event Booking Application</h1>
      <button
        onClick={() => navigate("/login")}
        style={{ marginRight: "10px" }}
      >
        User Login
      </button>
      <button onClick={() => navigate("/admin-login")}>Admin Login</button>
      {/* Add additional content or styling here if needed */}
    </div>
  );
};

export default HomePage;
