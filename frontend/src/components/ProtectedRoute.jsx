import { Navigate, Outlet } from "react-router-dom";

import useAuth from "../hooks/useAuth.js";

export default function ProtectedRoute() {
  const { loading, isAuthenticated, isVerified } = useAuth();

  if (loading) {
    return <p className="text-sm text-text-body">Carregando...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return <Outlet />;
}
