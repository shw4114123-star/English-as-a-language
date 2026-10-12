import React from 'react';
import { LetterCard } from '../../components/LetterCard/LetterCard';
import './Alphabet.css';

interface AlphabetItem {
    letter: string;
    word: string;
    imageSrc: string;
}

const ALPHABET_DATA: AlphabetItem[] = [
    { letter: 'A', word: 'Apple', imageSrc: '/assets/A.png' },
    { letter: 'B', word: 'Bear', imageSrc: '/assets/B.png' },
    { letter: 'C', word: 'Cat', imageSrc: '/assets/C.png' },
    { letter: 'D', word: 'Dog', imageSrc: '/assets/D.png' },
    { letter: 'E', word: 'Elephant', imageSrc: '/assets/E.png' },
    { letter: 'F', word: 'Fish', imageSrc: '/assets/F.png' },
    { letter: 'G', word: 'Giraffe', imageSrc: '/assets/G.png' },
    { letter: 'H', word: 'Hat', imageSrc: '/assets/H.png' },
    { letter: 'I', word: 'Ice cream', imageSrc: '/assets/I.png' },
    { letter: 'J', word: 'Juice', imageSrc: '/assets/J.png' },
    { letter: 'K', word: 'Kite', imageSrc: '/assets/K.png' },
    { letter: 'L', word: 'Lion', imageSrc: '/assets/L.png' },
    { letter: 'M', word: 'Monkey', imageSrc: '/assets/M.png' },
    { letter: 'N', word: 'Nest', imageSrc: '/assets/N.png' },
    { letter: 'O', word: 'Orange', imageSrc: '/assets/O.png' },
    { letter: 'P', word: 'Pig', imageSrc: '/assets/P.png' },
    { letter: 'Q', word: 'Queen', imageSrc: '/assets/Q.png' },
    { letter: 'R', word: 'Rabbit', imageSrc: '/assets/R.png' },
    { letter: 'S', word: 'Sun', imageSrc: '/assets/S.png' },
    { letter: 'T', word: 'Turtle', imageSrc: '/assets/T.png' },
    { letter: 'U', word: 'Umbrella', imageSrc: '/assets/U.png' },
    { letter: 'V', word: 'Van', imageSrc: '/assets/V.png' },
    { letter: 'W', word: 'Watermelon', imageSrc: '/assets/W.png' },
    { letter: 'X', word: 'X-ray', imageSrc: '/assets/X.png' },
    { letter: 'Y', word: 'Yoyo', imageSrc: '/assets/Y.png' },
    { letter: 'Z', word: 'Zebra', imageSrc: '/assets/Z.png' }
];

export const Alphabet: React.FC = () => {
    return (
        <div className="container py-5 fade-in">
            <div className="alphabet-header">
                <h1 className="alphabet-title">The English Alphabet</h1>
                <p className="alphabet-subtitle">Click on the speaker icon to hear the pronunciation!</p>
            </div>
            
            <div className="alphabet-grid">
                {ALPHABET_DATA.map((item, index) => (
                    <div key={item.letter} style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                        <LetterCard 
                            letter={item.letter} 
                            word={item.word} 
                            imageSrc={item.imageSrc} 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Alphabet;
