// src/pages/RegisterPage.tsx
import React, { useEffect } from "react";
import Register from "../components/Register"; // Adjust this path based on where Register.tsx is located

const RegisterPage: React.FC = () => {
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.backgroundColor = "#1A1B1B";
  }, []);
  return (
    <div>
      {/* <h1>Register</h1> */}
      <Register />
    </div>
  );
};

export default RegisterPage;
