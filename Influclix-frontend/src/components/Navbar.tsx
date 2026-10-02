// src/components/Navbar.tsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  SparkleIcon, 
  SearchIcon, 
  DashboardIcon, 
  TargetIcon, 
  LogoutIcon, 
  LoginIcon 
} from './Icons'; // <-- Import all icons

interface NavbarProps {
  isLoggedIn?: boolean;
  setIsLoggedIn?: (value: boolean) => void;
}

const Navbar = ({ isLoggedIn = false, setIsLoggedIn }: NavbarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (setIsLoggedIn) setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        {/* Brand Logo - Now using SparkleIcon component */}
        <div className="logo">
          <Link to="/" className="brand-logo-container">
            <span className="brand-icon-wrapper">
              <SparkleIcon size={18} className="brand-sparkle-icon" />
            </span>
            <span>Influclix</span>
          </Link>
        </div>

        <ul className="nav-links">
          <li><Link to="/" className="nav-btn">Home</Link></li>
          
          {isLoggedIn ? (
            <>
              {/* Search - Using SearchIcon instead of 🔍 */}
              <li>
                <Link to="/search" className="nav-btn">
                  <SearchIcon size={16} /> Search
                </Link>
              </li>
              {/* Dashboard - Using DashboardIcon instead of 📊 */}
              <li>
                <Link to="/dashboard" className="nav-btn">
                  <DashboardIcon size={16} /> Dashboard
                </Link>
              </li>
              {/* Demo Data - Using TargetIcon instead of 🎯 */}
              <li>
                <Link to="/demo" className="nav-btn">
                  <TargetIcon size={16} /> Demo Data
                </Link>
              </li>
              {/* Logout - Using LogoutIcon instead of 🚪 */}
              <li>
                <button onClick={handleLogout} className="nav-btn logout-btn">
                  <LogoutIcon size={16} /> Logout
                </button>
              </li>
            </>
          ) : (
            <>
              {/* Login - Using LoginIcon instead of 🔑 */}
              <li>
                <Link to="/login" className="nav-btn login-btn">
                  <LoginIcon size={16} /> Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="nav-btn signup-btn">
                  <SparkleIcon size={16} useGradient={false} color="white" /> Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;