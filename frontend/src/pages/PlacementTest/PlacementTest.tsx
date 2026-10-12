import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useProgressApi } from '../../hooks/useProgressApi';
import './PlacementTest.css';

interface Question {
    id: number;
    question: string;
    options: string[];
    answer: number;
    level: string;
}

const QUESTIONS: Question[] = [
    {
        id: 1,
        question: "Choose the correct sentence:",
        options: [
            "She go to school every day.",
            "She goes to school every day.",
            "She going to school every day.",
            "She gone to school every day."
        ],
        answer: 1,
        level: "Beginner"
    },
    {
        id: 2,
        question: "What is the opposite of 'Ancient'?",
        options: [
            "Old",
            "Modern",
            "Historic",
            "Antique"
        ],
        answer: 1,
        level: "Beginner"
    },
    {
        id: 3,
        question: "If I _______ more time, I would learn a new language.",
        options: [
            "have",
            "had",
            "will have",
            "am having"
        ],
        answer: 1,
        level: "Intermediate"
    },
    {
        id: 4,
        question: "Which word means 'able to withstand or recover quickly from difficult conditions'?",
        options: [
            "Fragile",
            "Resilient",
            "Rigid",
            "Vulnerable"
        ],
        answer: 1,
        level: "Intermediate"
    },
    {
        id: 5,
        question: "Hardly _______ the station when the train pulled in.",
        options: [
            "had we reached",
            "we had reached",
            "did we reached",
            "we reached"
        ],
        answer: 0,
        level: "Advanced"
    },
    {
        id: 6,
        question: "The CEO was accused of being _______ when she refused to change her flawed plan.",
        options: [
            "Obstinate",
            "Compliant",
            "Magnanimous",
            "Gregarious"
        ],
        answer: 0,
        level: "Advanced"
    }
];

export const PlacementTest: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const { fetchUpdateProgress, loading } = useProgressApi();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [saveResult, setSaveResult] = useState(false);

    const currentQuestion = QUESTIONS[currentQuestionIndex];

    const handleSelectOption = (index: number) => {
        setSelectedOption(index);
    };

    const handleNext = async () => {
        const isCorrect = selectedOption === currentQuestion.answer;
        const newScore = isCorrect ? score + 1 : score;
        setScore(newScore);
        setSelectedOption(null);

        if (currentQuestionIndex + 1 < QUESTIONS.length) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setIsFinished(true);
            const percentage = Math.round((newScore / QUESTIONS.length) * 100);
            
            if (isAuthenticated) {
                const res = await fetchUpdateProgress({
                    placementTestScore: percentage,
                    xpToAdd: newScore * 20
                });
                if (res) setSaveResult(true);
            }
        }
    };

    const percentage = Math.round((score / QUESTIONS.length) * 100);

    let assignedLevel = "Beginner";
    if (percentage > 80) assignedLevel = "Advanced";
    else if (percentage > 50) assignedLevel = "Intermediate";

    if (isFinished) {
        return (
            <div className="container py-5 max-w-2xl mx-auto fade-in">
                <div className="test-card text-center">
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                    <h2 className="fw-bold mb-3 text-white">Placement Test Completed!</h2>
                    <p style={{ color: '#c4b5fd', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Here are your diagnostic results:</p>

                    <div style={{ background: '#19123f', padding: '1.5rem', borderRadius: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '3rem', fontWeight: 800, color: '#c084fc', marginBottom: '0.5rem' }}>{percentage}%</div>
                        <div style={{ color: '#c4b5fd' }}>You answered {score} out of {QUESTIONS.length} correctly.</div>
                        <hr style={{ borderColor: 'rgba(168, 85, 247, 0.2)', margin: '1rem 0' }} />
                        <div style={{ fontSize: '1.1rem' }}>
                            Assigned Level: <span style={{ background: '#059669', color: '#ffffff', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontWeight: 600 }}>{assignedLevel}</span>
                        </div>
                    </div>

                    {isAuthenticated ? (
                        saveResult ? (
                            <div className="alert" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                                Result saved to your dashboard! XP added.
                            </div>
                        ) : loading ? (
                            <div style={{ color: '#c4b5fd', marginBottom: '1rem' }}>Saving results...</div>
                        ) : null
                    ) : (
                        <div className="alert" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', border: '1px solid rgba(59, 130, 246, 0.4)' }}>
                            Want to save your progress and level? Please register or login!
                        </div>
                    )}

                    <div className="d-flex justify-content-center gap-3">
                        <button
                            className="test-submit-btn"
                            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
                        >
                            {isAuthenticated ? 'Go to Dashboard' : 'Create an Account'}
                        </button>
                        <button
                            className="btn btn-outline-secondary rounded-pill px-4"
                            onClick={() => {
                                setCurrentQuestionIndex(0);
                                setSelectedOption(null);
                                setScore(0);
                                setIsFinished(false);
                                setSaveResult(false);
                            }}
                        >
                            Retake Test
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5 max-w-2xl mx-auto fade-in">
            <div className="test-card">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <span style={{ color: '#a78bfa', fontSize: '0.9rem', fontWeight: 600 }}>
                        Question {currentQuestionIndex + 1} of {QUESTIONS.length}
                    </span>
                    <span style={{ background: 'rgba(147, 51, 234, 0.3)', color: '#e9d5ff', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 600 }}>
                        Level: {currentQuestion.level}
                    </span>
                </div>

                <div className="test-progress-bar">
                    <div
                        className="test-progress-fill"
                        style={{ width: `${((currentQuestionIndex) / QUESTIONS.length) * 100}%` }}
                    ></div>
                </div>

                <h4 className="fw-bold mb-4 text-white" style={{ fontSize: '1.35rem' }}>{currentQuestion.question}</h4>

                <div className="mb-5">
                    {currentQuestion.options.map((opt, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectOption(idx)}
                            className={`test-option-btn ${selectedOption === idx ? 'test-option-selected' : ''}`}
                        >
                            <span style={{ fontWeight: 700, marginRight: '0.75rem', color: '#c084fc' }}>{String.fromCharCode(65 + idx)}.</span>
                            <span>{opt}</span>
                        </button>
                    ))}
                </div>

                <div className="d-flex justify-content-end">
                    <button
                        className="test-submit-btn"
                        disabled={selectedOption === null || loading}
                        onClick={handleNext}
                    >
                        {currentQuestionIndex + 1 === QUESTIONS.length ? 'Finish Test' : 'Next Question'}
                    </button>
                </div>
            </div>
        </div>
    );
};
export default PlacementTest;
