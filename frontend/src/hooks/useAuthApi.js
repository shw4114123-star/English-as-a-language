import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useAuthApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { login, logout, setLoading: setGlobalLoading } = useAuthStore();

    const fetchUser = async (token) => {
        try {
            setGlobalLoading(true);
            const res = await fetch(`${API_URL}/users/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                login(data.data, token);
            } else {
                logout();
            }
        } catch (err) {
            logout();
        } finally {
            setGlobalLoading(false);
        }
    };

    return { fetchUser, loading, error };
};
