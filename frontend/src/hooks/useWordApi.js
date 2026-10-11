import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const useWordApi = () => {
    const [wordData, setWordData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // קריאת מידע על מילה מילונית מהשרת
    const fetchWordDetails = async (word) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/words/${encodeURIComponent(word)}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to fetch word details');
            }

            setWordData(data.data);
            return data.data;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        wordData,
        loading,
        error,
        fetchWordDetails
    };
};
