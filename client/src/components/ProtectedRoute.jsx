import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading security credentials...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to role-appropriate dashboard if unauthorized for this specific page
    if (user?.role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (user?.role === 'AGENT') return <Navigate to="/agent" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
