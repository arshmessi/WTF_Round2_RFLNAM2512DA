// src/context/AuthContext.tsx
import React, { createContext, useState, ReactNode } from "react";
import {
  login as apiLogin,
  adminLogin as apiAdminLogin,
  registerNewAdmin,
} from "../services/api";

export interface AuthContextType {
  token: string | null; // Store only the token
  login: (email: string, password: string) => Promise<string | void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiLogin(email, password);
      setToken(response.data.token); // Set only the token
      sessionStorage.setItem("token", response.data.token);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const adminLogin = async (email: string, password: string) => {
    try {
      const response = await apiAdminLogin(email, password); // Call adminLogin from api
      setToken(response.data.token); // Set token for admin login
      sessionStorage.setItem("token", response.data.token);
    } catch (error) {
      console.error("Admin login failed:", error);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const storedToken = sessionStorage.getItem("token");
      if (!storedToken) throw new Error("No token available for registration");
      const response = await registerNewAdmin({ email, password }, storedToken);
      setToken(response.data.token); // You might want to set token here as well if the register also returns one
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, login, adminLogin, register }}>
      {children}
    </AuthContext.Provider>
  );
};
