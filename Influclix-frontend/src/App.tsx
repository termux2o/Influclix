// src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DemoDashboard from './pages/DemoDashboard';
import Loader from './components/Loader';                        // ← NEW
import { apiCall } from './config/Api';
import Pricing from './pages/Pricing';                    // ← NEW


import React from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [booting, setBooting] = useState(true);

  // ── Ask the server on mount: "who am I?" ──
  useEffect(() => {
    (async () => {
      const { ok } = await apiCall('/auth/me');
      setIsLoggedIn(ok);
      setBooting(false);
    })();
  }, []);

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (booting) {
      return <Loader message="Checking your session…" size="large" fullScreen />;
    }
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/search" element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            } />
            <Route path="/influencer/:id" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/demo" element={
              <ProtectedRoute>
                <DemoDashboard />
              </ProtectedRoute>
            } />
             <Route path="/pricing" element={<ProtectedRoute><Pricing /></ProtectedRoute>} />   {/* ← NEW */}
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;