// src/components/Navbar.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiCall } from '../config/Api';
import { ENV } from '../config/Environment';
import {
  SparkleIcon,
  SearchIcon,
  DashboardIcon,
  TargetIcon,
  LogoutIcon,
  LoginIcon,
} from './Icons';

interface NavbarProps {
  isLoggedIn?: boolean;
  setIsLoggedIn?: (value: boolean) => void;
}

const Navbar = ({ isLoggedIn = false, setIsLoggedIn }: NavbarProps) => {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);

    // 1. Ask backend to clear the httpOnly cookie
    await apiCall('/auth/logout', { method: 'POST' });

    // 2. Flip React state so ProtectedRoute sends the user out
    setIsLoggedIn?.(false);

    // 3. Redirect home (or to /login — your choice)
    setLoggingOut(false);
    navigate(ENV.ROUTES.HOME, { replace: true });
  };

  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
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
              <li>
                <Link to="/search" className="nav-btn">
                  <SearchIcon size={16} /> Search
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="nav-btn">
                  <DashboardIcon size={16} /> Dashboard
                </Link>
              </li>
              <li>
                <Link to="/demo" className="nav-btn">
                  <TargetIcon size={16} /> Demo Data
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="nav-btn logout-btn"
                  disabled={loggingOut}
                >
                  <LogoutIcon size={16} /> {loggingOut ? 'Logging out…' : 'Logout'}
                </button>
              </li>
            </>
          ) : (
            <>
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