import React, { useState } from 'react';
import './LetterCard.css';

interface LetterCardProps {
    letter: string;
    word: string;
    imageSrc?: string;
    audioSrc?: string;
}

export const LetterCard: React.FC<LetterCardProps> = ({ letter, word, imageSrc, audioSrc }) => {
    const [imgError, setImgError] = useState(false);

    const playAudio = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (audioSrc) {
            const audio = new Audio(audioSrc);
            audio.play();
        } else {
            // Fallback text-to-speech if no audio file is provided
            const utterance = new SpeechSynthesisUtterance(`${letter}, ${word}`);
            utterance.lang = 'en-US';
            window.speechSynthesis.speak(utterance);
        }
    };

    const hasValidImage = Boolean(imageSrc && !imgError);

    return (
        <div 
            className={`letter-card-container letter-card-${letter.toLowerCase()} ${hasValidImage ? 'has-image' : 'no-image'}`}
            data-letter={letter}
            onClick={() => playAudio()}
            title={`Click to pronounce ${letter} - ${word}`}
        >
            {/* Top Bar: Letter badge & Audio trigger */}
            <div className="letter-card-header">
                <span className="letter-card-badge">{letter}</span>
                <button 
                    onClick={playAudio} 
                    className="letter-card-audio-btn"
                    title={`Pronounce ${letter} - ${word}`}
                    aria-label={`Pronounce ${letter}`}
                >
                    <svg className="letter-card-speaker-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                    </svg>
                    <span className="letter-card-audio-text">Listen</span>
                </button>
            </div>

            {/* Center Stage: The Illustration (Center of Attention) */}
            <div className="letter-card-image-box">
                {hasValidImage ? (
                    <img 
                        src={imageSrc} 
                        alt={`${word} shaped as letter ${letter}`} 
                        className="letter-card-image"
                        onError={() => setImgError(true)}
                        loading="lazy"
                    />
                ) : (
                    <div className="letter-card-placeholder">
                        <span className="letter-card-placeholder-letter">{letter}</span>
                        <span className="letter-card-placeholder-text">Artwork coming soon</span>
                    </div>
                )}
            </div>

            {/* Bottom Bar: Word Name */}
            <div className="letter-card-footer">
                <h3 className="letter-card-word">{word}</h3>
            </div>
        </div>
    );
};

export default LetterCard;
