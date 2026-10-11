import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useAdminApi = () => {
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { logout } = useAuthStore();

    // שליפת כל המשתמשים במערכת
    const fetchAllUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            if (!res.ok) {
                if (res.status === 401) logout();
                throw new Error(data.error || 'Failed to fetch users');
            }

            setUsersList(data.data || []);
            return data.data;
        } catch (err) {
            setError(err.message);
            return [];
        } finally {
            setLoading(false);
        }
    };

    // עדכון פרטי משתמש (כולל תפקיד role)
    const fetchUpdateUserRole = async (userId, newRole) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/users/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ role: newRole })
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to update user role');
            }

            // עדכון הסטייט המקומי
            setUsersList(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
            return data.data;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // מחיקת משתמש
    const fetchDeleteUser = async (userId) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to delete user');
            }

            // הסרה מהסטייט המקומי
            setUsersList(prev => prev.filter(u => u._id !== userId));
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        usersList,
        loading,
        error,
        fetchAllUsers,
        fetchUpdateUserRole,
        fetchDeleteUser
    };
};
