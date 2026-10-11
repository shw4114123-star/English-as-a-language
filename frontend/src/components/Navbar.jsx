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
                <span className="navbar-brand fw-bold" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>English-as-a-language</span>
                
                {/* 
                  This is the Hamburger Menu button for mobile devices (Bootstrap).
                  When the screen is small, this button appears and lets you click it to open/close the navigation menu.
                */}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <span className="nav-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/alphabet')}>Alphabet</span>
                        </li>
                        <li className="nav-item">
                            <span className="nav-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/placement-test')}>Placement Test</span>
                        </li>
                        {isAuthenticated && (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/lessons')}>Lessons</span>
                                </li>
                                <li className="nav-item">
                                    <span className="nav-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/games')}>Games</span>
                                </li>
                                <li className="nav-item">
                                    <span className="nav-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>Dashboard</span>
                                </li>
                            </>
                        )}
                        {currentUser?.role === 'admin' && (
                            <li className="nav-item">
                                <span className="nav-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/users')}>Admin</span>
                            </li>
                        )}
                        {currentUser?.role === 'teacher' && (
                            <li className="nav-item">
                                <span className="nav-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/teacher')}>Teacher</span>
                            </li>
                        )}
                    </ul>
                    <div className="d-flex">
                        {isAuthenticated ? (
                            <>
                                <span className="navbar-text text-white me-3">
                                    Hi, {currentUser.userName}
                                </span>
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
            </div>
        </nav>
    );
};
