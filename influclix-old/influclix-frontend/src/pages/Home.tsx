import SearchBar from '../components/SearchBar';

const Home = () => {
  return (
    <div>
      <section className="hero">
        <h1>🇮🇳 Find India's Top Influencers</h1>
        <p>Search 50M+ creators on Instagram, YouTube & TikTok</p>
        <div className="search-container">
          <SearchBar placeholder="Search influencers by name, niche, or location..." />
        </div>
      </section>

      <section>
        <h2 style={{ 
          textAlign: 'center', 
          fontSize: '2rem', 
          marginTop: '2rem',
          background: 'linear-gradient(135deg, #FF6B35, #138808)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Why InfluencerSync?
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