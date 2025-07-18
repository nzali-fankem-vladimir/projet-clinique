import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./components/Login";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import CalendarPage from "./pages/CalendarPage";
import Chat from "./pages/Chat";
import Patients from "./pages/Patients";
import Invoices from "./pages/Invoices";
import { Toaster } from "./components/ui/toaster";

const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">401</h1>
      <p className="text-xl text-gray-600 mb-8">Unauthorized Access</p>
      <p className="text-gray-500">You don't have permission to access this page.</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="chat" element={<Chat />} />
              <Route path="patients" element={<Patients />} />
              <Route path="appointments" element={<CalendarPage />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="users" element={
                <ProtectedRoute requiredRole="admin">
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">User Management</h2>
                    <p className="text-gray-600">Admin-only feature coming soon...</p>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="doctors" element={
                <ProtectedRoute requiredRole="admin">
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Doctor Management</h2>
                    <p className="text-gray-600">Admin-only feature coming soon...</p>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="settings" element={
                <ProtectedRoute requiredRole="admin">
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Settings</h2>
                    <p className="text-gray-600">Admin-only feature coming soon...</p>
                  </div>
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster />
      </div>
    </AuthProvider>
  );
}

export default App;
