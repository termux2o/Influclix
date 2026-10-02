// src/pages/Dashboard.tsx

import React from 'react';

const Dashboard = () => {
  // Get user info from localStorage
  const userEmail = localStorage.getItem('userEmail') || 'User';
  const userName = localStorage.getItem('userName') || 'Influencer Marketer';

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="dashboard-welcome">
        <h1>👋 Welcome back, {userName}!</h1>
        <p>Here's your influencer marketing dashboard overview</p>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-stats-grid">
        <div className="dashboard-stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Influencers</h3>
            <p className="stat-number">2,847</p>
            <span className="stat-change positive">↑ 12.5%</span>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon">📧</div>
          <div className="stat-content">
            <h3>Emails Found</h3>
            <p className="stat-number">1,234</p>
            <span className="stat-change positive">↑ 8.3%</span>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Active Campaigns</h3>
            <p className="stat-number">12</p>
            <span className="stat-change positive">↑ 3 new</span>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>Saved Lists</h3>
            <p className="stat-number">8</p>
            <span className="stat-change">Last updated today</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-quick-actions">
        <h2>⚡ Quick Actions</h2>
        <div className="quick-actions-grid">
          <button className="quick-action-btn" onClick={() => window.location.href = '/search'}>
            🔍 Search Influencers
          </button>
          <button className="quick-action-btn" onClick={() => window.location.href = '/demo'}>
            📋 View Demo Data
          </button>
          <button className="quick-action-btn">
            📧 Find Emails
          </button>
          <button className="quick-action-btn">
            📊 Generate Report
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-recent">
        <h2>📈 Recent Activity</h2>
        <div className="recent-activity-list">
          <div className="activity-item">
            <div className="activity-icon">🔍</div>
            <div className="activity-content">
              <p><strong>You searched</strong> for "Fashion influencers in Mumbai"</p>
              <span className="activity-time">2 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">💾</div>
            <div className="activity-content">
              <p><strong>You saved</strong> Priya Sharma to your list</p>
              <span className="activity-time">5 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">📧</div>
            <div className="activity-content">
              <p><strong>Email found</strong> for Rahul Kumar</p>
              <span className="activity-time">1 day ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">📊</div>
            <div className="activity-content">
              <p><strong>Campaign</strong> "Summer Collection" reached 1.2M views</p>
              <span className="activity-time">2 days ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Influencers */}
      <div className="dashboard-top-influencers">
        <h2>🏆 Top Influencers This Month</h2>
        <div className="top-influencers-grid">
          <div className="top-influencer-card">
            <div className="rank">#1</div>
            <img src="https://i.pravatar.cc/150?img=1" alt="Influencer" />
            <h4>Priya Sharma</h4>
            <p className="handle">@priyasharma</p>
            <div className="top-stats">
              <span>2.5M followers</span>
              <span>4.8% engagement</span>
            </div>
          </div>
          <div className="top-influencer-card">
            <div className="rank">#2</div>
            <img src="https://i.pravatar.cc/150?img=2" alt="Influencer" />
            <h4>Rahul Kumar</h4>
            <p className="handle">@rahulkumar</p>
            <div className="top-stats">
              <span>1.8M followers</span>
              <span>6.2% engagement</span>
            </div>
          </div>
          <div className="top-influencer-card">
            <div className="rank">#3</div>
            <img src="https://i.pravatar.cc/150?img=3" alt="Influencer" />
            <h4>Ananya Singh</h4>
            <p className="handle">@ananyasingh</p>
            <div className="top-stats">
              <span>3.2M followers</span>
              <span>5.1% engagement</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;