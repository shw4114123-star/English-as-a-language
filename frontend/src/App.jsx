import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import { useAuthApi } from './hooks/useAuthApi';

import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Alphabet } from './pages/Alphabet';
import { Dashboard } from './pages/Dashboard';
import { PlacementTest } from './pages/PlacementTest';
import { Lessons } from './pages/Lessons';
import { LessonDetails } from './pages/LessonDetails';
import { Games } from './pages/Games';
import { AdminUsers } from './pages/AdminUsers';
import { TeacherDashboard } from './pages/TeacherDashboard';

const NotFound = () => <div className="container mt-5 text-center"><h1>404 Not Found</h1></div>;

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
          
          {/* Protected Routes */}
          <Route path="/lessons" element={
            <ProtectedRoute>
              <Lessons />
            </ProtectedRoute>
          } />
          <Route path="/lessons/:id" element={
            <ProtectedRoute>
              <LessonDetails />
            </ProtectedRoute>
          } />
          <Route path="/games" element={
            <ProtectedRoute>
              <Games />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Role-Protected Admin & Teacher Routes */}
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="/teacher" element={
            <ProtectedRoute allowedRoles={['teacher', 'admin']}>
              <TeacherDashboard />
            </ProtectedRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
