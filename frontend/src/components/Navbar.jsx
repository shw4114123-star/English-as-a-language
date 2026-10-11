import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const Navbar = () => {
    const { isAuthenticated, currentUser, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

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

    const handleNavigate = (path) => {
        setIsOpen(false);
        navigate(path);
    };

    return (
        <nav className="navbar navbar-expand-xl navbar-dark bg-primary shadow-sm sticky-top py-2">
            <div className="container-fluid px-lg-4">
                {/* Brand */}
                <span
                    className="navbar-brand fw-bold d-flex align-items-center gap-2 cursor-pointer me-3"
                    style={{ cursor: 'pointer', fontSize: '1.25rem' }}
                    onClick={() => handleNavigate('/')}
                >
                    <span>🇬🇧</span>
                    <span>English-as-a-language</span>
                </span>

                {/* Mobile hamburger toggler */}
                <button
                    className="navbar-toggler"
                    type="button"
                    aria-label="Toggle navigation"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navbar Content */}
                <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
                    {/* Outline Navigation Buttons */}
                    <ul className="navbar-nav me-auto my-2 my-xl-0 d-flex flex-wrap gap-2 align-items-center">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <li className="nav-item" key={item.path}>
                                    <button
                                        type="button"
                                        onClick={() => handleNavigate(item.path)}
                                        className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold transition-all ${isActive
                                            ? 'btn-light text-primary shadow-sm'
                                            : 'btn-outline-light'
                                            }`}
                                        style={{
                                            borderWidth: '1.5px',
                                            whiteSpace: 'nowrap',
                                            transition: 'all 0.2s ease-in-out',
                                        }}
                                    >
                                        {item.label}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Auth Actions */}
                    <div className="d-flex align-items-center gap-2 mt-2 mt-xl-0 flex-wrap">
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
                                    className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold ${location.pathname === '/login'
                                        ? 'btn-light text-primary shadow-sm'
                                        : 'btn-outline-light'
                                        }`}
                                    style={{ borderWidth: '1.5px' }}
                                    onClick={() => handleNavigate('/login')}
                                >
                                    Login
                                </button>
                                <button
                                    className="btn btn-warning text-dark btn-sm rounded-pill px-3 py-1 fw-bold shadow-sm"
                                    onClick={() => handleNavigate('/register')}
                                >
                                    Register
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
