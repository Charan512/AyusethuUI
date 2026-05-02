import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import DashboardShell from './components/DashboardShell';
import ConsumerTimeline from './components/ConsumerTimeline';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import Landing from './pages/Landing';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <DashboardShell>{children}</DashboardShell>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />}>
        <Route path="login" element={<LoginView />} />
        <Route path="register" element={<RegisterView />} />
      </Route>
      <Route path="/verify/:batchId" element={<ConsumerTimeline />} />
      <Route path="/dashboard" element={
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
