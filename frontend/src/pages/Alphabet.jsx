import React from 'react';
import { LetterCard } from '../components/LetterCard';

const ALPHABET_DATA = [
    { letter: 'A', word: 'Apple', imageSrc: '/public/A.png' },
    { letter: 'B', word: 'Bear', imageSrc: '/public/B.png' },
    { letter: 'C', word: 'Cat', imageSrc: '/public/C.png' },
    { letter: 'D', word: 'Dog', imageSrc: '/public/D.png' },
    { letter: 'E', word: 'Elephant', imageSrc: '/public/E.png' },
    { letter: 'F', word: 'Fish', imageSrc: '/public/F.png' },
    { letter: 'G', word: 'Giraffe', imageSrc: '/public/G.png' },
    { letter: 'H', word: 'Hat', imageSrc: '/public/H.png' },
    { letter: 'I', word: 'Ice cream', imageSrc: '/public/I.png' },
    { letter: 'J', word: 'Juice', imageSrc: '/public/J.png' },
    { letter: 'K', word: 'Kite', imageSrc: '/public/K.png' },
    { letter: 'L', word: 'Lion', imageSrc: '/public/L.png' },
    { letter: 'M', word: 'Monkey', imageSrc: '/public/M.png' },
    { letter: 'N', word: 'Nest', imageSrc: '/public/N.png' },
    { letter: 'O', word: 'Orange', imageSrc: '/public/O.png' },
    { letter: 'P', word: 'Pig', imageSrc: '/public/P.png' },
    { letter: 'Q', word: 'Queen', imageSrc: '/public/Q.png' },
    { letter: 'R', word: 'Rabbit', imageSrc: '/public/R.png' },
    { letter: 'S', word: 'Sun', imageSrc: '/public/S.png' },
    { letter: 'T', word: 'Turtle', imageSrc: '/public/T.png' },
    { letter: 'U', word: 'Umbrella', imageSrc: '/public/U.png' },
    { letter: 'V', word: 'Van', imageSrc: '/public/V.png' },
    { letter: 'W', word: 'Watermelon', imageSrc: '/public/W.png' },
    { letter: 'X', word: 'X-ray', imageSrc: '/public/X.png' },
    { letter: 'Y', word: 'Yoyo', imageSrc: '/public/Y.png' },
    { letter: 'Z', word: 'Zebra', imageSrc: '/public/Z.png' }
];

export const Alphabet = () => {
    return (
        <div className="container py-5 fade-in">
            <div className="text-center mb-5">
                <h1 className="display-4 fw-bold text-primary">The English Alphabet</h1>
                <p className="lead text-secondary">Click on the speaker icon to hear the pronunciation!</p>
            </div>
            
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {ALPHABET_DATA.map((item, index) => (
                    <div className="col" key={item.letter} style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
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
