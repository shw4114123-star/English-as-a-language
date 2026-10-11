import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const Navbar = () => {
    const { isAuthenticated, currentUser, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
            <div className="container">
                <span className="navbar-brand fw-bold" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                    English-as-a-language
                </span>
                <div className="d-flex ms-auto">
                    {isAuthenticated ? (
                        <>
                            <span className="navbar-text text-white me-3">Hi, {currentUser?.userName}</span>
                            <button className="btn btn-light btn-sm" onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <button className="btn btn-outline-light me-2" onClick={() => navigate('/login')}>Login</button>
                            <button className="btn btn-warning text-dark" onClick={() => navigate('/register')}>Register</button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
