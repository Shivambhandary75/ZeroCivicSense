import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import RaiseTicket from "../pages/RaiseTicket";
import TicketView from "../pages/TicketView";
import NotFound from "../pages/NotFound";

import CitizenDashboard from "../components/dashboard/CitizenDashboard";
import AdminDashboard from "../components/dashboard/AdminDashboard";
import ContractorDashboard from "../components/dashboard/ContractorDashboard";
import OfficialDashboard from "../components/dashboard/OfficialDashboard";
import Loader from "../components/common/Loader";

// ─── Protected Route ───────────────────────────────────────────
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

// ─── Dashboard resolver ─────────────────────────────────────────
const DashboardPage = () => {
  const { user } = useAuth();
  if (user?.role === "authority")   return <AdminDashboard />;
  if (user?.role === "contractor") return <ContractorDashboard />;
  if (user?.role === "official")   return <OfficialDashboard />;
  return <CitizenDashboard />;
};

// ─── App Routes ─────────────────────────────────────────────────
const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route
      path="/"
      element={
        <MainLayout>
          <Home />
        </MainLayout>
      }
    />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    {/* Protected */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <DashboardLayout>
            <DashboardPage />
          </DashboardLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/raise-ticket"
      element={
        <ProtectedRoute roles={["citizen"]}>
          <MainLayout>
            <RaiseTicket />
          </MainLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/tickets/:id"
      element={
        <MainLayout>
          <TicketView />
        </MainLayout>
      }
    />

    {/* 404 */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
