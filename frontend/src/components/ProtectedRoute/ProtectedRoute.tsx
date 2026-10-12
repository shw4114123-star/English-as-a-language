import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import './ProtectedRoute.css';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { isAuthenticated, currentUser, loading } = useAuthStore();

    if (loading) {
        return (
            <div className="protected-route-loading">
                <div className="protected-spinner"></div>
                <span>Loading...</span>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && currentUser && !allowedRoles.includes(currentUser.role)) {
        return <Navigate to="/" replace />; // Redirect to home if unauthorized
    }

    return <>{children}</>;
};
export default ProtectedRoute;
