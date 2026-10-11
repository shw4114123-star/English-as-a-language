import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    currentUser: null,
    isAuthenticated: false,
    loading: true, // initial loading state when app starts

    login: (user, token) => {
        localStorage.setItem('token', token);
        set({ currentUser: user, isAuthenticated: true, loading: false });
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ currentUser: null, isAuthenticated: false, loading: false });
    },

    setLoading: (isLoading) => set({ loading: isLoading }),
}));
