import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute: React.FC = () => {
  const { user } = useAuth();

  // If there's a user, show the nested route (e.g., Dashboard).
  // Otherwise, redirect to the login page.
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
