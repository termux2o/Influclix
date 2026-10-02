import SearchBar from '../components/SearchBar';

const Home = () => {
  return (
    <div>
      <section className="hero">
        {/* Spore-style Badge Pill */}

        {/* Split heading to match Spore typography */}
        <h1 className="hero-title">
          Find <span className="text-script-accent">Top Influencers</span>
          <br />
          On-device intelligence.
        </h1>
        
        <p className="hero-subtitle">
          Search 50M+ creators on Instagram, YouTube & TikTok. 
          No accounts. No data collection. No strings attached.
        </p>

        <div className="search-container">
          <SearchBar placeholder="Search influencers by name, niche, or location..." />
        </div>
      </section>

      <section>
        <h2 className="section-title">
          Why Influclix?
        </h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🔍 Advanced Filters</h3>
            <p>Filter by location, followers, engagement rate, niche, and more</p>
          </div>
          <div className="feature-card">
            <h3>📊 Audience Analytics</h3>
            <p>Check demographics, interests, and fake follower detection</p>
          </div>
          <div className="feature-card">
            <h3>📧 Bulk Email Finder</h3>
            <p>Get influencer contact emails in 1 click for outreach</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;