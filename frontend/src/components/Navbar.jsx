import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const Navbar = () => {
    const { isAuthenticated, currentUser, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { label: 'Home', path: '/' },
        { label: 'Alphabet', path: '/alphabet' },
        { label: 'Lessons', path: '/lessons' },
        { label: 'Games', path: '/games' },
        { label: 'Placement Test', path: '/placement-test' },
        { label: 'Dashboard', path: '/dashboard' },
    ];

    if (currentUser?.role === 'teacher' || currentUser?.role === 'admin') {
        navItems.push({ label: 'Teacher', path: '/teacher' });
    }

    if (currentUser?.role === 'admin') {
        navItems.push({ label: 'Admin', path: '/admin/users' });
    }

    return (
        <nav className="navbar navbar-dark bg-primary shadow-sm sticky-top py-2 px-3">
            <div className="container-fluid d-flex flex-wrap align-items-center justify-content-between gap-3">
                {/* Brand Logo & Name */}
                <span
                    className="navbar-brand fw-bold m-0"
                    style={{ cursor: 'pointer', fontSize: '1.25rem' }}
                    onClick={() => navigate('/')}
                >
                    English-as-a-language
                </span>

                {/* Always visible navigation buttons */}
                <div className="d-flex flex-wrap align-items-center gap-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                type="button"
                                onClick={() => navigate(item.path)}
                                className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold ${
                                    isActive
                                        ? 'btn-light text-primary shadow-sm'
                                        : 'btn-outline-light'
                                }`}
                                style={{
                                    borderWidth: '1.5px',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.15s ease-in-out',
                                }}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </div>

                {/* Auth Actions (Login / Register / User / Logout) */}
                <div className="d-flex align-items-center gap-2 flex-wrap">
                    {isAuthenticated ? (
                        <>
                            <span className="badge bg-white text-primary px-3 py-2 rounded-pill fw-semibold shadow-sm">
                                {currentUser?.userName || 'User'}
                                {currentUser?.role && currentUser.role !== 'student' && (
                                    <span className="ms-1 text-muted small">({currentUser.role})</span>
                                )}
                            </span>
                            <button
                                className="btn btn-outline-warning btn-sm rounded-pill px-3 py-1 fw-bold"
                                style={{ borderWidth: '1.5px' }}
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold ${
                                    location.pathname === '/login'
                                        ? 'btn-light text-primary shadow-sm'
                                        : 'btn-outline-light'
                                }`}
                                style={{ borderWidth: '1.5px' }}
                                onClick={() => navigate('/login')}
                            >
                                Login
                            </button>
                            <button
                                className="btn btn-warning text-dark btn-sm rounded-pill px-3 py-1 fw-bold shadow-sm"
                                onClick={() => navigate('/register')}
                            >
                                Register
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
