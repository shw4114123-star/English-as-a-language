import rawVocabulary from './vocabularyData.json';

export interface VocabularyWord {
    word: string;
    meaning: string;
    phonetic?: string;
    visual?: string;
    exp?: string;
    engEx?: string;
    hebEx?: string;
}

export interface WordPair {
    word: string;
    translation: string;
}

export interface SpellingWord {
    full: string;
    display: string;
    missing: string;
    translation: string;
}

export const VOCABULARY_LIST: VocabularyWord[] = rawVocabulary as VocabularyWord[];

/**
 * Returns N random word pairs for the word matching game
 */
export function getRandomWordPairs(count: number = 6): WordPair[] {
    const shuffled = [...VOCABULARY_LIST].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);

    return selected.map(item => ({
        word: item.word,
        translation: item.meaning
    }));
}

/**
 * Returns N random spelling words with a randomly obscured letter for the spelling game
 */
export function getRandomSpellingWords(count: number = 6): SpellingWord[] {
    // Filter words that only contain simple letters and are at least 3 letters long
    const validWords = VOCABULARY_LIST.filter(item => {
        const clean = item.word.trim();
        return clean.length >= 3 && /^[a-zA-Z]+$/.test(clean);
    });

    const shuffled = [...validWords].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);

    return selected.map(item => {
        const fullUpper = item.word.trim().toUpperCase();
        // Pick an index from the word (preferably not always the first or last letter)
        const eligibleIndices: number[] = [];
        for (let i = 0; i < fullUpper.length; i++) {
            eligibleIndices.push(i);
        }

        const missingIdx = eligibleIndices.length > 2 
            ? Math.floor(Math.random() * (fullUpper.length - 2)) + 1 
            : Math.floor(Math.random() * fullUpper.length);

        const missingLetter = fullUpper[missingIdx];
        
        // Build display with spaces: e.g. "D _ E P"
        const displayLetters = fullUpper.split('').map((char, idx) => {
            return idx === missingIdx ? '_' : char;
        });

        return {
            full: fullUpper,
            display: displayLetters.join(' '),
            missing: missingLetter,
            translation: item.meaning
        };
    });
}
