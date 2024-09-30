import React, { useEffect } from "react";
import AdminLogin from "../components/AdminLogin";

const AdminLoginPage: React.FC = () => {
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.backgroundColor = "#1E1E1E";
  }, []);
  return (
    <div>
      <AdminLogin />
    </div>
  );
};

export default AdminLoginPage;
