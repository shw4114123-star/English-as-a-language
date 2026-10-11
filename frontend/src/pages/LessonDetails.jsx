import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLessonsApi } from '../hooks/useLessonsApi';
import { useProgressApi } from '../hooks/useProgressApi';
import { useWordApi } from '../hooks/useWordApi';

export const LessonDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { currentLesson, fetchLessonById, loading, error } = useLessonsApi();
    const { fetchUpdateProgress } = useProgressApi();
    const { fetchWordDetails, wordData, loading: wordLoading } = useWordApi();

    // שלבי השיעור: 0 = Vocabulary study, 1 = Quiz exercise, 2 = Completed
    const [step, setStep] = useState(0);

    // מילה שנבחרה לפתיחת פרטי מילון (definition + phonetics)
    const [inspectedWord, setInspectedWord] = useState(null);

    // סטייטים של החידון
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [quizScore, setQuizScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [completedNotice, setCompletedNotice] = useState(false);

    useEffect(() => {
        if (id) fetchLessonById(id);
    }, [id]);

    // השמעת קולית של מילה
    const handlePronounce = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.85;
            window.speechSynthesis.speak(utterance);
        }
    };

    // בדיקת הגדרה מילונית באמצעות ה-API
    const handleInspectWord = async (word) => {
        setInspectedWord(word);
        await fetchWordDetails(word);
    };

    // טיפול בבחירת תשובה בחידון
    const handleSelectOption = (index) => {
        setSelectedOption(index);
    };

    // מעבר לשאלה הבאה בחידון
    const handleNextQuestion = async () => {
        const currentQ = currentLesson?.questions?.[currentQuestionIndex];
        const isCorrect = selectedOption === currentQ?.answer;
        const newScore = isCorrect ? quizScore + 1 : quizScore;
        setQuizScore(newScore);
        setSelectedOption(null);

        if (currentQuestionIndex + 1 < (currentLesson?.questions?.length || 0)) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setQuizFinished(true);
            setStep(2); // סימון סיום שיעור

            // שמירת ההתקדמות בשרת (XP + סימון שהשיעור הושלם)
            const res = await fetchUpdateProgress({
                lessonCompleted: id,
                xpToAdd: 50 + (newScore * 10)
            });
            if (res) setCompletedNotice(true);
        }
    };

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status"></div>
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

    const words = currentLesson.words || [];
    const questions = currentLesson.questions || [];

    return (
        <div className="container py-5 max-w-4xl mx-auto fade-in">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/lessons')}>
                    &larr; Back to Lessons
                </button>
                <span className="badge bg-primary px-3 py-2 fs-6 rounded-pill">
                    {currentLesson.level}
                </span>
            </div>

            <h2 className="fw-bold text-dark mb-2">{currentLesson.title}</h2>
            <p className="text-muted fs-5 mb-4">{currentLesson.description}</p>

            {/* Stepper Tabs */}
            <div className="d-flex gap-2 mb-4 border-bottom pb-3">
                <button
                    className={`btn ${step === 0 ? 'btn-primary' : 'btn-light'} rounded-pill px-4`}
                    onClick={() => setStep(0)}
                >
                    1. Vocabulary Study ({words.length})
                </button>
                <button
                    className={`btn ${step === 1 ? 'btn-primary' : 'btn-light'} rounded-pill px-4`}
                    onClick={() => setStep(1)}
                    disabled={questions.length === 0}
                >
                    2. Practice Exercise ({questions.length})
                </button>
            </div>

            {/* STEP 0: VOCABULARY STUDY */}
            {step === 0 && (
                <div>
                    <h4 className="fw-bold mb-3">Key Vocabulary for this Lesson</h4>
                    <div className="row g-3 mb-4">
                        {words.map((w, index) => (
                            <div key={index} className="col-md-6">
                                <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h5 className="fw-bold text-primary mb-0">{w.word}</h5>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-light btn-sm rounded-circle"
                                                onClick={() => handlePronounce(w.word)}
                                                title="Listen to pronunciation"
                                            >
                                                🔊
                                            </button>
                                            <button
                                                className="btn btn-outline-info btn-sm rounded-pill"
                                                onClick={() => handleInspectWord(w.word)}
                                            >
                                                📖 Translate
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-muted mb-1 fs-6">
                                        <strong>Meaning:</strong> {w.translation || w.meaning}
                                    </p>
                                    {w.example && (
                                        <p className="text-secondary small fst-italic mb-0">
                                            "{w.example}"
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Word Dictionary & Translation Modal / Box */}
                    {inspectedWord && (
                        <div className="card border-primary shadow-sm rounded-4 p-4 mb-4 bg-white">
                            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                                <div className="d-flex align-items-center gap-2">
                                    <h5 className="fw-bold text-primary mb-0">
                                        "{inspectedWord}"
                                    </h5>
                                    <button
                                        className="btn btn-outline-primary btn-sm rounded-circle py-0 px-2"
                                        onClick={() => handlePronounce(inspectedWord)}
                                        title="Listen to pronunciation"
                                    >
                                        🔊
                                    </button>
                                </div>
                                <button className="btn-close" onClick={() => setInspectedWord(null)}></button>
                            </div>
                            {wordLoading ? (
                                <div className="d-flex align-items-center gap-2 text-primary py-2">
                                    <div className="spinner-border spinner-border-sm" role="status"></div>
                                    <span>מתרגם ומחפש מידע...</span>
                                </div>
                            ) : wordData ? (
                                <div className="row g-3">
                                    {wordData.translation && (
                                        <div className="col-12">
                                            <div className="p-3 bg-primary-subtle rounded-3">
                                                <span className="text-muted small d-block">תרגום לעברית:</span>
                                                <strong className="fs-5 text-primary">{wordData.translation}</strong>
                                            </div>
                                        </div>
                                    )}
                                    {wordData.phonetic && (
                                        <div className="col-md-6">
                                            <span className="text-muted small d-block">הגייה פונטית (Phonetic):</span>
                                            <span className="fw-semibold text-dark">{wordData.phonetic}</span>
                                        </div>
                                    )}
                                    {wordData.partOfSpeech && (
                                        <div className="col-md-6">
                                            <span className="text-muted small d-block">חלק דיבר (Part of Speech):</span>
                                            <span className="badge bg-secondary-subtle text-secondary px-2 py-1">
                                                {wordData.partOfSpeech}
                                            </span>
                                        </div>
                                    )}
                                    {wordData.definition && (
                                        <div className="col-12">
                                            <span className="text-muted small d-block">הגדרה באנגלית (English Definition):</span>
                                            <p className="mb-0 text-secondary">{wordData.definition}</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-muted mb-0">לא נמצא מידע עבור מילה זו.</p>
                            )}
                        </div>
                    )}

                    {questions.length > 0 && (
                        <div className="d-flex justify-content-end">
                            <button
                                className="btn btn-primary px-4 py-2 rounded-3 shadow-sm"
                                onClick={() => setStep(1)}
                            >
                                Continue to Practice Exercises &rarr;
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* STEP 1: QUIZ EXERCISE */}
            {step === 1 && questions.length > 0 && (
                <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="badge bg-secondary-subtle text-secondary fw-semibold">
                            Exercise {currentQuestionIndex + 1} of {questions.length}
                        </span>
                        <span className="badge bg-info-subtle text-info fw-semibold">
                            Score: {quizScore}
                        </span>
                    </div>

                    <h4 className="fw-bold mb-4 text-dark">
                        {questions[currentQuestionIndex].question}
                    </h4>

                    <div className="space-y-3 mb-4">
                        {questions[currentQuestionIndex].options.map((opt, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => handleSelectOption(idx)}
                                className={`w-full text-start p-3 rounded-3 border transition-all text-base ${
                                    selectedOption === idx
                                        ? 'border-primary bg-primary-subtle text-primary fw-semibold shadow-sm'
                                        : 'border-gray-200 hover:bg-gray-50 text-dark'
                                }`}
                            >
                                <span className="me-3 fw-bold">{String.fromCharCode(65 + idx)}.</span>
                                {opt}
                            </button>
                        ))}
                    </div>

                    <div className="d-flex justify-content-end">
                        <button
                            className="btn btn-primary px-4 py-2 rounded-3"
                            disabled={selectedOption === null}
                            onClick={handleNextQuestion}
                        >
                            {currentQuestionIndex + 1 === questions.length ? 'Complete Lesson' : 'Next Question'}
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 2: LESSON COMPLETED */}
            {step === 2 && (
                <div className="card shadow border-0 rounded-4 p-5 text-center">
                    <div className="text-6xl mb-3">🎓</div>
                    <h2 className="fw-bold mb-2 text-dark">Lesson Completed!</h2>
                    <p className="text-muted fs-5 mb-4">
                        Great job finishing "{currentLesson.title}".
                    </p>

                    <div className="bg-light p-4 rounded-4 mb-4 max-w-md mx-auto">
                        <div className="display-4 fw-bold text-success mb-2">
                            {quizScore} / {questions.length}
                        </div>
                        <div className="text-muted">Correct Answers in Practice</div>
                        <hr className="my-3" />
                        <span className="badge bg-warning text-dark px-3 py-2 fs-6">
                            + {50 + (quizScore * 10)} XP Earned!
                        </span>
                    </div>

                    {completedNotice && (
                        <div className="alert alert-success py-2 max-w-md mx-auto mb-4">
                            ✓ Your lesson progress and XP were saved to your dashboard!
                        </div>
                    )}

                    <div className="d-flex justify-content-center gap-3">
                        <button
                            className="btn btn-primary px-4 py-2 rounded-3"
                            onClick={() => navigate('/lessons')}
                        >
                            Back to All Lessons
                        </button>
                        <button
                            className="btn btn-outline-primary px-4 py-2 rounded-3"
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
