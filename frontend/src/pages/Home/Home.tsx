import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import './Home.css';

export const Home: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();

    return (
        <div className="fade-in">
            {/* Hero Section */}
            <div className="home-hero-section text-center">
                <div className="home-hero-glow"></div>
                <div className="container py-4 relative z-10">
                    <span className="hero-pill-badge">
                        Master English from Scratch
                    </span>
                    <h1 className="hero-title">
                        English-as-a-language
                    </h1>
                    <p className="hero-subtitle">
                        Interactive phonics, vocabulary games, guided lessons, and diagnostic tests designed to make learning English joyful and fast.
                    </p>
                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                        {isAuthenticated ? (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="hero-btn-primary"
                            >
                                Continue Learning (Dashboard)
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/register')}
                                className="hero-btn-primary"
                            >
                                Get Started Free
                            </button>
                        )}
                        <button
                            onClick={() => navigate('/placement-test')}
                            className="hero-btn-secondary"
                        >
                            Take Level Test
                        </button>
                    </div>
                </div>
            </div>

            {/* Feature Cards Section */}
            <div className="container py-5">
                <div className="text-center mb-5">
                    <h2 className="fw-bold mb-2" style={{ fontSize: '2rem', color: 'var(--text-main, #2b3650)' }}>Everything You Need to Succeed</h2>
                    <p style={{ color: 'var(--text-secondary, #475569)' }}>A step-by-step path designed for all proficiency levels</p>
                </div>

                <div className="row g-4">
                    <div className="col-md-4">
                        <div
                            onClick={() => navigate('/alphabet')}
                            className="feature-card"
                        >
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔤</div>
                            <h4 className="feature-card-title">Alphabet & Phonics</h4>
                            <p className="feature-card-desc">
                                Interactive audio pronunciation for all 26 letters with example words, phonetics, and speech synthesis.
                            </p>
                            <div className="feature-card-link">
                                Practice letters &rarr;
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div
                            onClick={() => navigate('/placement-test')}
                            className="feature-card"
                        >
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎯</div>
                            <h4 className="feature-card-title">Placement Test</h4>
                            <p className="feature-card-desc">
                                Test your grammar, vocabulary, and sentence structures to pinpoint your exact CEFR level (Beginner, Intermediate, Advanced).
                            </p>
                            <div className="feature-card-link">
                                Start test &rarr;
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div
                            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                            className="feature-card"
                        >
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏆</div>
                            <h4 className="feature-card-title">XP & Gamified Progress</h4>
                            <p className="feature-card-desc">
                                Earn experience points (XP), level up, track completion rates, and celebrate milestones on your personal dashboard.
                            </p>
                            <div className="feature-card-link">
                                View tracker &rarr;
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Home;
