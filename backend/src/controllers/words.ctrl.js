import { createError } from "../utils/errorHandler.js";

export const getWordInfo = async (req, res) => {
    const { word } = req.params;
    if (!word) throw new createError("Word is required", 400);

    let translation = null;
    let phonetic = '';
    let partOfSpeech = '';
    let definition = '';

    // 1. Fetch Hebrew translation from MyMemory API
    try {
        const transRes = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|he`,
            { signal: AbortSignal.timeout(5000) }
        );
        if (transRes.ok) {
            const transData = await transRes.json();
            if (transData?.responseData?.translatedText) {
                translation = transData.responseData.translatedText;
            }
        }
    } catch (err) {
        console.warn(`Translation service warning for '${word}':`, err.message);
    }

    // 2. Try fetching English definition/phonetics from dictionaryapi.dev (with 3s timeout)
    try {
        const apiUrl = process.env.DICTIONARY_API_URL 
            ? `${process.env.DICTIONARY_API_URL}/${encodeURIComponent(word)}`
            : `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;

        const dictRes = await fetch(apiUrl, { signal: AbortSignal.timeout(3000) });
        if (dictRes.ok) {
            const dictData = await dictRes.json();
            if (Array.isArray(dictData) && dictData.length > 0) {
                const entry = dictData[0];
                phonetic = entry.phonetic || entry.phonetics?.find(p => p.text)?.text || '';
                const firstMeaning = entry.meanings?.[0];
                if (firstMeaning) {
                    partOfSpeech = firstMeaning.partOfSpeech || '';
                    definition = firstMeaning.definitions?.[0]?.definition || '';
                }
            }
        }
    } catch (err) {
        console.warn(`Dictionary definition fallback for '${word}':`, err.message);
    }

    if (!translation && !definition) {
        throw new createError(`Could not find information for word '${word}'`, 404);
    }

    res.json({
        success: true,
        data: {
            word,
            translation: translation || 'תרגום אינו זמין כרגע',
            phonetic: phonetic || '',
            partOfSpeech: partOfSpeech || '',
            definition: definition || ''
        }
    });
};
