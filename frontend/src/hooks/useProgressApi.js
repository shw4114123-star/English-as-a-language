import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useProgressApi = () => {
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { logout } = useAuthStore();

    const fetchProgress = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/progress/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (!res.ok) {
                if (res.status === 401) logout();
                throw new Error(data.error || 'Failed to fetch progress');
            }
            
            setProgress(data.data);
            return data.data;
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

            setProgress(data.data);
            return data.data;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { progress, fetchProgress, fetchUpdateProgress, loading, error };
};
