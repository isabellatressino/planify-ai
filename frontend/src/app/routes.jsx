import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute.jsx";
import useAuth from "../hooks/useAuth.js";
import AuthLayout from "../layouts/AuthLayout.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import PublicLayout from "../layouts/PublicLayout.jsx";
import CreatePlan from "../pages/CreatePlan.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Landing from "../pages/Landing.jsx";
import Login from "../pages/Login.jsx";
import PlanDetails from "../pages/PlanDetails.jsx";
import Profile from "../pages/Profile.jsx";
import Register from "../pages/Register.jsx";
import VerifyEmail from "../pages/VerifyEmail.jsx";

function HomeRoute() {
  const { loading, isVerified } = useAuth();

  if (loading) {
    return null;
  }

  return isVerified ? <Navigate to="/dashboard" replace /> : <Landing />;
}

function PublicAuthRoute({ children }) {
  const { loading, isVerified } = useAuth();

  if (loading) {
    return null;
  }

  return isVerified ? <Navigate to="/dashboard" replace /> : children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomeRoute />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            <PublicAuthRoute>
              <Login />
            </PublicAuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicAuthRoute>
              <Register />
            </PublicAuthRoute>
          }
        />
        <Route
          path="/verify-email"
          element={
            <PublicAuthRoute>
              <VerifyEmail />
            </PublicAuthRoute>
          }
        />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/plans/new" element={<CreatePlan />} />
          <Route path="/plans/:id" element={<PlanDetails />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
