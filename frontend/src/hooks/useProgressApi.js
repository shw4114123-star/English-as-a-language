import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { API_URL } from '../config/api';

export const useProgressApi = () => {
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { logout } = useAuthStore();

    const normalizeProgress = (data) => {
        if (!data) return null;
        return {
            ...data,
            xp: typeof data.xp === 'number' ? data.xp : 0,
            level: data.level || 'Beginner',
            completedLessons: Array.isArray(data.completedLessons) ? data.completedLessons : [],
            gameScores: Array.isArray(data.gameScores) ? data.gameScores : [],
            placementTestScore: typeof data.placementTestScore === 'number' ? data.placementTestScore : 0
        };
    };

    const fetchProgress = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setProgress(null);
                return null;
            }
            const res = await fetch(`${API_URL}/progress/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (!res.ok) {
                if (res.status === 401) logout();
                throw new Error(data.error || 'Failed to fetch progress');
            }
            
            const normalized = normalizeProgress(data.data);
            setProgress(normalized);
            return normalized;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const fetchUpdateProgress = async (updateData) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('You must be logged in to save progress');
            }
            const res = await fetch(`${API_URL}/progress/me`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });
            const data = await res.json();

            if (!res.ok) {
                if (res.status === 401) logout();
                throw new Error(data.error || 'Failed to update progress');
            }

            const normalized = normalizeProgress(data.data);
            setProgress(normalized);
            return normalized;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { progress, fetchProgress, fetchUpdateProgress, loading, error };
};
