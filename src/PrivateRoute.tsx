import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./hooks/AuthProvider";

const PrivateRoute = () => {
  const auth = useAuth();

  if (!auth.isLoggedIn) return <Navigate to="/" />;
  return <Outlet />;
};

export default PrivateRoute;
