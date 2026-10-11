import React, { useEffect, useState } from 'react';
import { useLessonsApi } from '../hooks/useLessonsApi';

export const TeacherDashboard = () => {
    const { lessons, fetchAllLessons, fetchCreateLesson, loading, error } = useLessonsApi();

    // סטייטים נפרדים עבור טופס יצירת שיעור חדש
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [level, setLevel] = useState('Beginner');

    // סטייטים להוספת מילה חדשה לרשימת המילים בשיעור
    const [wordInput, setWordInput] = useState('');
    const [translationInput, setTranslationInput] = useState('');
    const [meaningInput, setMeaningInput] = useState('');
    const [exampleInput, setExampleInput] = useState('');
    const [wordsList, setWordsList] = useState([]);

    // סטייטים להוספת שאלת תרגול חדשה
    const [questionText, setQuestionText] = useState('');
    const [opt0, setOpt0] = useState('');
    const [opt1, setOpt1] = useState('');
    const [opt2, setOpt2] = useState('');
    const [opt3, setOpt3] = useState('');
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
    const [questionsList, setQuestionsList] = useState([]);

    const [statusMessage, setStatusMessage] = useState(null);

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

    const handleRemoveWord = (index) => {
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

    const handleRemoveQuestion = (index) => {
        setQuestionsList(prev => prev.filter((_, i) => i !== index));
    };

    const handleCreateLessonSubmit = async (e) => {
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
                <h2 className="fw-bold text-dark mb-1">Teacher Studio & Curriculum Creator</h2>
                <p className="text-muted">Author new English lessons, create vocabulary lists, and publish interactive quizzes.</p>
            </div>

            {statusMessage && <div className="alert alert-success">{statusMessage}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row g-4">
                {/* Create Lesson Form Column */}
                <div className="col-lg-7">
                    <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
                        <h4 className="fw-bold mb-4">Create New Lesson</h4>

                        <form onSubmit={handleCreateLessonSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Lesson Title</label>
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
                                <label className="form-label fw-semibold">Description</label>
                                <textarea
                                    className="form-control"
                                    rows="2"
                                    placeholder="Brief explanation of what students will learn..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-semibold">Target Level</label>
                                <select
                                    className="form-select"
                                    value={level}
                                    onChange={(e) => setLevel(e.target.value)}
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>

                            {/* Section: Vocabulary builder */}
                            <div className="bg-light p-3 rounded-4 mb-4">
                                <h6 className="fw-bold text-primary mb-3">Add Vocabulary Words ({wordsList.length})</h6>
                                <div className="row g-2 mb-2">
                                    <div className="col-md-6">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="English Word (e.g. Airport)"
                                            value={wordInput}
                                            onChange={(e) => setWordInput(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="Hebrew Translation (e.g. נמל תעופה)"
                                            value={translationInput}
                                            onChange={(e) => setTranslationInput(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="Meaning / Definition"
                                            value={meaningInput}
                                            onChange={(e) => setMeaningInput(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="Example Sentence"
                                            value={exampleInput}
                                            onChange={(e) => setExampleInput(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-outline-primary btn-sm rounded-pill"
                                    onClick={handleAddWord}
                                >
                                    + Add Word to Lesson
                                </button>

                                {wordsList.length > 0 && (
                                    <ul className="list-group list-group-flush mt-3 rounded-3">
                                        {wordsList.map((w, idx) => (
                                            <li key={idx} className="list-group-item d-flex justify-content-between align-items-center py-2 bg-white">
                                                <span><strong>{w.word}</strong> - {w.translation}</span>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-link text-danger p-0"
                                                    onClick={() => handleRemoveWord(idx)}
                                                >
                                                    Remove
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Section: Practice Quiz Question Builder */}
                            <div className="bg-light p-3 rounded-4 mb-4">
                                <h6 className="fw-bold text-primary mb-3">Add Quiz Questions ({questionsList.length})</h6>
                                <div className="mb-2">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Question Prompt"
                                        value={questionText}
                                        onChange={(e) => setQuestionText(e.target.value)}
                                    />
                                </div>
                                <div className="row g-2 mb-2">
                                    <div className="col-6">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="Option A (Index 0)"
                                            value={opt0}
                                            onChange={(e) => setOpt0(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="Option B (Index 1)"
                                            value={opt1}
                                            onChange={(e) => setOpt1(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="Option C (Index 2)"
                                            value={opt2}
                                            onChange={(e) => setOpt2(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="Option D (Index 3)"
                                            value={opt3}
                                            onChange={(e) => setOpt3(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <label className="small text-muted mb-0">Correct Answer:</label>
                                    <select
                                        className="form-select form-select-sm w-auto"
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
                                    className="btn btn-outline-primary btn-sm rounded-pill"
                                    onClick={handleAddQuestion}
                                >
                                    + Add Question to Quiz
                                </button>

                                {questionsList.length > 0 && (
                                    <ul className="list-group list-group-flush mt-3 rounded-3">
                                        {questionsList.map((q, idx) => (
                                            <li key={idx} className="list-group-item d-flex justify-content-between align-items-center py-2 bg-white">
                                                <span><strong>Q{idx + 1}:</strong> {q.question}</span>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-link text-danger p-0"
                                                    onClick={() => handleRemoveQuestion(idx)}
                                                >
                                                    Remove
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100 py-3 rounded-3 fw-bold shadow-sm"
                                disabled={loading}
                            >
                                {loading ? 'Publishing Lesson...' : 'Publish Lesson to Students'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Published Lessons Column */}
                <div className="col-lg-5">
                    <div className="card border-0 shadow-sm rounded-4 p-4">
                        <h4 className="fw-bold mb-3">Published Lessons ({lessons.length})</h4>
                        <div className="space-y-3">
                            {lessons.map((lesson) => (
                                <div key={lesson._id} className="p-3 border rounded-3 bg-white">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <h6 className="fw-bold mb-0 text-dark">{lesson.title}</h6>
                                        <span className="badge bg-secondary-subtle text-secondary small">
                                            {lesson.level}
                                        </span>
                                    </div>
                                    <p className="small text-muted mb-2">{lesson.description}</p>
                                    <div className="small text-secondary">
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
