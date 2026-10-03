// src/pages/Search.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import FilterSidebar from "../components/FilterSidebar";
import InfluencerCard from "../components/InfluencerCard";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import { useFilterOptions } from "../hooks/useFilterOptions";
import { useSearchInfluencers, SearchInfluencer } from "../hooks/useSearchInfluencers";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useSearchUsage } from "../hooks/useSearchUsage";

const formatFollowers = (n: number): string => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
};

const Search = () => {
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const isPaid = (user?.subscription_type ?? 0) > 0;

  const { usage, refresh: refreshUsage } = useSearchUsage();
  const { options, loading: optionsLoading } = useFilterOptions();

  const [draftFilters, setDraftFilters] = useState<any>({
    category: null,
    platform: null,
    location: null,
    followers: null,
    has_email: false,
    has_phone: false,
    has_website: false,
    has_social: false,
  });

  const [activeFilters, setActiveFilters] = useState<any>({});
  const [selected, setSelected] = useState<SearchInfluencer | null>(null);
  const [quotaHit, setQuotaHit] = useState(false);

  const backendFilters = useMemo(() => {
    const payload: any = {};
    if (activeFilters.category) payload.category = activeFilters.category;
    if (activeFilters.platform) payload.platform = activeFilters.platform;
    if (activeFilters.location) payload.location = activeFilters.location;

    if (activeFilters.followers) {
      const [min, max] = activeFilters.followers.split("-").map(Number);
      if (!isNaN(min)) payload.min_followers = min;
      if (!isNaN(max)) payload.max_followers = max;
    }

    // Paid-only filters — only sent when user is paid
    if (isPaid) {
      if (activeFilters.has_email) payload.has_email = true;
      if (activeFilters.has_phone) payload.has_phone = true;
      if (activeFilters.has_website) payload.has_website = true;
      if (activeFilters.has_social) payload.has_social = true;
    }

    return payload;
  }, [activeFilters, isPaid]);

  const { data, loading, error, refetch } = useSearchInfluencers(backendFilters);

  // Refetch usage after every successful search
  useEffect(() => {
    if (!loading && !error && data) refreshUsage();
  }, [data, loading, error, refreshUsage]);

  // Detect 402 quota errors
  useEffect(() => {
    if (error && error.toLowerCase().includes("limit")) {
      setQuotaHit(true);
    }
  }, [error]);

  const handleApply = () => {
    setQuotaHit(false);
    setActiveFilters({ ...draftFilters });
  };

  const handleClear = () => {
    setDraftFilters({
      category: null,
      platform: null,
      location: null,
      followers: null,
      has_email: false,
      has_phone: false,
      has_website: false,
      has_social: false,
    });
    setActiveFilters({});
    setQuotaHit(false);
  };

  return (
    <div className="search-page">
      {/* Sidebar */}
      <div className="search-sidebar">
        {optionsLoading ? (
          <Loader message="Loading filters…" size="small" />
        ) : (
          <FilterSidebar
            filters={draftFilters}
            setFilters={setDraftFilters}
            onApply={handleApply}
            isPaid={isPaid}
            onUpgradeClick={() => navigate("/pricing")}
            options={{
              categories: options?.categories ?? [],
              platforms: options?.platforms ?? ["instagram", "youtube", "tiktok"],
              cities: options?.cities ?? [],
              countries: options?.countries ?? [],
            }}
          />
        )}
      </div>

      {/* Results */}
      <div className="search-results">
        {/* Usage banner for free users */}
        {!isPaid && usage && (
          <div className={`usage-banner ${usage.remaining === 0 ? "exhausted" : ""}`}>
            <span>
              You've used <strong>{usage.used}</strong> of{" "}
              <strong>{usage.limit}</strong> free searches.
            </span>
            {usage.remaining === 0 ? (
              <button
                className="upgrade-cta"
                onClick={() => navigate("/pricing")}
              >
                ⚡ Upgrade to continue
              </button>
            ) : (
              <span className="remaining">{usage.remaining} left</span>
            )}
          </div>
        )}

        <div style={{ marginBottom: "1rem" }}>
          <p>
            {loading
              ? "Searching…"
              : `Showing ${data?.influencers.length ?? 0} of ${
                  data?.total ?? 0
                } influencers`}
          </p>
        </div>

        {loading ? (
          <Loader message="Loading influencers…" size="large" />
        ) : quotaHit ? (
          <div className="usage-exceeded">
            <h2>Free search limit reached</h2>
            <p>You've used all {usage?.limit} free searches.</p>
            <button onClick={() => navigate("/pricing")}>
              See upgrade options
            </button>
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : data?.influencers.length === 0 ? (
          <div className="no-results">
            <p>😕 No influencers match your filters.</p>
            <button onClick={handleClear}>Clear filters</button>
          </div>
        ) : (
          <div className="influencer-grid">
            {data?.influencers.map((inf) => (
              <InfluencerCard
                key={inf.id}
                influencer={{
                  id: inf.id,
                  name: inf.display_name || inf.username,
                  handle: inf.username,
                  avatar:
                    inf.profile_image_url ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      inf.display_name || inf.username
                    )}`,
                  followers: formatFollowers(inf.followers),
                  engagement: 0,
                  platform: inf.instagram
                    ? "Instagram"
                    : inf.youtube
                    ? "YouTube"
                    : inf.tiktok
                    ? "TikTok"
                    : inf.twitter
                    ? "Twitter"
                    : inf.linkedin
                    ? "LinkedIn"
                    : "—",
                }}
                onViewProfile={() => setSelected(inf)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div className="demo-modal" onClick={() => setSelected(null)}>
          <div
            className="demo-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setSelected(null)}>
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

              {/* Email — locked for free users */}
              <div className="detail-row">
                <span className="detail-label">📧 Email:</span>
                {isPaid ? (
                  <span className="email-value">
                    {selected.email || "Not available"}
                  </span>
                ) : (
                  <button
                    className="locked-contact"
                    onClick={() => navigate("/pricing")}
                  >
                    🔒 Upgrade to view
                  </button>
                )}
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
              {isPaid && selected.email && (
                <a className="primary-btn" href={`mailto:${selected.email}`}>
                  📧 Contact Now
                </a>
              )}
              {!isPaid && (
                <button
                  className="primary-btn"
                  onClick={() => navigate("/pricing")}
                >
                  ⚡ Upgrade to Contact
                </button>
              )}
              <button className="secondary-btn">💾 Save to List</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;