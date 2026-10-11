import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useProgressApi } from '../hooks/useProgressApi';

export const Dashboard = () => {
    const { currentUser } = useAuthStore();
    const { progress, fetchProgress, loading, error } = useProgressApi();

    useEffect(() => {
        fetchProgress();
    }, []);

    if (loading) return <div className="container mt-5 text-center"><div className="spinner-border text-primary" role="status"></div></div>;
    if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;
    if (!progress) return null;

    return (
        <div className="container py-5 fade-in">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2 className="fw-bold text-primary mb-0">My Dashboard</h2>
                <span className="badge bg-warning text-dark fs-5 py-2 px-4 rounded-pill shadow-sm">
                    Level: {progress.level}
                </span>
            </div>

            <div className="row g-4">
                {/* XP Card */}
                <div className="col-md-6 col-lg-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 bg-gradient text-white" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <div className="card-body text-center p-4">
                            <h5 className="card-title text-white-50 mb-3">Total XP</h5>
                            <h1 className="display-4 fw-bold mb-0">{progress.xp}</h1>
                        </div>
                    </div>
                </div>

                {/* Lessons Card */}
                <div className="col-md-6 col-lg-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
                        <div className="card-body text-center p-4 text-white">
                            <h5 className="card-title text-white-50 mb-3">Lessons Completed</h5>
                            <h1 className="display-4 fw-bold mb-0">{progress.completedLessons.length}</h1>
                        </div>
                    </div>
                </div>

                {/* Games Card */}
                <div className="col-md-6 col-lg-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100" style={{ background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' }}>
                        <div className="card-body text-center p-4 text-white">
                            <h5 className="card-title text-white-50 mb-3">Games Played</h5>
                            <h1 className="display-4 fw-bold mb-0">{progress.gameScores.length}</h1>
                        </div>
                    </div>
                </div>

                {/* Placement Test Score Card */}
                <div className="col-md-6 col-lg-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100" style={{ background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' }}>
                        <div className="card-body text-center p-4 text-white">
                            <h5 className="card-title text-white-50 mb-3">Placement Score</h5>
                            <h1 className="display-4 fw-bold mb-0">{progress.placementTestScore || 0}%</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-5">
                <h4 className="fw-bold mb-4">Recent Activity</h4>
                <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body p-4 text-center text-muted">
                        {progress.completedLessons.length === 0 && progress.gameScores.length === 0 ? (
                            <p className="mb-0 fs-5">No activity yet. Start a lesson or play a game!</p>
                        ) : (
                            <p className="mb-0 fs-5">Activity history will appear here.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
