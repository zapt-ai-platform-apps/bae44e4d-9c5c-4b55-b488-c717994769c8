import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RequireAuth from '@/modules/auth/components/RequireAuth';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ContactPage from './pages/ContactPage';
import AccidentReportsPage from './pages/AccidentReportsPage';
import BusMovementsPage from './pages/BusMovementsPage';
import MidsReportsPage from './pages/MidsReportsPage';
import ProfilePage from './pages/ProfilePage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected routes */}
      <Route path="/" element={
        <RequireAuth>
          <Dashboard />
        </RequireAuth>
      } />
      
      <Route path="/contact" element={
        <RequireAuth>
          <ContactPage />
        </RequireAuth>
      } />
      
      <Route path="/accident-reports" element={
        <RequireAuth>
          <AccidentReportsPage />
        </RequireAuth>
      } />
      
      <Route path="/bus-movements" element={
        <RequireAuth>
          <BusMovementsPage />
        </RequireAuth>
      } />
      
      <Route path="/mids-reports" element={
        <RequireAuth>
          <MidsReportsPage />
        </RequireAuth>
      } />
      
      <Route path="/profile" element={
        <RequireAuth>
          <ProfilePage />
        </RequireAuth>
      } />
      
      {/* Catch all route - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;