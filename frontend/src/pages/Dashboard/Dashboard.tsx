import React, { useEffect } from 'react';
import { useProgressApi } from '../../hooks/useProgressApi';
import { UserProgress } from '../../types/progress';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
    const { progress: rawProgress, fetchProgress, loading, error } = useProgressApi();
    const progress = rawProgress as UserProgress | null;

    useEffect(() => {
        fetchProgress();
    }, []);

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div style={{ color: '#c4b5fd', fontSize: '1.2rem' }}>Loading Dashboard...</div>
            </div>
        );
    }
    if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;
    if (!progress) return null;

    return (
        <div className="container py-5 fade-in">
            <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
                <h2 className="fw-bold mb-0" style={{
                    fontSize: '2rem',
                    background: 'linear-gradient(135deg, #ffffff 0%, #d8b4fe 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    My Dashboard
                </h2>
                <span className="dashboard-level-badge">
                    Level: {progress.level}
                </span>
            </div>

            <div className="row g-4">
                {/* XP Card */}
                <div className="col-md-6 col-lg-3">
                    <div className="dashboard-stat-card stat-xp">
                        <h5 className="stat-title">Total XP</h5>
                        <h1 className="stat-value">{progress.xp}</h1>
                    </div>
                </div>

                {/* Lessons Card */}
                <div className="col-md-6 col-lg-3">
                    <div className="dashboard-stat-card stat-lessons">
                        <h5 className="stat-title">Lessons Completed</h5>
                        <h1 className="stat-value">{progress.completedLessons?.length || 0}</h1>
                    </div>
                </div>

                {/* Games Card */}
                <div className="col-md-6 col-lg-3">
                    <div className="dashboard-stat-card stat-games">
                        <h5 className="stat-title">Games Played</h5>
                        <h1 className="stat-value">{progress.gameScores?.length || 0}</h1>
                    </div>
                </div>

                {/* Placement Test Score Card */}
                <div className="col-md-6 col-lg-3">
                    <div className="dashboard-stat-card stat-score">
                        <h5 className="stat-title">Placement Score</h5>
                        <h1 className="stat-value">{progress.placementTestScore || 0}%</h1>
                    </div>
                </div>
            </div>

            <div className="mt-5">
                <h4 className="fw-bold mb-4" style={{ color: '#e9d5ff' }}>Recent Activity</h4>
                <div className="recent-activity-card">
                    {(!progress.completedLessons || progress.completedLessons.length === 0) &&
                     (!progress.gameScores || progress.gameScores.length === 0) ? (
                        <p className="mb-0 fs-5">No activity yet. Start a lesson or play a game!</p>
                    ) : (
                        <p className="mb-0 fs-5">Activity history will appear here.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Dashboard;
