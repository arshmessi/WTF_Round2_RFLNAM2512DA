// src/pages/AdminRegisterPage.tsx
import React from "react";
import AdminRegister from "../components/AdminRegister";
import { Container } from "@mui/material";

const AdminRegisterPage: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <AdminRegister />
    </Container>
  );
};

export default AdminRegisterPage;
