import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const useLessonsApi = () => {
    // סטייט שמחזיק את מערך כל השיעורים
    const [lessons, setLessons] = useState([]);
    
    // סטייט שמחזיק את השיעור הבודד שנבחר
    const [currentLesson, setCurrentLesson] = useState(null);
    
    // סטייט לסימון מצב טעינה
    const [loading, setLoading] = useState(false);
    
    // סטייט לשגיאות
    const [error, setError] = useState(null);

    const { logout } = useAuthStore();

    // קריאת רשימת כל השיעורים מהשרת
    const fetchAllLessons = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/lessons`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            if (!res.ok) {
                if (res.status === 401) logout();
                throw new Error(data.error || 'Failed to fetch lessons');
            }

            setLessons(data.data || []);
            return data.data;
        } catch (err) {
            setError(err.message);
            return [];
        } finally {
            setLoading(false);
        }
    };

    // קריאת שיעור ספציפי לפי מזהה (id)
    const fetchLessonById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/lessons/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            if (!res.ok) {
                if (res.status === 401) logout();
                throw new Error(data.error || 'Failed to fetch lesson');
            }

            setCurrentLesson(data.data);
            return data.data;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // יצירת שיעור חדש (למורים ומנהלים)
    const fetchCreateLesson = async (lessonData) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/lessons`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(lessonData)
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to create lesson');
            }

            return data.data;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        lessons,
        currentLesson,
        loading,
        error,
        fetchAllLessons,
        fetchLessonById,
        fetchCreateLesson
    };
};
