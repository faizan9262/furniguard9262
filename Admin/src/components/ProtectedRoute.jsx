import React from "react";
import { Navigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext"; // adjust path

const ProtectedRoute = ({ children }) => {
  const adminContext = useAdmin();

  // Show nothing (or a loader) while checking login status
  if (adminContext.isLoggedIn === null) {
    return <div>Loading...</div>; // optional: spinner instead
  }

  // Not logged in → redirect to login
  if (!adminContext.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Logged in → render protected content
  return <>{children}</>;
};

export default ProtectedRoute;
