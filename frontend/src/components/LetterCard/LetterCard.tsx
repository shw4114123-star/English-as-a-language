import React from 'react';
import './LetterCard.css';

interface LetterCardProps {
    letter: string;
    word: string;
    imageSrc?: string;
    audioSrc?: string;
}

export const LetterCard: React.FC<LetterCardProps> = ({ letter, word, imageSrc, audioSrc }) => {
    const playAudio = () => {
        if (audioSrc) {
            const audio = new Audio(audioSrc);
            audio.play();
        } else {
            // Fallback text-to-speech if no audio file is provided
            const utterance = new SpeechSynthesisUtterance(letter);
            utterance.lang = 'en-US';
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <div className="letter-card-container">
            <div className="letter-card-image-box">
                {imageSrc ? (
                    <img src={imageSrc} alt={`${word} drawing`} className="letter-card-image" />
                ) : (
                    <div className="letter-card-placeholder">Image for {letter}</div>
                )}
            </div>
            <div className="letter-card-body">
                <h1 className="letter-card-letter">{letter}</h1>
                <p className="letter-card-word">{word}</p>
                <button 
                    onClick={playAudio} 
                    className="letter-card-audio-btn"
                    title={`Pronounce ${letter}`}
                >
                    🔊
                </button>
            </div>
        </div>
    );
};
export default LetterCard;
