// src/pages/DemoDashboard.tsx
import { useState } from "react";
import { useDemoData, DemoInfluencer } from "../hooks/useDemoData";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
// Format large follower numbers → "1.2M", "45K", "892"
const formatFollowers = (n: number): string => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
};

const DemoDashboard = () => {
  const { data, loading, error } = useDemoData();
  const [selected, setSelected] = useState<DemoInfluencer | null>(null);

      
    if (loading) {
      return (
        <div className="demo-dashboard">
          <Loader message="Loading demo data…" size="large" />
        </div>
      );
    }

    if (error || !data) {
      return (
        <div className="demo-dashboard">
          <ErrorState
            message={error || "No demo data available."}
            onRetry={() => window.location.reload()}
          />
        </div>
      );
    }

  return (
    <div className="demo-dashboard">
      <div className="demo-header">
        <div>
          <h1>🎯 Influencer Discovery Demo</h1>
          <p>
            Top creators by followers in each category — pulled live from your
            database.
          </p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="demo-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Influencers</h3>
            <p className="stat-number">{data.total_influencers}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🗂️</div>
          <div className="stat-info">
            <h3>Categories</h3>
            <p className="stat-number">{data.total_categories}</p>
          </div>
        </div>
      </div>

      {/* One section per category */}
      {data.groups.map((group) => (
        <div className="demo-section" key={group.category}>
          <h2>
            📂 {group.category}{" "}
            <span style={{ fontSize: "0.7em", color: "#6b7280" }}>
              ({group.count} total — showing top {group.influencers.length})
            </span>
          </h2>

          <div className="influencer-container grid">
            {group.influencers.map((inf) => (
              <div
                key={inf.id}
                className="influencer-item grid-view"
                onClick={() => setSelected(inf)}
              >
                <img
                  src={
                    inf.profile_image_url ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      inf.display_name || inf.username
                    )}`
                  }
                  alt={inf.display_name || inf.username}
                />
                <div className="influencer-info">
                  <div className="influencer-header">
                    <h3>{inf.display_name || inf.username}</h3>
                    {inf.verified && (
                      <span className="verified-badge">✅ Verified</span>
                    )}
                  </div>
                  <p className="handle">@{inf.username}</p>

                  <div className="influencer-tags">
                    {inf.category && (
                      <span className="tag platform">{inf.category}</span>
                    )}
                    {inf.tags.slice(0, 2).map((t) => (
                      <span className="tag niche" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="influencer-stats">
                    <span>👥 {formatFollowers(inf.followers)}</span>
                    {inf.following > 0 && (
                      <span>👣 {formatFollowers(inf.following)}</span>
                    )}
                  </div>

                  <div className="influencer-actions">
                    <button className="view-profile-btn">View Profile</button>
                    <button
                      className="contact-btn"
                      disabled={!inf.email}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (inf.email) window.location.href = `mailto:${inf.email}`;
                      }}
                    >
                      {inf.email ? "📧 Email" : "🔒 No Email"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Modal */}
      {selected && (
        <div className="demo-modal" onClick={() => setSelected(null)}>
          <div
            className="demo-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelected(null)}
            >
              ✕
            </button>

            <div className="modal-profile">
              <img
                src={
                  selected.profile_image_url ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                    selected.display_name || selected.username
                  )}`
                }
                alt={selected.display_name || selected.username}
                className="modal-avatar"
              />
              <div className="modal-header-info">
                <h2>{selected.display_name || selected.username}</h2>
                <p className="modal-handle">@{selected.username}</p>
                <div className="modal-badges">
                  {selected.category && (
                    <span className="badge platform">{selected.category}</span>
                  )}
                  <span className="badge verified">
                    {selected.verified ? "✅ Verified" : "🔄 Unverified"}
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-grid">
              <div className="modal-stat">
                <h4>Followers</h4>
                <p>{formatFollowers(selected.followers)}</p>
              </div>
              <div className="modal-stat">
                <h4>Following</h4>
                <p>{formatFollowers(selected.following)}</p>
              </div>
            </div>

            <div className="modal-details">
              {selected.bio && (
                <div className="detail-row">
                  <span className="detail-label">📝 Bio:</span>
                  <span>{selected.bio}</span>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-label">🎯 Tags:</span>
                <span>{selected.tags.join(", ") || "—"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">📧 Email:</span>
                <span className="email-value">
                  {selected.email || "Not available"}
                </span>
              </div>

              {selected.instagram && (
                <div className="detail-row">
                  <span className="detail-label">📸 Instagram:</span>
                  <a
                    href={selected.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selected.instagram}
                  </a>
                </div>
              )}
              {selected.youtube && (
                <div className="detail-row">
                  <span className="detail-label">▶️ YouTube:</span>
                  <a
                    href={selected.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selected.youtube}
                  </a>
                </div>
              )}
              {selected.website && (
                <div className="detail-row">
                  <span className="detail-label">🌐 Website:</span>
                  <a
                    href={selected.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selected.website}
                  </a>
                </div>
              )}
            </div>

            <div className="modal-actions">
              {selected.email && (
                <a
                  className="primary-btn"
                  href={`mailto:${selected.email}`}
                >
                  📧 Contact Now
                </a>
              )}
              <button className="secondary-btn">💾 Save to List</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoDashboard;