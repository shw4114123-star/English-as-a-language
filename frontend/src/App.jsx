import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { useAuthStore } from './store/authStore';
import { useAuthApi } from './hooks/useAuthApi';

function App() {
  const { fetchUser } = useAuthApi();
  const { setLoading } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow p-4">
        <Routes>
          <Route path="/" element={<div className="container mt-4"><h3>Welcome to English-as-a-language</h3></div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
