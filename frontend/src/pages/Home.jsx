import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const Home = () => {
    const navigate = useNavigate();
    const { isAuthenticated, currentUser } = useAuthStore();

    return (
        <div className="fade-in">
            {/* Hero Section */}
            <div className="bg-gradient text-white py-5 py-md-6" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' }}>
                <div className="container text-center py-5">
                    <span className="badge bg-white text-primary px-3 py-2 rounded-pill fw-semibold mb-3 shadow-sm">
                        🚀 Master English from Scratch
                    </span>
                    <h1 className="display-3 fw-bold mb-3 tracking-tight">
                        English-as-a-language
                    </h1>
                    <p className="lead text-blue-100 max-w-2xl mx-auto mb-4 fs-4">
                        Interactive phonics, vocabulary games, guided lessons, and diagnostic tests designed to make learning English joyful and fast.
                    </p>
                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                        {isAuthenticated ? (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="btn btn-warning btn-lg px-4 py-3 rounded-pill fw-bold shadow-lg hover:scale-105 transition-all text-dark"
                            >
                                Continue Learning (Dashboard)
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/register')}
                                className="btn btn-warning btn-lg px-4 py-3 rounded-pill fw-bold shadow-lg hover:scale-105 transition-all text-dark"
                            >
                                Get Started Free
                            </button>
                        )}
                        <button
                            onClick={() => navigate('/placement-test')}
                            className="btn btn-outline-light btn-lg px-4 py-3 rounded-pill fw-bold hover:scale-105 transition-all"
                        >
                            Take Level Test
                        </button>
                    </div>
                </div>
            </div>

            {/* Feature Cards Section */}
            <div className="container py-5">
                <div className="text-center mb-5">
                    <h2 className="fw-bold text-dark mb-2">Everything You Need to Succeed</h2>
                    <p className="text-muted">A step-by-step path designed for all proficiency levels</p>
                </div>

                <div className="row g-4">
                    <div className="col-md-4">
                        <div
                            onClick={() => navigate('/alphabet')}
                            className="card h-100 border-0 shadow-sm rounded-4 p-4 hover:shadow-md transition-all cursor-pointer"
                        >
                            <div className="text-4xl mb-3">🔤</div>
                            <h4 className="fw-bold mb-2 text-dark">Alphabet & Phonics</h4>
                            <p className="text-muted mb-4">
                                Interactive audio pronunciation for all 26 letters with example words, phonetics, and speech synthesis.
                            </p>
                            <div className="mt-auto text-primary fw-semibold">
                                Practice letters &rarr;
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div
                            onClick={() => navigate('/placement-test')}
                            className="card h-100 border-0 shadow-sm rounded-4 p-4 hover:shadow-md transition-all cursor-pointer"
                        >
                            <div className="text-4xl mb-3">🎯</div>
                            <h4 className="fw-bold mb-2 text-dark">Placement Test</h4>
                            <p className="text-muted mb-4">
                                Test your grammar, vocabulary, and sentence structures to pinpoint your exact CEFR level (Beginner, Intermediate, Advanced).
                            </p>
                            <div className="mt-auto text-primary fw-semibold">
                                Start test &rarr;
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div
                            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                            className="card h-100 border-0 shadow-sm rounded-4 p-4 hover:shadow-md transition-all cursor-pointer"
                        >
                            <div className="text-4xl mb-3">🏆</div>
                            <h4 className="fw-bold mb-2 text-dark">XP & Gamified Progress</h4>
                            <p className="text-muted mb-4">
                                Earn experience points (XP), level up, track completion rates, and celebrate milestones on your personal dashboard.
                            </p>
                            <div className="mt-auto text-primary fw-semibold">
                                View tracker &rarr;
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
