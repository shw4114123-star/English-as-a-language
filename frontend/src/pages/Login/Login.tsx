import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthApi } from '../../hooks/useAuthApi';
import './Login.css';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { fetchLoginUser, loading, error } = useAuthApi();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await fetchLoginUser(email, password);
        if (success) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="auth-page-container fade-in">
            <div className="auth-card">
                <h2 className="auth-title">Welcome Back!</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email address</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <span style={{ color: '#c4b5fd' }}>Don't have an account? </span>
                    <span onClick={() => navigate('/register')} className="auth-switch-link">Register here</span>
                </div>
            </div>
        </div>
    );
};
export default Login;
