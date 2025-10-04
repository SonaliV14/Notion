import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { PageProvider } from "./contexts/PageContext.jsx";
import LandingPage from './pages/LandingPage.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ContactUs from './pages/ContactUs.jsx';
import Dashboard from './pages/Dashboard.jsx';
import NewPage from './pages/NewPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/page/:id"
        element={
          <ProtectedRoute>
            <NewPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <PageProvider>
        <Router>
          <div className="min-h-screen bg-black">
            <AppRoutes />
          </div>
        </Router>
      </PageProvider>
    </AuthProvider>
  );
}

export default App;