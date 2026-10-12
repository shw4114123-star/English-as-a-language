import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLessonsApi } from '../../hooks/useLessonsApi';
import { useProgressApi } from '../../hooks/useProgressApi';
import { useWordApi } from '../../hooks/useWordApi';
import './LessonDetails.css';

interface WordItem {
    word: string;
    translation?: string;
    meaning?: string;
    example?: string;
}

interface QuestionItem {
    question: string;
    options: string[];
    answer: number;
}

interface LessonModel {
    _id: string;
    title: string;
    description?: string;
    level: string;
    words?: WordItem[];
    questions?: QuestionItem[];
}

interface WordDataModel {
    word?: string;
    translation?: string;
    phonetic?: string;
    partOfSpeech?: string;
    definition?: string;
}

export const LessonDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { currentLesson: rawCurrentLesson, fetchLessonById, loading, error } = useLessonsApi();
    const { fetchUpdateProgress } = useProgressApi();
    const { fetchWordDetails, wordData: rawWordData, loading: wordLoading } = useWordApi();

    const currentLesson = rawCurrentLesson as LessonModel | null;
    const wordData = rawWordData as WordDataModel | null;

    const [step, setStep] = useState(0);
    const [inspectedWord, setInspectedWord] = useState<string | null>(null);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [quizScore, setQuizScore] = useState(0);
    const [completedNotice, setCompletedNotice] = useState(false);

    useEffect(() => {
        if (id) fetchLessonById(id);
    }, [id]);

    const handlePronounce = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.85;
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleInspectWord = async (word: string) => {
        setInspectedWord(word);
        await fetchWordDetails(word);
    };

    const handleSelectOption = (index: number) => {
        setSelectedOption(index);
    };

    const handleNextQuestion = async () => {
        const currentQ = currentLesson?.questions?.[currentQuestionIndex];
        const isCorrect = selectedOption === currentQ?.answer;
        const newScore = isCorrect ? quizScore + 1 : quizScore;
        setQuizScore(newScore);
        setSelectedOption(null);

        if (currentQuestionIndex + 1 < (currentLesson?.questions?.length || 0)) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setStep(2);

            if (id) {
                const res = await fetchUpdateProgress({
                    lessonCompleted: id,
                    xpToAdd: 50 + (newScore * 10)
                });
                if (res) setCompletedNotice(true);
            }
        }
    };

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div style={{ color: '#c4b5fd', fontSize: '1.2rem' }}>Loading lesson details...</div>
            </div>
        );
    }

    if (error || !currentLesson) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">{error || 'Lesson not found'}</div>
                <button className="btn btn-primary" onClick={() => navigate('/lessons')}>
                    &larr; Back to Lessons
                </button>
            </div>
        );
    }

    const words: WordItem[] = currentLesson.words || [];
    const questions: QuestionItem[] = currentLesson.questions || [];

    return (
        <div className="container py-5 max-w-4xl mx-auto fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <button className="btn btn-outline-secondary btn-sm rounded-pill" onClick={() => navigate('/lessons')}>
                    &larr; Back to Lessons
                </button>
                <span className="badge" style={{ background: '#7c3aed', color: '#ffffff', padding: '0.4rem 1rem', borderRadius: '9999px' }}>
                    {currentLesson.level}
                </span>
            </div>

            <h2 className="fw-bold mb-2 text-white" style={{ fontSize: '2rem' }}>{currentLesson.title}</h2>
            <p style={{ color: '#c4b5fd', fontSize: '1.1rem', marginBottom: '1.5rem' }}>{currentLesson.description}</p>

            <div className="d-flex gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid rgba(168, 85, 247, 0.2)' }}>
                <button
                    className={`lesson-step-btn ${step === 0 ? 'lesson-step-btn-active' : ''}`}
                    onClick={() => setStep(0)}
                >
                    1. Vocabulary Study ({words.length})
                </button>
                <button
                    className={`lesson-step-btn ${step === 1 ? 'lesson-step-btn-active' : ''}`}
                    onClick={() => setStep(1)}
                    disabled={questions.length === 0}
                >
                    2. Practice Exercise ({questions.length})
                </button>
            </div>

            {step === 0 && (
                <div>
                    <h4 className="fw-bold mb-3 text-white">Key Vocabulary for this Lesson</h4>
                    <div className="row g-3 mb-4">
                        {words.map((w, index) => (
                            <div key={index} className="col-md-6">
                                <div className="lesson-word-card h-100">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h5 className="lesson-word-title mb-0">{w.word}</h5>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="lesson-action-icon-btn"
                                                onClick={() => handlePronounce(w.word)}
                                                title="Listen to pronunciation"
                                            >
                                                🔊
                                            </button>
                                            <button
                                                className="btn btn-outline-secondary btn-sm rounded-pill"
                                                style={{ borderColor: 'rgba(168, 85, 247, 0.4)', color: '#c084fc', fontSize: '0.8rem' }}
                                                onClick={() => handleInspectWord(w.word)}
                                            >
                                                Translate
                                            </button>
                                        </div>
                                    </div>
                                    <p style={{ color: '#c4b5fd', marginBottom: '0.25rem', fontSize: '0.95rem' }}>
                                        <strong>Meaning:</strong> {w.translation || w.meaning}
                                    </p>
                                    {w.example && (
                                        <p style={{ color: '#a78bfa', fontSize: '0.85rem', fontStyle: 'italic', margin: 0 }}>
                                            "{w.example}"
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {inspectedWord && (
                        <div className="card p-4 mb-4" style={{ background: '#19123f', borderColor: '#a855f7' }}>
                            <div className="d-flex justify-content-between align-items-center mb-3 pb-2" style={{ borderBottom: '1px solid rgba(168, 85, 247, 0.2)' }}>
                                <div className="d-flex align-items-center gap-2">
                                    <h5 className="fw-bold mb-0" style={{ color: '#c084fc' }}>
                                        "{inspectedWord}"
                                    </h5>
                                    <button
                                        className="lesson-action-icon-btn"
                                        onClick={() => handlePronounce(inspectedWord)}
                                        title="Listen to pronunciation"
                                    >
                                        🔊
                                    </button>
                                </div>
                                <button
                                    onClick={() => setInspectedWord(null)}
                                    style={{ background: 'transparent', border: 'none', color: '#c4b5fd', fontSize: '1.25rem', cursor: 'pointer' }}
                                >
                                    &times;
                                </button>
                            </div>
                            {wordLoading ? (
                                <div style={{ color: '#c4b5fd', padding: '0.5rem 0' }}>
                                    <span>מתרגם ומחפש מידע...</span>
                                </div>
                            ) : wordData ? (
                                <div className="row g-3">
                                    {wordData.translation && (
                                        <div className="col-12">
                                            <div style={{ padding: '0.75rem', background: 'rgba(147, 51, 234, 0.15)', borderRadius: '0.5rem' }}>
                                                <span style={{ color: '#a78bfa', fontSize: '0.8rem', display: 'block' }}>תרגום לעברית:</span>
                                                <strong style={{ fontSize: '1.2rem', color: '#ffffff' }}>{wordData.translation}</strong>
                                            </div>
                                        </div>
                                    )}
                                    {wordData.phonetic && (
                                        <div className="col-md-6">
                                            <span style={{ color: '#a78bfa', fontSize: '0.8rem', display: 'block' }}>הגייה פונטית (Phonetic):</span>
                                            <span style={{ fontWeight: 600, color: '#f1f0fb' }}>{wordData.phonetic}</span>
                                        </div>
                                    )}
                                    {wordData.partOfSpeech && (
                                        <div className="col-md-6">
                                            <span style={{ color: '#a78bfa', fontSize: '0.8rem', display: 'block' }}>חלק דיבר (Part of Speech):</span>
                                            <span style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                                                {wordData.partOfSpeech}
                                            </span>
                                        </div>
                                    )}
                                    {wordData.definition && (
                                        <div className="col-12">
                                            <span style={{ color: '#a78bfa', fontSize: '0.8rem', display: 'block' }}>הגדרה באנגלית (English Definition):</span>
                                            <p style={{ margin: 0, color: '#c4b5fd' }}>{wordData.definition}</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p style={{ color: '#8b7cb8', margin: 0 }}>לא נמצא מידע עבור מילה זו.</p>
                            )}
                        </div>
                    )}

                    {questions.length > 0 && (
                        <div className="d-flex justify-content-end">
                            <button
                                className="btn btn-primary px-4 py-2 rounded-pill"
                                style={{ background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)', border: 'none', fontWeight: 700 }}
                                onClick={() => setStep(1)}
                            >
                                Continue to Practice Exercises &rarr;
                            </button>
                        </div>
                    )}
                </div>
            )}

            {step === 1 && questions.length > 0 && (
                <div className="card p-4 p-md-5" style={{ background: '#140d36', borderColor: 'rgba(168, 85, 247, 0.3)' }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <span style={{ color: '#a78bfa', fontWeight: 600 }}>
                            Exercise {currentQuestionIndex + 1} of {questions.length}
                        </span>
                        <span style={{ color: '#c084fc', fontWeight: 600 }}>
                            Score: {quizScore}
                        </span>
                    </div>

                    {/* Progress Bar for Quiz */}
                    <div className="progress-bar-container mb-4" style={{ height: '8px' }}>
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%` }}
                        ></div>
                    </div>

                    <h4 className="fw-bold mb-4 text-white">
                        {questions[currentQuestionIndex].question}
                    </h4>

                    <div className="mb-4">
                        {questions[currentQuestionIndex].options.map((opt, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => handleSelectOption(idx)}
                                className={`w-100 text-start p-3 rounded-3 mb-2 transition-all ${
                                    selectedOption === idx
                                        ? 'bg-purple-900 border-purple-400 text-white font-semibold'
                                        : 'bg-gray-900 border-gray-700 text-gray-200'
                                }`}
                                style={{
                                    display: 'block',
                                    border: selectedOption === idx ? '1.5px solid #c084fc' : '1px solid rgba(168, 85, 247, 0.3)',
                                    background: selectedOption === idx ? 'rgba(147, 51, 234, 0.4)' : '#19123f',
                                    color: '#ffffff',
                                    cursor: 'pointer'
                                }}
                            >
                                <span style={{ marginRight: '0.75rem', fontWeight: 700, color: '#c084fc' }}>{String.fromCharCode(65 + idx)}.</span>
                                {opt}
                            </button>
                        ))}
                    </div>

                    <div className="d-flex justify-content-end">
                        <button
                            className="btn btn-primary px-4 py-2 rounded-pill"
                            style={{ background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)', border: 'none', fontWeight: 700 }}
                            disabled={selectedOption === null}
                            onClick={handleNextQuestion}
                        >
                            {currentQuestionIndex + 1 === questions.length ? 'Complete Lesson' : 'Next Question'}
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="card p-5 text-center" style={{ background: '#140d36', borderColor: 'rgba(168, 85, 247, 0.3)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎓</div>
                    <h2 className="fw-bold mb-2 text-white">Lesson Completed!</h2>
                    <p style={{ color: '#c4b5fd', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                        Great job finishing "{currentLesson.title}".
                    </p>

                    <div style={{ background: '#19123f', padding: '1.5rem', borderRadius: '1rem', maxWidth: '380px', margin: '0 auto 1.5rem' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10b981', marginBottom: '0.5rem' }}>
                            {quizScore} / {questions.length}
                        </div>
                        <div style={{ color: '#c4b5fd' }}>Correct Answers in Practice</div>
                        <hr style={{ borderColor: 'rgba(168, 85, 247, 0.2)', margin: '1rem 0' }} />
                        <span style={{ background: '#f59e0b', color: '#0b0720', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontWeight: 700 }}>
                            + {50 + (quizScore * 10)} XP Earned!
                        </span>
                    </div>

                    {completedNotice && (
                        <div className="alert" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', border: '1px solid rgba(16, 185, 129, 0.4)', maxWidth: '380px', margin: '0 auto 1.5rem' }}>
                            ✓ Your lesson progress and XP were saved to your dashboard!
                        </div>
                    )}

                    <div className="d-flex justify-content-center gap-3">
                        <button
                            className="btn btn-primary px-4 py-2 rounded-pill"
                            style={{ background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)', border: 'none', fontWeight: 700 }}
                            onClick={() => navigate('/lessons')}
                        >
                            Back to All Lessons
                        </button>
                        <button
                            className="btn btn-outline-secondary px-4 py-2 rounded-pill"
                            onClick={() => navigate('/dashboard')}
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
export default LessonDetails;
