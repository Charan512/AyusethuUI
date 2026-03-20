import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import DashboardShell from './components/DashboardShell';
import ConsumerTimeline from './components/ConsumerTimeline';
import LoginView from './components/LoginView';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <DashboardShell>{children}</DashboardShell>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />
      <Route path="/verify/:batchId" element={<ConsumerTimeline />} />
      <Route path="/" element={
        <ProtectedRoute>
          {/* DashboardShell handles the active internal routing based on role */}
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
