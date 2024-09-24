// src/pages/EventManagementPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkAdminAuth } from "../services/api";
import AdminEventManagement from "../components/AdminEventManagement";

const EventManagementPage: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAdmin = async () => {
      const isAuthenticated = await checkAdminAuth();
      if (!isAuthenticated) {
        navigate("/"); // Redirect to home if not authenticated as admin
      } else {
        setIsAdmin(true);
      }
    };

    verifyAdmin();
  }, [navigate]);

  return isAdmin && token ? (
    <div>
      <AdminEventManagement token={token} />
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default EventManagementPage;
