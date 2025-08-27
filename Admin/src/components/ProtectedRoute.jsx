import React from "react";
import { Navigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext"; // adjust path

const ProtectedRoute = ({ children }) => {
  const adminContext = useAdmin();

  if (adminContext.isLoggedIn === null) {
    return <div>Loading..</div>;
  }

  if (!adminContext.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
