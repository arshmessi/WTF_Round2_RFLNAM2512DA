import React from "react";
import AdminLogin from "../components/AdminLogin";
import { Container } from "@mui/material";

const AdminLoginPage: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <AdminLogin />
    </Container>
  );
};

export default AdminLoginPage;
