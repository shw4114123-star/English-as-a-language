import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { API_URL } from '../config/api';
import { formatErrorMessage } from '../utils/errorHandler';

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
                throw new Error(data.error || 'Unable to load users. Please try again later.');
            }

            setUsersList(data.data || []);
            return data.data;
        } catch (err) {
            setError(formatErrorMessage(err, 'Unable to load users. Please try again later.'));
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
                throw new Error(data.error || 'Unable to update user role. Please try again later.');
            }

            // עדכון הסטייט המקומי
            setUsersList(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
            return data.data;
        } catch (err) {
            setError(formatErrorMessage(err, 'Unable to update user role. Please try again later.'));
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
                throw new Error(data.error || 'Unable to delete user. Please try again later.');
            }

            // הסרה מהסטייט המקומי
            setUsersList(prev => prev.filter(u => u._id !== userId));
            return true;
        } catch (err) {
            setError(formatErrorMessage(err, 'Unable to delete user. Please try again later.'));
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
