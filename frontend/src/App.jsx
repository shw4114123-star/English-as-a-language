import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Alphabet } from './pages/Alphabet';
import { Dashboard } from './pages/Dashboard';
import { PlacementTest } from './pages/PlacementTest';
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
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/alphabet" element={<Alphabet />} />
          <Route path="/placement-test" element={<PlacementTest />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
