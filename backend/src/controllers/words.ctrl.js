import { createError } from "../utils/errorHandler.js";

export const getWordInfo = async (req, res) => {
    const { word } = req.params;
    if (!word) throw new createError("Word is required", 400);

    const apiUrl = process.env.DICTIONARY_API_URL 
        ? `${process.env.DICTIONARY_API_URL}/${word}`
        : `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
        if (response.status === 404) {
            throw new createError(`Word '${word}' not found in dictionary`, 404);
        }
        throw new createError("Failed to fetch word from external dictionary", response.status);
    }
    
    const data = await response.json();
    res.json({ success: true, data });
};
