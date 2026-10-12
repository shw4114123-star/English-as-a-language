import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import './Navbar.css';

interface NavItem {
    label: string;
    path: string;
}

export const Navbar: React.FC = () => {
    const { isAuthenticated, currentUser, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems: NavItem[] = [
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
        <nav className="navbar-container">
            <div className="navbar-inner">
                {/* Brand Logo & Name */}
                <span
                    className="brand-text"
                    onClick={() => navigate('/')}
                >
                    English-as-a-language
                </span>

                {/* Always visible navigation buttons */}
                <div className="nav-links-wrap">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                type="button"
                                onClick={() => navigate(item.path)}
                                className={`nav-btn ${isActive ? 'nav-btn-active' : ''}`}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </div>

                {/* Auth Actions (Login / Register / User / Logout) */}
                <div className="auth-actions-wrap">
                    {isAuthenticated ? (
                        <>
                            <span className="user-badge">
                                {currentUser?.userName || 'User'}
                                {currentUser?.role && currentUser.role !== 'student' && (
                                    <span className="user-role-tag">({currentUser.role})</span>
                                )}
                            </span>
                            <button
                                className="btn-auth-logout"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className={`btn-auth-login ${location.pathname === '/login' ? 'nav-btn-active' : ''}`}
                                onClick={() => navigate('/login')}
                            >
                                Login
                            </button>
                            <button
                                className="btn-auth-register"
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
export default Navbar;
