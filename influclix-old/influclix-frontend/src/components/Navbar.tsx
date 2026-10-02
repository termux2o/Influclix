// src/components/Navbar.tsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  isLoggedIn?: boolean;
  setIsLoggedIn?: (value: boolean) => void;
}

const Navbar = ({ isLoggedIn = false, setIsLoggedIn }: NavbarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (setIsLoggedIn) {
      setIsLoggedIn(false);
    }
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">✨ InfluencerSync</Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        {isLoggedIn ? (
          <>
            <li><Link to="/search">🔍 Search</Link></li>
            <li><Link to="/dashboard">📊 Dashboard</Link></li>
            <li><Link to="/demo">🎯 Demo Data</Link></li>
            <li>
              <button 
                onClick={handleLogout} 
                className="nav-btn logout-btn"
                style={{
                  background: '#dc3545',
                  color: 'white !important',
                  padding: '0.6rem 1.5rem',
                  borderRadius: '50px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem',
                  boxShadow: '0 4px 15px rgba(220, 53, 69, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(220, 53, 69, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(220, 53, 69, 0.3)';
                }}
              >
                🚪 Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link 
                to="/login" 
                className="nav-btn login-btn"
                style={{
                  background: 'linear-gradient(135deg, #FF6B35, #138808)',
                  color: 'white !important',
                  padding: '0.6rem 1.5rem',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
                  transition: 'all 0.3s ease',
                  display: 'inline-block'
                }}
              >
                🔑 Login
              </Link>
            </li>
            <li>
              <Link 
                to="/signup" 
                className="nav-btn signup-btn"
                style={{
                  background: '#138808',
                  color: 'white !important',
                  padding: '0.6rem 1.5rem',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  boxShadow: '0 4px 15px rgba(19, 136, 8, 0.3)',
                  transition: 'all 0.3s ease',
                  display: 'inline-block'
                }}
              >
                ✨ Sign Up
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;