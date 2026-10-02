// src/components/Footer.tsx

import { Link } from 'react-router-dom';
import { SparkleIcon } from './Icons'; // <-- Import the reusable icon

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Side: Brand & Description */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            {/* Replaced inline SVG with reusable SparkleIcon component */}
            <span className="footer-brand-icon-wrapper">
              <SparkleIcon size={18} className="brand-sparkle-icon" />
            </span>
            <span>Influclix</span>
          </Link>
          <p>
            Your data stays on your machine. Connect, query, explore, and
            dashboard — without ever shipping a row of it to the cloud.
          </p>
        </div>

        {/* Right Side: Simple Links */}
        <div className="footer-links-group">
          <div className="footer-links">
            <h3>Platform</h3>
            <ul>
              <li><Link to="/search">Search Influencers</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><a href="#">Email Finder</a></li>
              <li><a href="#">Analytics</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h3>Get Started</h3>
            <ul>
              <li><a href="#">Contributing</a></li>
              <li><a href="#">License</a></li>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">Report an Issue</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>© 2026 Influclix</p>
          <div className="footer-bottom-links">
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Cookies</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;