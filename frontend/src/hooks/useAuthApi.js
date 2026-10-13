import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { API_URL } from '../config/api';

export const useAuthApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { login, logout, setLoading: setGlobalLoading } = useAuthStore(); //setGlobalLoading is not a type but is an alias for setLoading in store

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
            console.error("Failed to fetch user", err);
            logout();
        } finally {
            setGlobalLoading(false);
        }
    };

    const fetchLoginUser = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Login failed');

            login(data.data.user, data.data.token);
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const fetchRegisterUser = async (userName, email, password, fullName) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName, email, password, fullName })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Registration failed');

            login(data.data.user, data.data.token);
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { fetchUser, fetchLoginUser, fetchRegisterUser, loading, error };
};
