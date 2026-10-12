import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useProgressApi } from '../hooks/useProgressApi';

export const Dashboard = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuthStore();
    const { progress, fetchProgress, loading, error } = useProgressApi();

    useEffect(() => {
        fetchProgress();
    }, []);

    if (loading) {
        return (
            <div className="container mt-5 text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-3 text-muted">Loading your learning progress...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5 py-4">
                <div className="alert alert-danger shadow-sm rounded-4 d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="alert-heading mb-1">Failed to load progress</h5>
                        <p className="mb-0">{error}</p>
                    </div>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => fetchProgress()}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Default fallback progress state if progress is not loaded yet
    const currentProgress = progress || {
        xp: 0,
        level: 'Beginner',
        completedLessons: [],
        gameScores: [],
        placementTestScore: 0
    };

    const completedLessonsCount = currentProgress.completedLessons?.length || 0;
    const gameScoresList = currentProgress.gameScores || [];
    const gamesCount = gameScoresList.length;
    const xp = currentProgress.xp || 0;
    const level = currentProgress.level || 'Beginner';
    const placementScore = currentProgress.placementTestScore || 0;

    // Calculate level thresholds for progress bar
    let nextLevel = 'Intermediate';
    let targetXp = 200;
    let prevLevelXp = 0;

    if (level === 'Intermediate' || (xp >= 200 && xp < 500)) {
        nextLevel = 'Advanced';
        targetXp = 500;
        prevLevelXp = 200;
    } else if (level === 'Advanced' || xp >= 500) {
        nextLevel = 'Master';
        targetXp = 1000;
        prevLevelXp = 500;
    }

    const xpInLevel = Math.max(0, xp - prevLevelXp);
    const xpSpan = Math.max(1, targetXp - prevLevelXp);
    const levelPercentage = Math.min(100, Math.round((xpInLevel / xpSpan) * 100));

    return (
        <div className="container py-5 fade-in">
            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h2 className="fw-bold text-dark mb-1">
                        Welcome back, {currentUser?.fullName || currentUser?.userName || 'Student'}! 👋
                    </h2>
                    <p className="text-muted mb-0">Track your English fluency, test results, and milestones.</p>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-warning text-dark fs-6 py-2 px-3 rounded-pill shadow-sm">
                        🏆 Level: {level}
                    </span>
                    <button
                        onClick={() => navigate('/lessons')}
                        className="btn btn-primary rounded-pill px-4 fw-semibold shadow-sm"
                    >
                        Continue Learning &rarr;
                    </button>
                </div>
            </div>

            {/* Level XP Progress Bar Card */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-5 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold text-dark">
                        Level Progression: <span className="text-primary">{level}</span> &rarr; <span className="text-secondary">{nextLevel}</span>
                    </span>
                    <span className="text-muted small fw-semibold">
                        {xp} / {targetXp} XP ({levelPercentage}%)
                    </span>
                </div>
                <div className="progress" style={{ height: '12px', borderRadius: '10px' }}>
                    <div
                        className="progress-bar bg-primary progress-bar-striped progress-bar-animated"
                        role="progressbar"
                        style={{ width: `${levelPercentage}%` }}
                        aria-valuenow={levelPercentage}
                        aria-valuemin="0"
                        aria-valuemax="100"
                    ></div>
                </div>
                <small className="text-muted mt-2">
                    Earn {Math.max(0, targetXp - xp)} more XP to level up to {nextLevel}!
                </small>
            </div>

            {/* 4 Main Stat Cards */}
            <div className="row g-4">
                {/* XP Card */}
                <div className="col-md-6 col-lg-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 bg-gradient text-white" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <div className="card-body text-center p-4">
                            <span className="fs-1 d-block mb-1">⭐</span>
                            <h5 className="card-title text-white-50 mb-2">Total XP</h5>
                            <h1 className="display-4 fw-bold mb-0">{xp}</h1>
                        </div>
                    </div>
                </div>

                {/* Lessons Card */}
                <div className="col-md-6 col-lg-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 text-white" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
                        <div className="card-body text-center p-4">
                            <span className="fs-1 d-block mb-1">📚</span>
                            <h5 className="card-title text-white-50 mb-2">Lessons Completed</h5>
                            <h1 className="display-4 fw-bold mb-0">{completedLessonsCount}</h1>
                        </div>
                    </div>
                </div>

                {/* Games Card */}
                <div className="col-md-6 col-lg-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 text-white" style={{ background: 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)' }}>
                        <div className="card-body text-center p-4">
                            <span className="fs-1 d-block mb-1">🎮</span>
                            <h5 className="card-title text-white-50 mb-2">Games Played</h5>
                            <h1 className="display-4 fw-bold mb-0">{gamesCount}</h1>
                        </div>
                    </div>
                </div>

                {/* Placement Test Score Card */}
                <div className="col-md-6 col-lg-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 text-white" style={{ background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' }}>
                        <div className="card-body text-center p-4">
                            <span className="fs-1 d-block mb-1">🎯</span>
                            <h5 className="card-title text-white-50 mb-2">Placement Score</h5>
                            <h1 className="display-4 fw-bold mb-0">{placementScore}%</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="mt-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="fw-bold mb-0">Recent Activity</h4>
                    {(completedLessonsCount > 0 || gamesCount > 0) && (
                        <span className="text-muted small">
                            {completedLessonsCount} lessons • {gamesCount} games
                        </span>
                    )}
                </div>

                {completedLessonsCount === 0 && gamesCount === 0 ? (
                    <div className="card border-0 shadow-sm rounded-4 p-5 text-center text-muted">
                        <div className="text-5xl mb-3">🌱</div>
                        <h5 className="fw-bold text-dark">No learning activity yet</h5>
                        <p className="text-muted mb-4">Complete your first lesson, play a spelling game, or take the placement test to see your activity!</p>
                        <div className="d-flex justify-content-center gap-3">
                            <button onClick={() => navigate('/lessons')} className="btn btn-primary rounded-pill px-4">
                                Start a Lesson
                            </button>
                            <button onClick={() => navigate('/games')} className="btn btn-outline-primary rounded-pill px-4">
                                Play a Game
                            </button>
                            <button onClick={() => navigate('/placement-test')} className="btn btn-outline-secondary rounded-pill px-4">
                                Take Placement Test
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="row g-3">
                        {/* Completed Lessons summary item */}
                        {completedLessonsCount > 0 && (
                            <div className="col-md-6">
                                <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="bg-success-subtle text-success p-3 rounded-circle fs-4">
                                            ✓
                                        </div>
                                        <div className="flex-grow-1">
                                            <h6 className="fw-bold mb-1">Completed {completedLessonsCount} Interactive Lessons</h6>
                                            <p className="text-muted small mb-0">Vocabulary, grammar, and practice exercises completed.</p>
                                        </div>
                                        <button
                                            onClick={() => navigate('/lessons')}
                                            className="btn btn-sm btn-outline-success rounded-pill px-3"
                                        >
                                            Review
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Games history list */}
                        {gameScoresList.slice(-6).reverse().map((g, idx) => (
                            <div key={idx} className="col-md-6">
                                <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="bg-primary-subtle text-primary p-3 rounded-circle fs-4">
                                            🎮
                                        </div>
                                        <div className="flex-grow-1">
                                            <h6 className="fw-bold mb-1">{g.game || 'Educational Game'}</h6>
                                            <p className="text-muted small mb-0">
                                                Score: <span className="fw-bold text-primary">{g.score || 0} pts</span>
                                                {g.date && ` • ${new Date(g.date).toLocaleDateString()}`}
                                            </p>
                                        </div>
                                        <span className="badge bg-light text-dark border">Completed</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
