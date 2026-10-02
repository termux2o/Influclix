// src/pages/DemoDashboard.tsx

import { useState } from 'react';
import { Link } from 'react-router-dom';

// Mock Data
const MOCK_INFLUENCERS = [
  {
    id: 1,
    name: 'Priya Sharma',
    handle: 'priyasharma',
    avatar: 'https://i.pravatar.cc/150?img=1',
    platform: 'Instagram',
    followers: '2.5M',
    engagement: '4.8%',
    location: 'Mumbai',
    niche: 'Fashion & Lifestyle',
    email: 'priya@example.com',
    age: '25-34',
    gender: '70% Female',
    topCities: ['Mumbai', 'Delhi', 'Bangalore'],
    recentPosts: 12,
    avgLikes: '45K',
    growthRate: '+8.2%',
    verified: true
  },
  {
    id: 2,
    name: 'Rahul Kumar',
    handle: 'rahulkumar',
    avatar: 'https://i.pravatar.cc/150?img=2',
    platform: 'YouTube',
    followers: '1.8M',
    engagement: '6.2%',
    location: 'Delhi',
    niche: 'Tech & Gaming',
    email: 'rahul@example.com',
    age: '18-24',
    gender: '80% Male',
    topCities: ['Delhi', 'Mumbai', 'Pune'],
    recentPosts: 8,
    avgLikes: '120K',
    growthRate: '+12.5%',
    verified: true
  },
  {
    id: 3,
    name: 'Ananya Singh',
    handle: 'ananyasingh',
    avatar: 'https://i.pravatar.cc/150?img=3',
    platform: 'Instagram',
    followers: '3.2M',
    engagement: '5.1%',
    location: 'Bangalore',
    niche: 'Food & Travel',
    email: 'ananya@example.com',
    age: '25-34',
    gender: '65% Female',
    topCities: ['Bangalore', 'Mumbai', 'Delhi'],
    recentPosts: 15,
    avgLikes: '62K',
    growthRate: '+6.7%',
    verified: false
  },
  {
    id: 4,
    name: 'Vikram Patel',
    handle: 'vikrampatel',
    avatar: 'https://i.pravatar.cc/150?img=4',
    platform: 'TikTok',
    followers: '4.1M',
    engagement: '7.3%',
    location: 'Mumbai',
    niche: 'Comedy & Entertainment',
    email: 'vikram@example.com',
    age: '18-24',
    gender: '55% Male',
    topCities: ['Mumbai', 'Delhi', 'Chennai'],
    recentPosts: 20,
    avgLikes: '85K',
    growthRate: '+15.3%',
    verified: true
  },
  {
    id: 5,
    name: 'Neha Gupta',
    handle: 'nehagupta',
    avatar: 'https://i.pravatar.cc/150?img=5',
    platform: 'YouTube',
    followers: '890K',
    engagement: '4.2%',
    location: 'Chennai',
    niche: 'Education & Career',
    email: 'neha@example.com',
    age: '25-34',
    gender: '60% Female',
    topCities: ['Chennai', 'Bangalore', 'Hyderabad'],
    recentPosts: 6,
    avgLikes: '45K',
    growthRate: '+4.1%',
    verified: false
  }
];

const DemoDashboard = () => {
  const [selectedInfluencer, setSelectedInfluencer] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="demo-dashboard">
      <div className="demo-header">
        <div>
          <h1>🎯 Influencer Discovery Demo</h1>
          <p>Showing how influencer data will look in your dashboard</p>
        </div>
        <div className="demo-controls">
          <button 
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            📱 Grid
          </button>
          <button 
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            📋 List
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="demo-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Influencers</h3>
            <p className="stat-number">{MOCK_INFLUENCERS.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>Avg Engagement</h3>
            <p className="stat-number">5.5%</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <h3>Avg Growth</h3>
            <p className="stat-number">+9.3%</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📍</div>
          <div className="stat-info">
            <h3>Top Cities</h3>
            <p className="stat-number">5 Cities</p>
          </div>
        </div>
      </div>

      {/* Influencer Grid/List */}
      <div className="demo-section">
        <h2>📋 Influencer Database</h2>
        <div className={`influencer-container ${viewMode}`}>
          {MOCK_INFLUENCERS.map((influencer) => (
            <div 
              key={influencer.id} 
              className={`influencer-item ${viewMode === 'grid' ? 'grid-view' : 'list-view'}`}
              onClick={() => setSelectedInfluencer(influencer)}
            >
              <img src={influencer.avatar} alt={influencer.name} />
              <div className="influencer-info">
                <div className="influencer-header">
                  <h3>{influencer.name}</h3>
                  {influencer.verified && <span className="verified-badge">✅ Verified</span>}
                </div>
                <p className="handle">@{influencer.handle}</p>
                <div className="influencer-tags">
                  <span className="tag platform">{influencer.platform}</span>
                  <span className="tag niche">{influencer.niche}</span>
                  <span className="tag location">📍 {influencer.location}</span>
                </div>
                <div className="influencer-stats">
                  <span>👥 {influencer.followers}</span>
                  <span>❤️ {influencer.engagement}</span>
                  <span>📈 {influencer.growthRate}</span>
                </div>
                <div className="influencer-actions">
                  <button className="view-profile-btn">View Profile</button>
                  <button className="contact-btn">📧 Get Email</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Influencer Details - Modal/Popup */}
      {selectedInfluencer && (
        <div className="demo-modal" onClick={() => setSelectedInfluencer(null)}>
          <div className="demo-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedInfluencer(null)}>✕</button>
            
            <div className="modal-profile">
              <img src={selectedInfluencer.avatar} alt={selectedInfluencer.name} className="modal-avatar" />
              <div className="modal-header-info">
                <h2>{selectedInfluencer.name}</h2>
                <p className="modal-handle">@{selectedInfluencer.handle}</p>
                <div className="modal-badges">
                  <span className="badge platform">{selectedInfluencer.platform}</span>
                  <span className="badge verified">{selectedInfluencer.verified ? '✅ Verified' : '🔄 Unverified'}</span>
                </div>
              </div>
            </div>

            <div className="modal-grid">
              <div className="modal-stat">
                <h4>Followers</h4>
                <p>{selectedInfluencer.followers}</p>
              </div>
              <div className="modal-stat">
                <h4>Engagement</h4>
                <p>{selectedInfluencer.engagement}</p>
              </div>
              <div className="modal-stat">
                <h4>Growth Rate</h4>
                <p>{selectedInfluencer.growthRate}</p>
              </div>
              <div className="modal-stat">
                <h4>Recent Posts</h4>
                <p>{selectedInfluencer.recentPosts}</p>
              </div>
            </div>

            <div className="modal-details">
              <div className="detail-row">
                <span className="detail-label">📍 Location:</span>
                <span>{selectedInfluencer.location}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">🎯 Niche:</span>
                <span>{selectedInfluencer.niche}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">👤 Age Group:</span>
                <span>{selectedInfluencer.age}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">⚥ Gender:</span>
                <span>{selectedInfluencer.gender}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">🏙️ Top Cities:</span>
                <span>{selectedInfluencer.topCities.join(', ')}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">📧 Email:</span>
                <span className="email-value">{selectedInfluencer.email}</span>
              </div>
            </div>

            <div className="modal-actions">
              <button className="primary-btn">📧 Contact Now</button>
              <button className="secondary-btn">💾 Save to List</button>
              <button className="secondary-btn">📊 View Analytics</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoDashboard;