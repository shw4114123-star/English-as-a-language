import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthApi } from '../../hooks/useAuthApi';
import './Register.css';

export const Register: React.FC = () => {
    const [userName, setUserName] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { fetchRegisterUser, loading, error } = useAuthApi();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await fetchRegisterUser(userName, email, password, fullName);
        if (success) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="register-page-container fade-in">
            <div className="register-card">
                <h2 className="register-title">Join English-as-a-language</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input type="text" className="form-control" required value={userName} onChange={(e) => setUserName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <input type="text" className="form-control" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email address</label>
                        <input type="email" className="form-control" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="register-submit-btn" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <span style={{ color: 'var(--text-secondary, #475569)' }}>Already have an account? </span>
                    <span onClick={() => navigate('/login')} className="register-switch-link">Login here</span>
                </div>
            </div>
        </div>
    );
};
export default Register;
