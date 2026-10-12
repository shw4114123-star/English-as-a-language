import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLessonsApi } from '../hooks/useLessonsApi';
import { useProgressApi } from '../hooks/useProgressApi';

export const Lessons = () => {
    const navigate = useNavigate();
    const { lessons, fetchAllLessons, loading, error } = useLessonsApi();
    const { progress, fetchProgress } = useProgressApi();

    // סטייט לסינון לפי רמה
    const [selectedLevel, setSelectedLevel] = useState('All');

    useEffect(() => {
        fetchAllLessons();
        fetchProgress();
    }, []);

    // סינון שיעורים לפי הרמה שנבחרה
    const filteredLessons = selectedLevel === 'All'
        ? lessons
        : lessons.filter(l => l.level === selectedLevel);

    // בדיקה האם שיעור מסוים כבר הושלם על ידי המשתמש
    const isCompleted = (lessonId) => {
        return Boolean(progress?.completedLessons?.some(id => String(id) === String(lessonId)));
    };

    const completedCount = lessons.filter(l => isCompleted(l._id)).length;
    const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

    return (
        <div className="container py-5 fade-in">
            {/* Overall Course Progress Banner */}
            {lessons.length > 0 && (
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 text-white" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' }}>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div>
                            <div className="d-flex align-items-center gap-2 mb-1">
                                <span className="fs-5">🎯</span>
                                <h5 className="fw-bold mb-0">Course Completion Progress</h5>
                            </div>
                            <p className="text-white-50 mb-0 small">
                                You have completed <strong className="text-white">{completedCount}</strong> of <strong className="text-white">{lessons.length}</strong> lessons ({progressPercent}%)
                            </p>
                        </div>
                        <div className="d-flex align-items-center gap-3" style={{ minWidth: '220px' }}>
                            <div className="progress flex-grow-1 bg-white bg-opacity-25" style={{ height: '10px', borderRadius: '10px' }}>
                                <div
                                    className="progress-bar bg-warning progress-bar-striped progress-bar-animated"
                                    role="progressbar"
                                    style={{ width: `${progressPercent}%` }}
                                    aria-valuenow={progressPercent}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                ></div>
                            </div>
                            <span className="fw-bold text-warning">{progressPercent}%</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h2 className="fw-bold text-dark mb-1">Interactive Lessons</h2>
                    <p className="text-muted mb-0">Learn vocabulary, grammar rules, and complete practice exercises.</p>
                </div>

                {/* כפתורי סינון לפי רמה */}
                <div className="btn-group shadow-sm" role="group">
                    {['All', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                        <button
                            key={lvl}
                            type="button"
                            className={`btn ${selectedLevel === lvl ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setSelectedLevel(lvl)}
                        >
                            {lvl}
                        </button>
                    ))}
                </div>
            </div>

            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            )}

            {error && (
                <div className="alert alert-danger mb-4">{error}</div>
            )}

            {!loading && filteredLessons.length === 0 && (
                <div className="card border-0 shadow-sm rounded-4 p-5 text-center text-muted">
                    <div className="text-5xl mb-3"></div>
                    <h4>No lessons found for this level</h4>
                    <p>New lessons will be added soon by teachers!</p>
                </div>
            )}

            <div className="row g-4">
                {filteredLessons.map((lesson) => {
                    const completed = isCompleted(lesson._id);
                    return (
                        <div key={lesson._id} className="col-md-6 col-lg-4">
                            <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden transition-all hover:shadow-md">
                                <div className="card-body p-4 d-flex flex-col">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <span className={`badge ${
                                            lesson.level === 'Beginner' ? 'bg-success-subtle text-success' :
                                            lesson.level === 'Intermediate' ? 'bg-warning-subtle text-warning' :
                                            'bg-danger-subtle text-danger'
                                        } px-3 py-1 rounded-pill fw-semibold`}>
                                            {lesson.level}
                                        </span>
                                        {completed && (
                                            <span className="badge bg-success text-white px-2 py-1 rounded-pill">
                                                ✓ Completed
                                            </span>
                                        )}
                                    </div>

                                    <h4 className="fw-bold text-dark mb-2">{lesson.title}</h4>
                                    <p className="text-muted flex-grow text-sm mb-4">
                                        {lesson.description || 'Step-by-step English exercises with words and practice quiz.'}
                                    </p>

                                    <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                                        <span className="text-muted text-sm">
                                            {lesson.words?.length || 0} Words • {lesson.questions?.length || 0} Questions
                                        </span>
                                        <button
                                            onClick={() => navigate(`/lessons/${lesson._id}`)}
                                            className={`btn btn-sm ${completed ? 'btn-outline-primary' : 'btn-primary'} px-3 rounded-pill`}
                                        >
                                            {completed ? 'Review' : 'Start Lesson'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
