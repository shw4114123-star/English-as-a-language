import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgressApi } from '../hooks/useProgressApi';

// מאגר מילים ותרגומים למשחקים
const WORD_PAIRS = [
    { word: 'Apple', translation: 'תפוח' },
    { word: 'Book', translation: 'ספר' },
    { word: 'Friend', translation: 'חבר' },
    { word: 'Journey', translation: 'מסע' },
    { word: 'Sun', translation: 'שמש' },
    { word: 'Bridge', translation: 'גשר' },
    { word: 'Window', translation: 'חלון' },
    { word: 'Time', translation: 'זמן' }
];

const SPELLING_WORDS = [
    { full: 'COURAGE', display: 'C O _ R A G E', missing: 'U', translation: 'אומץ' },
    { full: 'BEAUTIFUL', display: 'B E A _ T I F U L', missing: 'U', translation: 'יפה' },
    { full: 'LANGUAGE', display: 'L A N _ U A G E', missing: 'G', translation: 'שפה' },
    { full: 'FREEDOM', display: 'F R E E _ O M', missing: 'D', translation: 'חופש' },
    { full: 'SUCCESS', display: 'S U C _ E S S', missing: 'C', translation: 'הצלחה' },
    { full: 'KNOWLEDGE', display: 'K N O W L E _ G E', missing: 'D', translation: 'ידע' }
];

