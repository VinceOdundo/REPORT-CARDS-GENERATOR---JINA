import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../features/auth/useAuth";
import { Loading } from "./Loading";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};
