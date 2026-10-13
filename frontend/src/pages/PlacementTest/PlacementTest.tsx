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
    // ----------------------------------------------------
    // Section 1: Beginner Level (Foundation & A1-A2)
    // ----------------------------------------------------
    {
        id: 1,
        question: "Choose the grammatically correct sentence:",
        options: [
            "She don't like drinking coffee in the morning.",
            "She doesn't likes drinking coffee in the morning.",
            "She doesn't like drinking coffee in the morning.",
            "She isn't like drinking coffee in the morning."
        ],
        answer: 2,
        level: "Beginner"
    },
    {
        id: 2,
        question: "Where _______ your sister work?",
        options: [
            "is",
            "do",
            "does",
            "are"
        ],
        answer: 2,
        level: "Beginner"
    },
    {
        id: 3,
        question: "I usually wake up early _______ weekdays, but _______ Sunday I sleep late.",
        options: [
            "at / on",
            "on / on",
            "in / at",
            "on / in"
        ],
        answer: 1,
        level: "Beginner"
    },
    {
        id: 4,
        question: "What is the opposite of the word 'Generous'?",
        options: [
            "Selfish",
            "Polite",
            "Brave",
            "Modest"
        ],
        answer: 0,
        level: "Beginner"
    },
    {
        id: 5,
        question: "Yesterday, I _______ my keys on the kitchen counter and couldn't find them all day.",
        options: [
            "leave",
            "left",
            "have left",
            "was leaving"
        ],
        answer: 1,
        level: "Beginner"
    },
    {
        id: 6,
        question: "Stranger: 'Excuse me, could you tell me the way to the library?' — How would you answer?",
        options: [
            "Yes, I like reading very much.",
            "Sure, go straight ahead and take the first right.",
            "No problem, it was yesterday.",
            "Never mind, I don't know it."
        ],
        answer: 1,
        level: "Beginner"
    },

    // ----------------------------------------------------
    // Section 2: Intermediate Level (B1-B2 Competence)
    // ----------------------------------------------------
    {
        id: 7,
        question: "By the time we arrived at the cinema, the movie _______.",
        options: [
            "already started",
            "had already started",
            "has already started",
            "was already starting"
        ],
        answer: 1,
        level: "Intermediate"
    },
    {
        id: 8,
        question: "If I _______ more free time, I would join a sports club.",
        options: [
            "have",
            "had",
            "will have",
            "would have"
        ],
        answer: 1,
        level: "Intermediate"
    },
    {
        id: 9,
        question: "Could you please _______ the music? I'm trying to concentrate on my study.",
        options: [
            "turn off to",
            "turn down",
            "turn up",
            "turn in"
        ],
        answer: 1,
        level: "Intermediate"
    },
    {
        id: 10,
        question: "The new suspension bridge _______ by thousands of commuters every morning.",
        options: [
            "is crossed",
            "crosses",
            "is crossing",
            "was crossed by"
        ],
        answer: 0,
        level: "Intermediate"
    },
    {
        id: 11,
        question: "She has always been deeply committed _______ helping underprivileged students.",
        options: [
            "for",
            "with",
            "to",
            "about"
        ],
        answer: 2,
        level: "Intermediate"
    },
    {
        id: 12,
        question: "Look at those dark clouds! It _______ rain any minute now.",
        options: [
            "is going to",
            "ought",
            "shall to",
            "is used to"
        ],
        answer: 0,
        level: "Intermediate"
    },
    {
        id: 13,
        question: "He apologized for _______ late to the executive briefing.",
        options: [
            "arrive",
            "to arrive",
            "arriving",
            "having arrive"
        ],
        answer: 2,
        level: "Intermediate"
    },
    {
        id: 14,
        question: "If she had received the invitation in time, she _______ to the ceremony.",
        options: [
            "would come",
            "would have come",
            "will have come",
            "had come"
        ],
        answer: 1,
        level: "Intermediate"
    },

    // ----------------------------------------------------
    // Section 3: Advanced Level (C1-C2 Mastery)
    // ----------------------------------------------------
    {
        id: 15,
        question: "Hardly _______ into the conference room when the presentation began.",
        options: [
            "we had stepped",
            "had we stepped",
            "did we stepped",
            "we stepped"
        ],
        answer: 1,
        level: "Advanced"
    },
    {
        id: 16,
        question: "Had I known about the severe flight cancellations, I _______ alternative travel arrangements.",
        options: [
            "would make",
            "would have made",
            "will have made",
            "had made"
        ],
        answer: 1,
        level: "Advanced"
    },
    {
        id: 17,
        question: "It is crucial that every candidate _______ their credentials prior to the deadline.",
        options: [
            "submit",
            "submits",
            "will submit",
            "is submitting"
        ],
        answer: 0,
        level: "Advanced"
    },
    {
        id: 18,
        question: "The politician gave an intentionally _______ reply to avoid taking a controversial stance.",
        options: [
            "meticulous",
            "pragmatic",
            "ambiguous",
            "conspicuous"
        ],
        answer: 2,
        level: "Advanced"
    },
    {
        id: 19,
        question: "Years of rigorous laboratory experiments finally bore _______ with this groundbreaking medical discovery.",
        options: [
            "fruit",
            "seed",
            "harvest",
            "grain"
        ],
        answer: 0,
        level: "Advanced"
    },
    {
        id: 20,
        question: "If he were more detail-oriented, he _______ that critical accounting error yesterday.",
        options: [
            "wouldn't make",
            "wouldn't have made",
            "hadn't made",
            "won't have made"
        ],
        answer: 1,
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
                    xpToAdd: newScore * 10
                });
                if (res) setSaveResult(true);
            }
        }
    };

    const percentage = Math.round((score / QUESTIONS.length) * 100);

    let assignedLevel = "Beginner";
    if (percentage >= 75) assignedLevel = "Advanced";
    else if (percentage >= 45) assignedLevel = "Intermediate";

    if (isFinished) {
        return (
            <div className="container py-5 max-w-2xl mx-auto fade-in">
                <div className="test-card text-center">
                    <div style={{ width: '64px', height: '64px', margin: '0 auto 1.25rem', background: 'var(--palette-ice, #eef1ff)', border: '1.5px solid var(--border-colored, #b6c5f7)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary, #5457cd)' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <h2 className="fw-bold mb-3" style={{ color: 'var(--text-main, #2b3650)' }}>Placement Test Completed!</h2>
                    <p style={{ color: 'var(--text-secondary, #475569)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Here are your diagnostic results:</p>

                    <div style={{ background: 'var(--palette-ice, #eef1ff)', border: '1.5px solid var(--border-colored, #b6c5f7)', padding: '1.5rem', borderRadius: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-primary, #5457cd)', marginBottom: '0.5rem' }}>{percentage}%</div>
                        <div style={{ color: 'var(--text-secondary, #475569)' }}>You answered {score} out of {QUESTIONS.length} correctly.</div>
                        <hr style={{ borderColor: 'var(--border-colored, #b6c5f7)', margin: '1rem 0' }} />
                        <div style={{ fontSize: '1.1rem', color: 'var(--text-main, #2b3650)' }}>
                            Assigned Level: <span style={{ background: '#059669', color: '#ffffff', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontWeight: 600 }}>{assignedLevel}</span>
                        </div>
                    </div>

                    {isAuthenticated ? (
                        saveResult ? (
                            <div className="alert alert-success">
                                Result saved to your dashboard! XP added.
                            </div>
                        ) : loading ? (
                            <div style={{ color: 'var(--text-secondary, #475569)', marginBottom: '1rem' }}>Saving results...</div>
                        ) : null
                    ) : (
                        <div className="alert" style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
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
                    <span style={{ color: 'var(--text-secondary, #475569)', fontSize: '0.9rem', fontWeight: 600 }}>
                        Question {currentQuestionIndex + 1} of {QUESTIONS.length}
                    </span>
                    <span style={{ background: 'var(--palette-ice, #eef1ff)', color: 'var(--color-primary, #5457cd)', border: '1px solid var(--border-colored, #b6c5f7)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 600 }}>
                        Level: {currentQuestion.level}
                    </span>
                </div>

                <div className="test-progress-bar">
                    <div
                        className="test-progress-fill"
                        style={{ width: `${((currentQuestionIndex) / QUESTIONS.length) * 100}%` }}
                    ></div>
                </div>

                <h4 className="fw-bold mb-4" style={{ fontSize: '1.35rem', color: 'var(--text-main, #2b3650)' }}>{currentQuestion.question}</h4>

                <div className="mb-5">
                    {currentQuestion.options.map((opt, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectOption(idx)}
                            className={`test-option-btn ${selectedOption === idx ? 'test-option-selected' : ''}`}
                        >
                            <span style={{ fontWeight: 700, marginRight: '0.75rem', color: 'var(--color-primary, #5457cd)' }}>{String.fromCharCode(65 + idx)}.</span>
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
