// src/context/AuthContext.tsx

import React, { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import axios from "axios"; // Import axios

// Create an API client instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  withCredentials: true,
});

// Define the shape of the User object
interface User {
  name: string | null;
  email: string;
}

// Define the shape of the context data, now including a loading state
interface AuthContextType {
  user: User | null;
  loading: boolean; // ✨ ADD LOADING STATE
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // ✨ START IN A LOADING STATE

  // ✨ ADD THIS USEEFFECT HOOK
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // Check if the httpOnly cookie is valid
        const response = await api.get("/auth/me");
        setUser(response.data); // If successful, set the user
      } catch (error) {
        // If the cookie is invalid or not there, the API will return an error
        setUser(null);
      } finally {
        // We are done checking, so set loading to false
        setLoading(false);
      }
    };

    checkUserStatus();
  }, []); // The empty array [] means this runs only once when the app starts

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    // In a real app, you would also call a /logout endpoint on the backend
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook remains the same
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
