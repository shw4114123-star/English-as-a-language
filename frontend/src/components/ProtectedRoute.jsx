import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, currentUser, loading } = useAuthStore();

    if (loading) return <div className="container mt-5">Loading...</div>;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        return <Navigate to="/" replace />; // Redirect to home if unauthorized
    }

    return children;
};
