import React, { useState } from 'react';
import { useProgressApi } from '../../hooks/useProgressApi';
import { getRandomWordPairs, getRandomSpellingWords, SpellingWord } from '../../data/vocabularyPool';
import './Games.css';

interface MatchCard {
    id: string;
    pairId: number;
    text: string;
    type: 'en' | 'he';
}

export const Games: React.FC = () => {
    const { fetchUpdateProgress } = useProgressApi();

    const [activeGame, setActiveGame] = useState<'hub' | 'match' | 'spelling'>('hub');

    // Matching Game States
    const [matchCards, setMatchCards] = useState<MatchCard[]>([]);
    const [firstSelection, setFirstSelection] = useState<MatchCard | null>(null);
    const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
    const [matchScore, setMatchScore] = useState(0);
    const [matchFinished, setMatchFinished] = useState(false);

    // Spelling Game States
    const [spellingWords, setSpellingWords] = useState<SpellingWord[]>([]);
    const [spellingIndex, setSpellingIndex] = useState(0);
    const [spellingScore, setSpellingScore] = useState(0);
    const [spellingFeedback, setSpellingFeedback] = useState<{ correct: boolean; letter: string } | null>(null);
    const [spellingFinished, setSpellingFinished] = useState(false);

    const [saveNotice, setSaveNotice] = useState(false);

    const speakWord = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.85;
            window.speechSynthesis.speak(utterance);
        }
    };

    // Initialize Matching Game with dynamic random vocabulary
    const initMatchGame = () => {
        const randomPairs = getRandomWordPairs(6);
        const englishCards: MatchCard[] = randomPairs.map((item, idx) => ({
            id: `en-${idx}`,
            pairId: idx,
            text: item.word,
            type: 'en'
        }));
        const hebrewCards: MatchCard[] = randomPairs.map((item, idx) => ({
            id: `he-${idx}`,
            pairId: idx,
            text: item.translation,
            type: 'he'
        }));

        const shuffled = [...englishCards, ...hebrewCards].sort(() => Math.random() - 0.5);
        setMatchCards(shuffled);
        setFirstSelection(null);
        setMatchedPairs([]);
        setMatchScore(0);
        setMatchFinished(false);
        setSaveNotice(false);
        setActiveGame('match');
    };

    const handleCardClick = async (card: MatchCard) => {
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

        if (firstSelection.pairId === card.pairId && firstSelection.type !== card.type) {
            const newMatched = [...matchedPairs, card.pairId];
            setMatchedPairs(newMatched);
            setFirstSelection(null);
            setMatchScore(prev => prev + 10);

            if (newMatched.length === 6) {
                setMatchFinished(true);
                const res = await fetchUpdateProgress({
                    gameScore: { game: 'Word Match', score: matchScore + 10 },
                    xpToAdd: 60
                });
                if (res) setSaveNotice(true);
            }
        } else {
            setTimeout(() => {
                setFirstSelection(null);
            }, 600);
        }
    };

    // Initialize Spelling Game with dynamic random vocabulary
    const initSpellingGame = () => {
        const randomSpellingList = getRandomSpellingWords(6);
        setSpellingWords(randomSpellingList);
        setSpellingIndex(0);
        setSpellingScore(0);
        setSpellingFeedback(null);
        setSpellingFinished(false);
        setSaveNotice(false);
        setActiveGame('spelling');
    };

    const handleSpellingGuess = async (letter: string) => {
        if (!spellingWords[spellingIndex]) return;
        const currentWord = spellingWords[spellingIndex];
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
            if (spellingIndex + 1 < spellingWords.length) {
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

    const getLetterChoices = () => {
        if (!spellingWords[spellingIndex]) return [];
        const correct = spellingWords[spellingIndex].missing;
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(l => l !== correct);
        const wrongLetters = alphabet.sort(() => Math.random() - 0.5).slice(0, 3);
        return [correct, ...wrongLetters].sort(() => Math.random() - 0.5);
    };

    return (
        <div className="container py-5 max-w-4xl mx-auto fade-in">
            {activeGame === 'hub' && (
                <div>
                    <div className="games-hub-header">
                        <span className="games-hub-badge">
                            🎮 Interactive Practice
                        </span>
                        <h2 className="display-5 fw-bold mb-2" style={{ color: 'var(--text-main, #2b3650)' }}>English Learning Games</h2>
                        <p style={{ color: 'var(--text-secondary, #475569)', fontSize: '1.2rem' }}>
                            Play fun mini-games with dynamic, random vocabulary from our 370+ word bank to reinforce your English!
                        </p>
                    </div>

                    <div className="row g-4">
                        <div className="col-md-6">
                            <div className="games-card">
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🃏</div>
                                <h4 className="fw-bold mb-2" style={{ color: 'var(--text-main, #2b3650)' }}>Word Match Challenge</h4>
                                <p style={{ color: 'var(--text-secondary, #475569)', marginBottom: '1.5rem', flexGrow: 1 }}>
                                    Match English words with their Hebrew translations. Every round draws random words from the full vocabulary database!
                                </p>
                                <button
                                    onClick={initMatchGame}
                                    className="btn-game-play"
                                >
                                    Play Match Game &rarr;
                                </button>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="games-card">
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔤</div>
                                <h4 className="fw-bold mb-2" style={{ color: 'var(--text-main, #2b3650)' }}>Missing Letter Spelling</h4>
                                <p style={{ color: 'var(--text-secondary, #475569)', marginBottom: '1.5rem', flexGrow: 1 }}>
                                    Find the missing letter from dynamically generated words, listen to pronunciation, and master spellings!
                                </p>
                                <button
                                    onClick={initSpellingGame}
                                    className="btn-game-play"
                                >
                                    Play Spelling Game &rarr;
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeGame === 'match' && (
                <div>
                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                        <button className="btn btn-outline-secondary btn-sm rounded-pill" onClick={() => setActiveGame('hub')}>
                            &larr; Exit to Games
                        </button>
                        <span className="badge" style={{ background: '#7c3aed', color: '#ffffff', padding: '0.5rem 1rem', borderRadius: '9999px' }}>
                            Score: {matchScore} | Pairs: {matchedPairs.length}/6
                        </span>
                    </div>

                    {!matchFinished ? (
                        <div>
                            <h3 className="fw-bold text-center mb-4" style={{ color: 'var(--text-main, #2b3650)' }}>Find Matching Pairs</h3>
                            <div className="row g-3">
                                {matchCards.map((card) => {
                                    const isMatched = matchedPairs.includes(card.pairId);
                                    const isSelected = firstSelection?.id === card.id;

                                    return (
                                        <div key={card.id} className="col-4 col-md-3">
                                            <div
                                                onClick={() => handleCardClick(card)}
                                                className={`match-tile ${isMatched ? 'match-tile-matched' : ''} ${isSelected ? 'match-tile-selected' : ''}`}
                                            >
                                                <h5 className="fw-bold mb-0">
                                                    {card.text}
                                                </h5>
                                                {card.type === 'en' && (
                                                    <span style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '0.25rem' }}>EN</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="games-card text-center p-5">
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏆</div>
                            <h2 className="fw-bold mb-2" style={{ color: 'var(--text-main, #2b3650)' }}>Awesome Memory!</h2>
                            <p style={{ color: 'var(--text-secondary, #475569)', marginBottom: '1.5rem' }}>You matched all word pairs successfully!</p>

                            <div style={{ background: 'var(--palette-ice, #eef1ff)', border: '1.5px solid var(--border-colored, #b6c5f7)', padding: '1.5rem', borderRadius: '1rem', maxWidth: '350px', margin: '0 auto 1.5rem' }}>
                                <h3 className="fw-bold text-success mb-1">Score: {matchScore}</h3>
                                <span className="badge" style={{ background: '#f59e0b', color: '#0b0720', fontWeight: 700, padding: '0.4rem 0.8rem', borderRadius: '9999px' }}>+60 XP Earned</span>
                            </div>

                            {saveNotice && (
                                <div className="alert alert-success" style={{ maxWidth: '350px', margin: '0 auto 1.5rem' }}>
                                    Score and XP saved to your profile!
                                </div>
                            )}

                            <div className="d-flex justify-content-center gap-3">
                                <button className="btn-game-play" onClick={initMatchGame}>
                                    Play Again (New Words)
                                </button>
                                <button className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setActiveGame('hub')}>
                                    Games Menu
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeGame === 'spelling' && (
                <div>
                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                        <button className="btn btn-outline-secondary btn-sm rounded-pill" onClick={() => setActiveGame('hub')}>
                            &larr; Exit to Games
                        </button>
                        <span className="badge" style={{ background: '#059669', color: '#ffffff', padding: '0.5rem 1rem', borderRadius: '9999px' }}>
                            Word {spellingIndex + 1} of {spellingWords.length} | Score: {spellingScore}
                        </span>
                    </div>

                    {!spellingFinished && spellingWords[spellingIndex] ? (
                        <div className="games-card text-center p-5">
                            <span style={{ color: 'var(--text-secondary, #475569)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Meaning: "{spellingWords[spellingIndex].translation}"</span>
                            <div style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '0.25em', margin: '1.5rem 0', color: 'var(--color-primary, #5457cd)' }}>
                                {spellingWords[spellingIndex].display}
                            </div>

                            <p style={{ color: 'var(--text-secondary, #475569)', marginBottom: '1.5rem' }}>Which letter completes the word?</p>

                            <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
                                {getLetterChoices().map((letter, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSpellingGuess(letter)}
                                        className="spelling-letter-btn"
                                        disabled={spellingFeedback !== null}
                                    >
                                        {letter}
                                    </button>
                                ))}
                            </div>

                            {spellingFeedback && (
                                <div className={`alert ${spellingFeedback.correct ? 'alert-success' : 'alert-danger'}`} style={{ maxWidth: '350px', margin: '0 auto' }}>
                                    {spellingFeedback.correct ? '✓ Correct!' : '✗ Try again!'}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="games-card text-center p-5">
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌟</div>
                            <h2 className="fw-bold mb-2" style={{ color: 'var(--text-main, #2b3650)' }}>Spelling Challenge Completed!</h2>
                            <p style={{ color: 'var(--text-secondary, #475569)', marginBottom: '1.5rem' }}>You've mastered these words!</p>

                            <div style={{ background: 'var(--palette-ice, #eef1ff)', border: '1.5px solid var(--border-colored, #b6c5f7)', padding: '1.5rem', borderRadius: '1rem', maxWidth: '350px', margin: '0 auto 1.5rem' }}>
                                <h3 className="fw-bold text-success mb-1">Score: {spellingScore}</h3>
                                <span className="badge" style={{ background: '#f59e0b', color: '#0b0720', fontWeight: 700, padding: '0.4rem 0.8rem', borderRadius: '9999px' }}>+{spellingScore} XP Earned</span>
                            </div>

                            {saveNotice && (
                                <div className="alert alert-success" style={{ maxWidth: '350px', margin: '0 auto 1.5rem' }}>
                                    Spelling score and XP saved to your dashboard!
                                </div>
                            )}

                            <div className="d-flex justify-content-center gap-3">
                                <button className="btn-game-play" onClick={initSpellingGame}>
                                    Play Again (New Words)
                                </button>
                                <button className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setActiveGame('hub')}>
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
export default Games;
