import React from 'react';

export const LetterCard = ({ letter, word, imageSrc, audioSrc }) => {
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
        <div className="card shadow-sm border-0 rounded-4 text-center overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-lg h-100">
            <div className="bg-light p-4 d-flex align-items-center justify-content-center" style={{ height: '150px' }}>
                {imageSrc ? (
                    <img src={imageSrc} alt={`${word} drawing`} className="img-fluid max-h-full" />
                ) : (
                    <div className="text-muted small">Image for {letter}</div>
                )}
            </div>
            <div className="card-body d-flex flex-column align-items-center justify-content-between bg-white">
                <h1 className="display-4 fw-bold text-primary mb-0">{letter}</h1>
                <p className="fs-5 text-secondary text-capitalize mb-3">{word}</p>
                <button 
                    onClick={playAudio} 
                    className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center p-3 transition-transform hover:scale-110"
                    title={`Pronounce ${letter}`}
                >
                    🔊
                </button>
            </div>
        </div>
    );
};
