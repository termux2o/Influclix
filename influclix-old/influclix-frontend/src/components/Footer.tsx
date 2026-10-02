// src/components/Footer.tsx

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-brand">
          <h2>✨ InfluencerSync</h2>
          <p>India's leading influencer discovery platform. Find, analyze, and connect with top creators across Instagram, YouTube, and TikTok.</p>
          <div className="footer-social">
            <a href="#" className="social-icon">📱</a>
            <a href="#" className="social-icon">🐦</a>
            <a href="#" className="social-icon">📺</a>
            <a href="#" className="social-icon">💼</a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Platform</h3>
          <ul>
            <li><a href="/search">🔍 Search Influencers</a></li>
            <li><a href="/dashboard">📊 Dashboard</a></li>
            <li><a href="#">📧 Email Finder</a></li>
            <li><a href="#">📈 Analytics</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div className="footer-links">
          <h3>Resources</h3>
          <ul>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Case Studies</a></li>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">API Documentation</a></li>
          </ul>
        </div>

        {/* Company */}
        <div className="footer-links">
          <h3>Company</h3>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-newsletter">
          <h3>📬 Stay Updated</h3>
          <p>Get the latest influencer marketing insights</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
          <div className="footer-badges">
            <span className="badge">✅ GDPR Compliant</span>
            <span className="badge">🔒 100% Secure</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>© 2026 InfluencerSync India. Made with ❤️ for Indian creators & brands</p>
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