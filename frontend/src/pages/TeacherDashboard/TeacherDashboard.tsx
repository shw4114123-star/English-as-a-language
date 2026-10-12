import React, { useEffect, useState } from 'react';
import { useLessonsApi } from '../../hooks/useLessonsApi';
import './TeacherDashboard.css';

interface LessonWord {
    word: string;
    translation: string;
    meaning?: string;
    example?: string;
}

interface LessonQuestion {
    question: string;
    options: string[];
    answer: number;
}

interface LessonItem {
    _id: string;
    title: string;
    description?: string;
    level: string;
    words?: unknown[];
    questions?: unknown[];
}

export const TeacherDashboard: React.FC = () => {
    const { lessons, fetchAllLessons, fetchCreateLesson, loading, error } = useLessonsApi();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [level, setLevel] = useState('Beginner');

    const [wordInput, setWordInput] = useState('');
    const [translationInput, setTranslationInput] = useState('');
    const [meaningInput, setMeaningInput] = useState('');
    const [exampleInput, setExampleInput] = useState('');
    const [wordsList, setWordsList] = useState<LessonWord[]>([]);

    const [questionText, setQuestionText] = useState('');
    const [opt0, setOpt0] = useState('');
    const [opt1, setOpt1] = useState('');
    const [opt2, setOpt2] = useState('');
    const [opt3, setOpt3] = useState('');
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
    const [questionsList, setQuestionsList] = useState<LessonQuestion[]>([]);

    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchAllLessons();
    }, []);

    const handleAddWord = () => {
        if (!wordInput || !translationInput) return;
        setWordsList(prev => [
            ...prev,
            { word: wordInput, translation: translationInput, meaning: meaningInput, example: exampleInput }
        ]);
        setWordInput('');
        setTranslationInput('');
        setMeaningInput('');
        setExampleInput('');
    };

    const handleRemoveWord = (index: number) => {
        setWordsList(prev => prev.filter((_, i) => i !== index));
    };

    const handleAddQuestion = () => {
        if (!questionText || !opt0 || !opt1) return;
        setQuestionsList(prev => [
            ...prev,
            {
                question: questionText,
                options: [opt0, opt1, opt2 || 'None', opt3 || 'None'],
                answer: Number(correctAnswerIndex)
            }
        ]);
        setQuestionText('');
        setOpt0('');
        setOpt1('');
        setOpt2('');
        setOpt3('');
        setCorrectAnswerIndex(0);
    };

    const handleRemoveQuestion = (index: number) => {
        setQuestionsList(prev => prev.filter((_, i) => i !== index));
    };

    const handleCreateLessonSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) return;

        const res = await fetchCreateLesson({
            title,
            description,
            level,
            words: wordsList,
            questions: questionsList
        });

        if (res) {
            setStatusMessage('Lesson created successfully!');
            setTitle('');
            setDescription('');
            setLevel('Beginner');
            setWordsList([]);
            setQuestionsList([]);
            fetchAllLessons();
            setTimeout(() => setStatusMessage(null), 3500);
        }
    };

    return (
        <div className="container py-5 fade-in">
            <div className="mb-4">
                <h2 className="fw-bold mb-1" style={{
                    fontSize: '2rem',
                    background: 'linear-gradient(135deg, #ffffff 0%, #d8b4fe 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Teacher Studio & Curriculum Creator
                </h2>
                <p style={{ color: '#c4b5fd' }}>Author new English lessons, create vocabulary lists, and publish interactive quizzes.</p>
            </div>

            {statusMessage && <div className="alert alert-success">{statusMessage}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row g-4">
                <div className="col-lg-7">
                    <div className="card p-4 p-md-5" style={{ background: '#140d36', borderColor: 'rgba(168, 85, 247, 0.25)' }}>
                        <h4 className="fw-bold mb-4 text-white">Create New Lesson</h4>

                        <form onSubmit={handleCreateLessonSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Lesson Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. Travel & Flight Vocabulary"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    rows={2}
                                    placeholder="Brief explanation of what students will learn..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label">Target Level</label>
                                <select
                                    className="form-control"
                                    value={level}
                                    onChange={(e) => setLevel(e.target.value)}
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>

                            <div className="teacher-section-box">
                                <h6 className="fw-bold mb-3" style={{ color: '#c084fc' }}>Add Vocabulary Words ({wordsList.length})</h6>
                                <div className="row g-2 mb-2">
                                    <div className="col-md-6">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="English Word (e.g. Airport)"
                                            value={wordInput}
                                            onChange={(e) => setWordInput(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Hebrew Translation (e.g. נמל תעופה)"
                                            value={translationInput}
                                            onChange={(e) => setTranslationInput(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Meaning / Definition"
                                            value={meaningInput}
                                            onChange={(e) => setMeaningInput(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Example Sentence"
                                            value={exampleInput}
                                            onChange={(e) => setExampleInput(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary rounded-pill px-3 py-1 btn-sm"
                                    style={{ borderColor: '#a855f7', color: '#e9d5ff' }}
                                    onClick={handleAddWord}
                                >
                                    + Add Word to Lesson
                                </button>

                                {wordsList.length > 0 && (
                                    <div className="mt-3">
                                        {wordsList.map((w, idx) => (
                                            <div key={idx} className="teacher-item-row">
                                                <span><strong>{w.word}</strong> - {w.translation}</span>
                                                <button
                                                    type="button"
                                                    style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer' }}
                                                    onClick={() => handleRemoveWord(idx)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="teacher-section-box">
                                <h6 className="fw-bold mb-3" style={{ color: '#c084fc' }}>Add Quiz Questions ({questionsList.length})</h6>
                                <div className="mb-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Question Prompt"
                                        value={questionText}
                                        onChange={(e) => setQuestionText(e.target.value)}
                                    />
                                </div>
                                <div className="row g-2 mb-2">
                                    <div className="col-6">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Option A (Index 0)"
                                            value={opt0}
                                            onChange={(e) => setOpt0(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Option B (Index 1)"
                                            value={opt1}
                                            onChange={(e) => setOpt1(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Option C (Index 2)"
                                            value={opt2}
                                            onChange={(e) => setOpt2(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Option D (Index 3)"
                                            value={opt3}
                                            onChange={(e) => setOpt3(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <label style={{ fontSize: '0.85rem', color: '#c4b5fd' }}>Correct Answer:</label>
                                    <select
                                        className="form-control"
                                        style={{ width: 'auto', display: 'inline-block' }}
                                        value={correctAnswerIndex}
                                        onChange={(e) => setCorrectAnswerIndex(Number(e.target.value))}
                                    >
                                        <option value={0}>Option A (Index 0)</option>
                                        <option value={1}>Option B (Index 1)</option>
                                        <option value={2}>Option C (Index 2)</option>
                                        <option value={3}>Option D (Index 3)</option>
                                    </select>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary rounded-pill px-3 py-1 btn-sm"
                                    style={{ borderColor: '#a855f7', color: '#e9d5ff' }}
                                    onClick={handleAddQuestion}
                                >
                                    + Add Question to Quiz
                                </button>

                                {questionsList.length > 0 && (
                                    <div className="mt-3">
                                        {questionsList.map((q, idx) => (
                                            <div key={idx} className="teacher-item-row">
                                                <span><strong>Q{idx + 1}:</strong> {q.question}</span>
                                                <button
                                                    type="button"
                                                    style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer' }}
                                                    onClick={() => handleRemoveQuestion(idx)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-100 py-3 rounded-3 fw-bold"
                                style={{
                                    background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                                    color: '#ffffff',
                                    border: 'none',
                                    fontSize: '1rem',
                                    cursor: 'pointer'
                                }}
                                disabled={loading}
                            >
                                {loading ? 'Publishing Lesson...' : 'Publish Lesson to Students'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="col-lg-5">
                    <div className="card p-4" style={{ background: '#140d36', borderColor: 'rgba(168, 85, 247, 0.25)' }}>
                        <h4 className="fw-bold mb-3 text-white">Published Lessons ({(lessons as LessonItem[] || []).length})</h4>
                        <div>
                            {(lessons as LessonItem[] || []).map((lesson) => (
                                <div key={lesson._id} className="teacher-published-card">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <h6 className="fw-bold mb-0 text-white">{lesson.title}</h6>
                                        <span style={{ background: 'rgba(168, 85, 247, 0.25)', color: '#c084fc', padding: '0.2rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem' }}>
                                            {lesson.level}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', color: '#c4b5fd', marginBottom: '0.5rem' }}>{lesson.description}</p>
                                    <div style={{ fontSize: '0.8rem', color: '#a78bfa' }}>
                                        {lesson.words?.length || 0} words • {lesson.questions?.length || 0} questions
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default TeacherDashboard;
