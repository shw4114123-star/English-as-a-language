import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './NotFound.css';

interface MiniLetterItem {
    letter: string;
    word: string;
    img: string;
}

const FEATURED_ANIMALS: MiniLetterItem[] = [
    { letter: 'C', word: 'Cat', img: '/C.png' },
    { letter: 'D', word: 'Dinosaur', img: '/D.png' },
    { letter: 'E', word: 'Elephant', img: '/E.png' },
    { letter: 'H', word: 'House', img: '/H.png' },
    { letter: 'O', word: 'Owl', img: '/O.png' },
    { letter: 'P', word: 'Penguin', img: '/P.png' },
    { letter: 'T', word: 'Tiger', img: '/T.png' },
    { letter: 'U', word: 'Unicorn', img: '/U.png' },
];

export const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="not-found-container container fade-in">
            <div className="not-found-card">
                <div className="not-found-glow"></div>

                {/* Status Badge */}
                <span className="not-found-badge">
                    404 • Page Not Found
                </span>

                <h1 className="not-found-code">404</h1>
                <h2 className="not-found-title">Oops! This Page Is Missing</h2>
                <p className="not-found-desc">
                    Our team searched every line of code and corner of the website, but couldn't find the page you were looking for.
                </p>

                {/* Central Illustration */}
                <div className="not-found-image-wrap">
                    <img 
                        src="/404.png" 
                        alt="Classmates searching for missing page" 
                        className="not-found-image" 
                    />
                </div>

                {/* Primary Action Buttons */}
                <div className="not-found-actions">
                    <Link to="/" className="not-found-btn-primary">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                            <polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                        Back to Home
                    </Link>

                    <Link to="/alphabet" className="not-found-btn-secondary">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                        Explore Alphabet
                    </Link>
                </div>

                {/* Interactive Alphabet Characters Shelf */}
                <div className="not-found-abc-section">
                    <h3 className="not-found-abc-title">Meet Our Alphabet Friends While You're Here</h3>
                    <p className="not-found-abc-subtitle">Click any letter to practice its pronunciation and sound:</p>

                    <div className="not-found-abc-grid">
                        {FEATURED_ANIMALS.map((item) => (
                            <div 
                                key={item.letter} 
                                className="not-found-mini-card"
                                onClick={() => navigate('/alphabet')}
                                title={`Learn letter ${item.letter} - ${item.word}`}
                            >
                                <img 
                                    src={item.img} 
                                    alt={`${item.word} for letter ${item.letter}`} 
                                    className="not-found-mini-img"
                                    loading="lazy" 
                                />
                                <span className="not-found-mini-letter">{item.letter}</span>
                                <span className="not-found-mini-word">{item.word}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
