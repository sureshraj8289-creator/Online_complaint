import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ComplaintProvider } from './context/ComplaintContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UserDashboard } from './pages/UserDashboard';
import { AgentDashboard } from './pages/AgentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ComplaintDetailsPage } from './pages/ComplaintDetailsPage';
import { FeedbackPage } from './pages/FeedbackPage';

export default function App() {
  return (
    <AuthProvider>
      <ComplaintProvider>
        <Router>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Role Protected Dashboards */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/agent"
                  element={
                    <ProtectedRoute allowedRoles={['AGENT', 'ADMIN']}>
                      <AgentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Complaint Details & Feedback */}
                <Route
                  path="/complaints/:id"
                  element={
                    <ProtectedRoute>
                      <ComplaintDetailsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/feedback/:id"
                  element={
                    <ProtectedRoute allowedRoles={['USER']}>
                      <FeedbackPage />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ComplaintProvider>
    </AuthProvider>
  );
}
