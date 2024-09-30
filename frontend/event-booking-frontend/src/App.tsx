// src/App.tsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboard from "./pages/UserDashboardPage";
import AdminDashboard from "./pages/AdminDashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import HomePage from "./pages/HomePage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminRegisterPage from "./pages/AdminRegisterPage";
import EventManagementPage from "./pages/EventManagementPage";
import UserDetails from "./components/UserDetails";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} /> {/* Home page route */}
            <Route path="/login" element={<LoginPage />} />{" "}
            <Route path="/admin-login" element={<AdminLoginPage />} />{" "}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-register" element={<AdminRegisterPage />} />
            <Route path="/event-management" element={<EventManagementPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/user-details" element={<UserDetails />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
