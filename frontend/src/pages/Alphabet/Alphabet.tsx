import React from 'react';
import { LetterCard } from '../../components/LetterCard/LetterCard';
import './Alphabet.css';

interface AlphabetItem {
    letter: string;
    word: string;
    imageSrc: string;
}

const ALPHABET_DATA: AlphabetItem[] = [
    { letter: 'A', word: 'Apple', imageSrc: '/A.png' },
    { letter: 'B', word: 'Bear', imageSrc: '/B.png' },
    { letter: 'C', word: 'Cat', imageSrc: '/C.png' },
    { letter: 'D', word: 'Dog', imageSrc: '/D.png' },
    { letter: 'E', word: 'Elephant', imageSrc: '/E.png' },
    { letter: 'F', word: 'Fish', imageSrc: '/F.png' },
    { letter: 'G', word: 'Giraffe', imageSrc: '/G.png' },
    { letter: 'H', word: 'Hat', imageSrc: '/H.png' },
    { letter: 'I', word: 'Ice cream', imageSrc: '/I.png' },
    { letter: 'J', word: 'Juice', imageSrc: '/J.png' },
    { letter: 'K', word: 'Kite', imageSrc: '/K.png' },
    { letter: 'L', word: 'Lion', imageSrc: '/L.png' },
    { letter: 'M', word: 'Monkey', imageSrc: '/M.png' },
    { letter: 'N', word: 'Nest', imageSrc: '/N.png' },
    { letter: 'O', word: 'Orange', imageSrc: '/O.png' },
    { letter: 'P', word: 'Pig', imageSrc: '/P.png' },
    { letter: 'Q', word: 'Queen', imageSrc: '/Q.png' },
    { letter: 'R', word: 'Rabbit', imageSrc: '/R.png' },
    { letter: 'S', word: 'Sun', imageSrc: '/S.png' },
    { letter: 'T', word: 'Turtle', imageSrc: '/T.png' },
    { letter: 'U', word: 'Umbrella', imageSrc: '/U.png' },
    { letter: 'V', word: 'Van', imageSrc: '/V.png' },
    { letter: 'W', word: 'Watermelon', imageSrc: '/W.png' },
    { letter: 'X', word: 'X-ray', imageSrc: '/X.png' },
    { letter: 'Y', word: 'Yoyo', imageSrc: '/Y.png' },
    { letter: 'Z', word: 'Zebra', imageSrc: '/Z.png' }
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
