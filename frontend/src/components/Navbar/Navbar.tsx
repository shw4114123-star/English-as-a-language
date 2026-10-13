import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useProgressApi } from '../../hooks/useProgressApi';
import { UserProgress } from '../../types/progress';
import './Navbar.css';

interface NavItem {
    label: string;
    path: string;
}

export const Navbar: React.FC = () => {
    const { isAuthenticated, currentUser, logout } = useAuthStore();
    const { progress: rawProgress, fetchProgress } = useProgressApi();
    const progress = rawProgress as UserProgress | null;
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (isAuthenticated) {
            fetchProgress();
        }
    }, [isAuthenticated, location.pathname]);

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
        { label: 'Resources', path: '/resources' },
        { label: 'Dashboard', path: '/dashboard' },
    ];

    if (currentUser?.role === 'teacher' || currentUser?.role === 'admin') {
        navItems.push({ label: 'Teacher', path: '/teacher' });
    }

    if (currentUser?.role === 'admin') {
        navItems.push({ label: 'Admin', path: '/admin/users' });
    }

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Brand Logo & Name */}
                <span
                    className="navbar-brand"
                    onClick={() => navigate('/')}
                >
                    English-as-a-language
                </span>

                {/* Navigation Links */}
                <div className="navbar-links">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                type="button"
                                onClick={() => navigate(item.path)}
                                className={`navbar-button ${isActive ? 'navbar-button-active' : ''}`}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </div>

                {/* Authentication & User Actions */}
                <div className="navbar-actions">
                    {isAuthenticated ? (
                        <>
                            {progress && (
                                <span
                                    onClick={() => navigate('/dashboard')}
                                    className="navbar-xp-badge"
                                    title="View My Dashboard Progress"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#e09f3e" stroke="#e09f3e" strokeWidth="1.5" style={{ display: 'inline-block', verticalAlign: '-1px', marginRight: '4px' }}>
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                    {progress.xp || 0} XP
                                </span>
                            )}
                            <span className="navbar-user-badge">
                                {currentUser?.userName || 'User'}
                                {currentUser?.role && currentUser.role !== 'student' && (
                                    <span className="user-role-tag">({currentUser.role})</span>
                                )}
                            </span>
                            <button
                                className="button button-warning button-sm button-pill"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className={`button button-outline button-sm button-pill ${location.pathname === '/login' ? 'button-active' : ''}`}
                                onClick={() => navigate('/login')}
                            >
                                Login
                            </button>
                            <button
                                className="button button-primary button-sm button-pill"
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