export const Games = () => {
    const navigate = useNavigate();
    const { fetchUpdateProgress, loading } = useProgressApi();

    // בחירת סוג המשחק: 'hub' (תפריט), 'match' (התאמת מילים), 'spelling' (אות חסרה)
    const [activeGame, setActiveGame] = useState('hub');

    // =========================================================================
    // סטייטים למשחק התאמת מילים (Word Matching Game)
    // =========================================================================
    const [matchCards, setMatchCards] = useState([]);
    const [firstSelection, setFirstSelection] = useState(null);
    const [matchedPairs, setMatchedPairs] = useState([]);
    const [matchScore, setMatchScore] = useState(0);
    const [matchFinished, setMatchFinished] = useState(false);

    // =========================================================================
    // סטייטים למשחק אות חסרה (Missing Letter Spelling Game)
    // =========================================================================
    const [spellingIndex, setSpellingIndex] = useState(0);
    const [spellingScore, setSpellingScore] = useState(0);
    const [spellingFeedback, setSpellingFeedback] = useState(null);
    const [spellingFinished, setSpellingFinished] = useState(false);

    // סטייט לחיווי הצלחה בשמירת הניקוד בשרת
    const [saveNotice, setSaveNotice] = useState(false);

    // השמעת קול של מילה
    const speakWord = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.85;
            window.speechSynthesis.speak(utterance);
        }
    };

    // =========================================================================
    // אתחול משחק התאמת מילים
    // =========================================================================
    const initMatchGame = () => {
        const selected = WORD_PAIRS.slice(0, 6);
        const englishCards = selected.map((item, idx) => ({
            id: `en-${idx}`,
            pairId: idx,
            text: item.word,
            type: 'en'
        }));
        const hebrewCards = selected.map((item, idx) => ({
            id: `he-${idx}`,
            pairId: idx,
            text: item.translation,
            type: 'he'
        }));

        // ערבוב הקלפים
        const shuffled = [...englishCards, ...hebrewCards].sort(() => Math.random() - 0.5);
        setMatchCards(shuffled);
        setFirstSelection(null);
        setMatchedPairs([]);
        setMatchScore(0);
        setMatchFinished(false);
        setSaveNotice(false);
        setActiveGame('match');
    };

    const handleCardClick = async (card) => {
        // אם הקלף כבר הותאם בעבר או שנלחץ עליו שוב
        if (matchedPairs.includes(card.pairId) || firstSelection?.id === card.id) {
            return;
        }

        if (card.type === 'en') {
            speakWord(card.text);
        }

        if (!firstSelection) {
            setFirstSelection(card);
            return;
        }

        // אם זו הבחירה השנייה - בדיקת התאמה
        if (firstSelection.pairId === card.pairId && firstSelection.type !== card.type) {
            // התאמה נכונה!
            const newMatched = [...matchedPairs, card.pairId];
            setMatchedPairs(newMatched);
            setFirstSelection(null);
            setMatchScore(prev => prev + 10);

            // בדיקה אם סיימנו את כל הזוגות
            if (newMatched.length === 6) {
                setMatchFinished(true);
                const res = await fetchUpdateProgress({
                    gameScore: { game: 'Word Match', score: matchScore + 10 },
                    xpToAdd: 60
                });
                if (res) setSaveNotice(true);
            }
        } else {
            // התאמה שגויה - איפוס הבחירה
            setTimeout(() => {
                setFirstSelection(null);
            }, 600);
        }
    };

    // =========================================================================
    // אתחול משחק אות חסרה (Missing Letter)
    // =========================================================================
    const initSpellingGame = () => {
        setSpellingIndex(0);
        setSpellingScore(0);
        setSpellingFeedback(null);
        setSpellingFinished(false);
        setSaveNotice(false);
        setActiveGame('spelling');
    };

    const handleSpellingGuess = async (letter) => {
        const currentWord = SPELLING_WORDS[spellingIndex];
        const isCorrect = letter.toUpperCase() === currentWord.missing;

        if (isCorrect) {
            speakWord(currentWord.full);
            setSpellingFeedback({ correct: true, letter });
            setSpellingScore(prev => prev + 15);
        } else {
            setSpellingFeedback({ correct: false, letter });
        }

        setTimeout(async () => {
            setSpellingFeedback(null);
            if (spellingIndex + 1 < SPELLING_WORDS.length) {
                setSpellingIndex(prev => prev + 1);
            } else {
                setSpellingFinished(true);
                const finalScore = isCorrect ? spellingScore + 15 : spellingScore;
                const res = await fetchUpdateProgress({
                    gameScore: { game: 'Missing Letter', score: finalScore },
                    xpToAdd: finalScore
                });
                if (res) setSaveNotice(true);
            }
        }, 800);
    };

    // יצירת 4 אותיות לבחירה (האות הנכונה + 3 אקראיות)
    const getLetterChoices = () => {
        const correct = SPELLING_WORDS[spellingIndex].missing;
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(l => l !== correct);
        const wrongLetters = alphabet.sort(() => Math.random() - 0.5).slice(0, 3);
        return [correct, ...wrongLetters].sort(() => Math.random() - 0.5);
    };

    return (
        <div className="container py-5 max-w-4xl mx-auto fade-in">
            {/* HUB MENU */}
            {activeGame === 'hub' && (
                <div>
                    <div className="text-center mb-5">
                        <span className="badge bg-warning-subtle text-warning px-3 py-2 rounded-pill fw-bold mb-2">
                            🎮 Interactive Practice
                        </span>
                        <h2 className="display-5 fw-bold text-dark">English Learning Games</h2>
                        <p className="text-muted fs-5">
                            Play fun mini-games to reinforce your vocabulary and spellings while earning XP!
                        </p>
                    </div>

                    <div className="row g-4">
                        {/* Game 1 Card */}
                        <div className="col-md-6">
                            <div className="card border-0 shadow-sm rounded-4 p-4 h-100 hover:shadow-md transition-all">
                                <div className="text-5xl mb-3">🃏</div>
                                <h4 className="fw-bold text-dark mb-2">Word Match Challenge</h4>
                                <p className="text-muted mb-4">
                                    Match English words with their Hebrew translations. Sharpens your memory and quick recall.
                                </p>
                                <button
                                    onClick={initMatchGame}
                                    className="btn btn-primary rounded-pill px-4 py-2 mt-auto fw-bold"
                                >
                                    Play Match Game &rarr;
                                </button>
                            </div>
                        </div>

                        {/* Game 2 Card */}
                        <div className="col-md-6">
                            <div className="card border-0 shadow-sm rounded-4 p-4 h-100 hover:shadow-md transition-all">
                                <div className="text-5xl mb-3">🔤</div>
                                <h4 className="fw-bold text-dark mb-2">Missing Letter Spelling</h4>
                                <p className="text-muted mb-4">
                                    Find the missing letter to complete essential English words and master pronunciation.
                                </p>
                                <button
                                    onClick={initSpellingGame}
                                    className="btn btn-success rounded-pill px-4 py-2 mt-auto fw-bold text-white"
                                >
                                    Play Spelling Game &rarr;
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* GAME 1: WORD MATCHING */}
            {/* ========================================================================= */}
            {activeGame === 'match' && (
                <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <button className="btn btn-outline-secondary btn-sm rounded-pill" onClick={() => setActiveGame('hub')}>
                            &larr; Exit to Games
                        </button>
                        <span className="badge bg-primary px-3 py-2 fs-6 rounded-pill">
                            Score: {matchScore} | Pairs: {matchedPairs.length}/6
                        </span>
                    </div>

                    {!matchFinished ? (
                        <div>
                            <h3 className="fw-bold text-dark text-center mb-4">Find Matching Pairs</h3>
                            <div className="row g-3">
                                {matchCards.map((card) => {
                                    const isMatched = matchedPairs.includes(card.pairId);
                                    const isSelected = firstSelection?.id === card.id;

                                    return (
                                        <div key={card.id} className="col-4 col-md-3">
                                            <div
                                                onClick={() => handleCardClick(card)}
                                                className={`card h-100 p-4 text-center justify-content-center align-items-center border-2 rounded-4 cursor-pointer transition-all ${
                                                    isMatched
                                                        ? 'bg-success text-white border-success opacity-50'
                                                        : isSelected
                                                        ? 'bg-primary text-white border-primary shadow'
                                                        : 'bg-white hover:bg-gray-50 border-gray-200 shadow-sm'
                                                }`}
                                                style={{ minHeight: '110px' }}
                                            >
                                                <h5 className="fw-bold mb-0">
                                                    {card.text}
                                                </h5>
                                                {card.type === 'en' && (
                                                    <span className="text-xs opacity-75 mt-1">EN</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="card shadow border-0 rounded-4 p-5 text-center">
                            <div className="text-6xl mb-3">🏆</div>
                            <h2 className="fw-bold mb-2">Awesome Memory!</h2>
                            <p className="text-muted fs-5 mb-4">You matched all word pairs successfully!</p>

                            <div className="bg-light p-4 rounded-4 mb-4 max-w-sm mx-auto">
                                <h3 className="fw-bold text-success mb-1">Score: {matchScore}</h3>
                                <span className="badge bg-warning text-dark px-3 py-2 fs-6">+60 XP Earned</span>
                            </div>

                            {saveNotice && (
                                <div className="alert alert-success py-2 max-w-sm mx-auto mb-4">
                                    Score and XP saved to your profile!
                                </div>
                            )}

                            <div className="d-flex justify-content-center gap-3">
                                <button className="btn btn-primary px-4 rounded-pill" onClick={initMatchGame}>
                                    Play Again
                                </button>
                                <button className="btn btn-outline-secondary px-4 rounded-pill" onClick={() => setActiveGame('hub')}>
                                    Games Menu
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ========================================================================= */}
            {/* GAME 2: MISSING LETTER */}
            {/* ========================================================================= */}
            {activeGame === 'spelling' && (
                <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <button className="btn btn-outline-secondary btn-sm rounded-pill" onClick={() => setActiveGame('hub')}>
                            &larr; Exit to Games
                        </button>
                        <span className="badge bg-success px-3 py-2 fs-6 rounded-pill text-white">
                            Word {spellingIndex + 1} of {SPELLING_WORDS.length} | Score: {spellingScore}
                        </span>
                    </div>

                    {!spellingFinished ? (
                        <div className="card shadow-sm border-0 rounded-4 p-5 text-center">
                            <span className="text-muted fs-5 mb-2">Meaning: "{SPELLING_WORDS[spellingIndex].translation}"</span>
                            <div className="display-4 fw-bold tracking-widest text-primary my-4">
                                {SPELLING_WORDS[spellingIndex].display}
                            </div>

                            <p className="text-muted mb-4">Which letter completes the word?</p>

                            <div className="d-flex justify-content-center gap-3 mb-4">
                                {getLetterChoices().map((letter, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSpellingGuess(letter)}
                                        className="btn btn-outline-primary btn-lg rounded-4 px-4 py-3 fw-bold fs-3 shadow-sm hover:scale-105 transition-all"
                                        disabled={spellingFeedback !== null}
                                    >
                                        {letter}
                                    </button>
                                ))}
                            </div>

                            {spellingFeedback && (
                                <div className={`alert ${spellingFeedback.correct ? 'alert-success' : 'alert-danger'} py-2 max-w-sm mx-auto`}>
                                    {spellingFeedback.correct ? '✓ Correct!' : '✗ Try again!'}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="card shadow border-0 rounded-4 p-5 text-center">
                            <div className="text-6xl mb-3">🌟</div>
                            <h2 className="fw-bold mb-2">Spelling Challenge Completed!</h2>
                            <p className="text-muted fs-5 mb-4">You've mastered these words!</p>

                            <div className="bg-light p-4 rounded-4 mb-4 max-w-sm mx-auto">
                                <h3 className="fw-bold text-success mb-1">Score: {spellingScore}</h3>
                                <span className="badge bg-warning text-dark px-3 py-2 fs-6">+{spellingScore} XP Earned</span>
                            </div>

                            {saveNotice && (
                                <div className="alert alert-success py-2 max-w-sm mx-auto mb-4">
                                    Spelling score and XP saved to your dashboard!
                                </div>
                            )}

                            <div className="d-flex justify-content-center gap-3">
                                <button className="btn btn-success text-white px-4 rounded-pill" onClick={initSpellingGame}>
                                    Play Again
                                </button>
                                <button className="btn btn-outline-secondary px-4 rounded-pill" onClick={() => setActiveGame('hub')}>
                                    Games Menu
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
