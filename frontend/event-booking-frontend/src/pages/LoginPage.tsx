import React, { useEffect } from "react";
import Login from "../components/Login";

const LoginPage: React.FC = () => {
  useEffect(() => {
    // This will run when the component mounts and ensure no margin is applied globally
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.backgroundColor = "#1E1E1E";
  }, []);

  return (
    <div style={{ overflow: "hidden", margin: "0px" }}>
      <Login />
    </div>
  );
};

export default LoginPage;
