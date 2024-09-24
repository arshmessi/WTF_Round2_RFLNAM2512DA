import React from "react";
import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Typography variant="h4">404 Not Found</Typography>
      <Typography variant="body1">
        The page you are looking for does not exist.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/user-dashboard")}>
        Go to User Dashboard
      </Button>
    </div>
  );
};

export default NotFoundPage;
