// src/pages/Login.tsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import React from 'react';

interface LoginProps {
  setIsLoggedIn?: (value: boolean) => void;
}

const Login = ({ setIsLoggedIn }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Demo login - any credentials work
    if (email && password) {
      if (setIsLoggedIn) {
        setIsLoggedIn(true);
      }
      // Store login status in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome Back 👋</h2>
        <p className="subtitle">Login to access your influencer dashboard</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="auth-btn">Login →</button>
        </form>
        
        <div className="auth-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </div>
        <div style={{ 
          marginTop: '1rem', 
          padding: '0.8rem', 
          background: '#f8f9fa', 
          borderRadius: '8px',
          fontSize: '0.85rem',
          color: '#666',
          textAlign: 'center'
        }}>
          🔑 Demo: Use any email & password
        </div>
      </div>
    </div>
  );
};

export default Login;