import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLessonsApi } from '../../hooks/useLessonsApi';
import { useProgressApi } from '../../hooks/useProgressApi';
import { UserProgress } from '../../types/progress';
import './Lessons.css';

interface Lesson {
    _id: string;
    title: string;
    description?: string;
    level: string;
    words?: unknown[];
    questions?: unknown[];
}

export const Lessons: React.FC = () => {
    const navigate = useNavigate();
    const { lessons, fetchAllLessons, loading, error } = useLessonsApi();
    const { progress: rawProgress, fetchProgress } = useProgressApi();
    const progress = rawProgress as UserProgress | null;

    const [selectedLevel, setSelectedLevel] = useState<string>('All');

    useEffect(() => {
        fetchAllLessons();
        fetchProgress();
    }, []);

    const filteredLessons: Lesson[] = selectedLevel === 'All'
        ? ((lessons as Lesson[]) || [])
        : ((lessons as Lesson[]) || []).filter((l: Lesson) => l.level === selectedLevel);

    const isCompleted = (lessonId: string) => {
        return Boolean(progress?.completedLessons?.some((id: string) => String(id) === String(lessonId)));
    };

    const typedLessons = (lessons as Lesson[]) || [];
    const completedCount = typedLessons.filter(l => isCompleted(l._id)).length;
    const progressPercent = typedLessons.length > 0 ? Math.round((completedCount / typedLessons.length) * 100) : 0;

    return (
        <div className="container py-5 fade-in">
            {/* Overall Course Progress Banner */}
            {typedLessons.length > 0 && (
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 text-white" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)' }}>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div>
                            <div className="d-flex align-items-center gap-2 mb-1">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <circle cx="12" cy="12" r="6" />
                                    <circle cx="12" cy="12" r="2" />
                                </svg>
                                <h5 className="fw-bold mb-0">Course Completion Progress</h5>
                            </div>
                            <p className="text-white-50 mb-0 small">
                                You have completed <strong className="text-white">{completedCount}</strong> of <strong className="text-white">{typedLessons.length}</strong> lessons ({progressPercent}%)
                            </p>
                        </div>
                        <div className="d-flex align-items-center gap-3" style={{ minWidth: '220px' }}>
                            <div className="progress flex-grow-1 bg-white bg-opacity-25" style={{ height: '10px', borderRadius: '10px' }}>
                                <div
                                    className="progress-bar bg-warning progress-bar-striped progress-bar-animated"
                                    role="progressbar"
                                    style={{ width: `${progressPercent}%` }}
                                    aria-valuenow={progressPercent}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                ></div>
                            </div>
                            <span className="fw-bold text-warning">{progressPercent}%</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h2 className="lessons-title mb-1">Interactive Lessons</h2>
                    <p style={{ color: 'var(--text-secondary, #475569)', marginBottom: 0 }}>Learn vocabulary, grammar rules, and complete practice exercises.</p>
                </div>

                <div style={{ display: 'inline-flex' }} role="group">
                    {['All', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                        <button
                            key={lvl}
                            type="button"
                            className={`lessons-filter-btn ${selectedLevel === lvl ? 'lessons-filter-btn-active' : ''}`}
                            onClick={() => setSelectedLevel(lvl)}
                        >
                            {lvl}
                        </button>
                    ))}
                </div>
            </div>

            {loading && (
                <div className="text-center py-5">
                    <div style={{ color: 'var(--text-secondary, #475569)', fontSize: '1.2rem' }}>Loading Lessons...</div>
                </div>
            )}

            {error && (
                <div className="alert alert-danger mb-4">{error}</div>
            )}

            {!loading && filteredLessons.length === 0 && (
                <div className="card p-5 text-center text-muted" style={{ background: '#ffffff', border: '1.5px solid var(--border-colored, #b6c5f7)' }}>
                    <div style={{ width: '60px', height: '60px', margin: '0 auto 1rem', background: 'var(--palette-ice)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        </svg>
                    </div>
                    <h4 style={{ color: 'var(--text-main, #2b3650)' }}>No lessons found for this level</h4>
                    <p style={{ color: 'var(--text-secondary, #475569)' }}>New lessons will be added soon by teachers!</p>
                </div>
            )}

            <div className="row g-4">
                {filteredLessons.map((lesson) => {
                    const completed = isCompleted(lesson._id);
                    return (
                        <div key={lesson._id} className="col-md-6 col-lg-4">
                            <div className="lesson-card">
                                <div className="card-body p-4 d-flex flex-column h-100">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            lesson.level === 'Beginner' ? 'badge-beginner' :
                                             lesson.level === 'Intermediate' ? 'badge-intermediate' :
                                            'badge-advanced'
                                        }`}>
                                            {lesson.level}
                                        </span>
                                        {completed && (
                                            <span className="badge-completed px-2 py-1 rounded-full text-xs font-semibold">
                                                Completed
                                            </span>
                                        )}
                                    </div>

                                    <h4 className="fw-bold mb-2" style={{ fontSize: '1.25rem', color: 'var(--text-main, #2b3650)' }}>{lesson.title}</h4>
                                    <p style={{ color: 'var(--text-secondary, #475569)', flexGrow: 1, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                        {lesson.description || 'Step-by-step English exercises with words and practice quiz.'}
                                    </p>

                                    <div className="d-flex justify-content-between align-items-center pt-3" style={{ borderTop: '1px solid var(--border-subtle, #e2e8f4)' }}>
                                        <span style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.85rem' }}>
                                            {lesson.words?.length || 0} Words • {lesson.questions?.length || 0} Questions
                                        </span>
                                        <button
                                            onClick={() => navigate(`/lessons/${lesson._id}`)}
                                            className={completed ? 'btn-review-lesson' : 'btn-start-lesson'}
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
export default Lessons;
