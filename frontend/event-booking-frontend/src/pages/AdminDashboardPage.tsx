import React, { useEffect } from "react";
import AdminDashboard from "../components/AdminDashboard";

const AdminDashboardPage: React.FC = () => {
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.backgroundColor = "#1A1B1B";
  }, []);
  return (
    <div>
      <AdminDashboard />
    </div>
  );
};

export default AdminDashboardPage;
