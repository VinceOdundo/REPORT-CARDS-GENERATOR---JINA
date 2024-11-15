import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./features/auth/useAuth";

// Lazy load pages
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Login = React.lazy(() => import("./pages/Login"));
const Reports = React.lazy(() => import("./pages/Reports"));
const Settings = React.lazy(() => import("./pages/Settings"));
const Billing = React.lazy(() => import("./pages/Billing"));

export const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/reports"
          element={isAuthenticated ? <Reports /> : <Navigate to="/login" />}
        />
        <Route
          path="/settings"
          element={isAuthenticated ? <Settings /> : <Navigate to="/login" />}
        />
        <Route
          path="/billing"
          element={isAuthenticated ? <Billing /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </React.Suspense>
  );
};
