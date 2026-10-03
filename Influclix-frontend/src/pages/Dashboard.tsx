// src/pages/Dashboard.tsx
import React from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";

const Dashboard = () => {
  const { user, loading, error } = useCurrentUser();

  // Build a friendly display name — fall back gracefully
  const displayName =
    user?.full_name?.trim() ||
    user?.email?.split("@")[0] ||
    "there";

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="dashboard-welcome">
        <h1>
          👋 Welcome back, {loading ? "…" : displayName}!
        </h1>
        <p>
          {error
            ? `⚠️ ${error}`
            : "Here's your influencer marketing dashboard overview"}
        </p>
        {user?.company && (
          <p className="dashboard-company">🏢 {user.company}</p>
        )}
      </div>

      {/* Stats Grid — unchanged, still hardcoded for now */}
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

      {/* Quick Actions — unchanged */}
      <div className="dashboard-quick-actions">
        <h2>⚡ Quick Actions</h2>
        <div className="quick-actions-grid">
          <button className="quick-action-btn" onClick={() => (window.location.href = "/search")}>
            🔍 Search Influencers
          </button>
          <button className="quick-action-btn" onClick={() => (window.location.href = "/demo")}>
            📋 View Demo Data
          </button>
          <button className="quick-action-btn">📧 Find Emails</button>
          <button className="quick-action-btn">📊 Generate Report</button>
        </div>
      </div>

      {/* Recent Activity + Top Influencers — unchanged from your file */}
      {/* ... paste the rest of your original JSX here ... */}
    </div>
  );
};

export default Dashboard;