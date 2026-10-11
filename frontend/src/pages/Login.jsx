import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthApi } from '../hooks/useAuthApi';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { fetchLoginUser, loading, error } = useAuthApi();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await fetchLoginUser(email, password);
        if (success) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow-sm border-0 rounded-lg">
                        <div className="card-body p-5">
                            <h2 className="text-center mb-4 fw-bold text-primary">Welcome Back!</h2>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label text-gray-700">Email address</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        required 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label text-gray-700">Password</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        required 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100 py-2 fw-bold" disabled={loading}>
                                    {loading ? 'Logging in...' : 'Login'}
                                </button>
                            </form>
                            <div className="mt-4 text-center">
                                <span className="text-muted">Don't have an account? </span>
                                <span onClick={() => navigate('/register')} style={{ cursor: 'pointer' }} className="text-decoration-none text-primary fw-bold">Register here</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
