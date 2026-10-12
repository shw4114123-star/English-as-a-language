import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import { useAuthApi } from './hooks/useAuthApi';

import { Home } from './pages/Home/Home';
import { Login } from './pages/Login/Login';
import { Register } from './pages/Register/Register';
import { Alphabet } from './pages/Alphabet/Alphabet';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { PlacementTest } from './pages/PlacementTest/PlacementTest';
import { Lessons } from './pages/Lessons/Lessons';
import { LessonDetails } from './pages/LessonDetails/LessonDetails';
import { Games } from './pages/Games/Games';
import { AdminUsers } from './pages/AdminUsers/AdminUsers';
import { TeacherDashboard } from './pages/TeacherDashboard/TeacherDashboard';

const NotFound: React.FC = () => <div className="container mt-5 text-center"><h1>404 Not Found</h1></div>;

export const App: React.FC = () => {
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
    <Routes>
      <Route element={<Layout />}>
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
      </Route>
    </Routes>
  );
};

export default App;
