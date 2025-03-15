import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './modules/auth/hooks/useAuth';
import Login from './modules/auth/pages/Login';
import Dashboard from './modules/dashboard/pages/Dashboard';
import ContactForm from './modules/contact/pages/ContactForm';
import AccidentReportForm from './modules/accidents/pages/AccidentReportForm';
import BusMovementForm from './modules/buses/pages/BusMovementForm';
import MidReportForm from './modules/mids/pages/MidReportForm';
import Header from './modules/core/components/Header';
import ProtectedRoute from './modules/auth/components/ProtectedRoute';
import ReportsHistory from './modules/reports/pages/ReportsHistory';
import ZaptBadge from './modules/core/components/ZaptBadge';

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/contact" element={
            <ProtectedRoute>
              <ContactForm />
            </ProtectedRoute>
          } />
          
          <Route path="/accident-report" element={
            <ProtectedRoute>
              <AccidentReportForm />
            </ProtectedRoute>
          } />
          
          <Route path="/bus-movement" element={
            <ProtectedRoute>
              <BusMovementForm />
            </ProtectedRoute>
          } />
          
          <Route path="/mid-report" element={
            <ProtectedRoute>
              <MidReportForm />
            </ProtectedRoute>
          } />
          
          <Route path="/reports" element={
            <ProtectedRoute>
              <ReportsHistory />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <ZaptBadge />
    </div>
  );
}