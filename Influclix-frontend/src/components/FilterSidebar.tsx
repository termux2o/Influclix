// src/components/FilterSidebar.tsx

interface FilterSidebarProps {
  filters: any;
  setFilters: (f: any) => void;
  onApply: () => void;
  options: {
    categories: string[];
    platforms: string[];
    cities: string[];
    countries: string[];
  };
  isPaid: boolean;              // ← NEW
  onUpgradeClick: () => void;   // ← NEW
}

const FilterSidebar = ({
  filters,
  setFilters,
  onApply,
  options,
  isPaid,
  onUpgradeClick,
}: FilterSidebarProps) => {
  const update = (key: string, value: any) =>
    setFilters((prev: any) => ({ ...prev, [key]: value }));

  const paidCheckboxes = [
    { key: "has_email", label: "Has Email" },
    { key: "has_phone", label: "Has Phone" },
    { key: "has_website", label: "Has Website" },
    { key: "has_social", label: "Has Extra Social Links" },
  ];

  return (
    <div className="filter-sidebar">
      <h3>Filters</h3>

      {/* Category */}
      <div className="filter-group">
        <label>Category</label>
        <select
          value={filters.category || ""}
          onChange={(e) => update("category", e.target.value || null)}
        >
          <option value="">All Categories</option>
          {options.categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Platform */}
      <div className="filter-group">
        <label>Platform</label>
        <select
          value={filters.platform || ""}
          onChange={(e) => update("platform", e.target.value || null)}
        >
          <option value="">All Platforms</option>
          {options.platforms.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Location */}
      <div className="filter-group">
        <label>Location</label>
        <select
          value={filters.location || ""}
          onChange={(e) => update("location", e.target.value || null)}
        >
          <option value="">Any Location</option>
          {options.countries.length > 0 && (
            <optgroup label="Countries">
              {options.countries.map((c) => (
                <option key={`co-${c}`} value={c}>{c}</option>
              ))}
            </optgroup>
          )}
          {options.cities.length > 0 && (
            <optgroup label="Cities">
              {options.cities.map((c) => (
                <option key={`ci-${c}`} value={c}>{c}</option>
              ))}
            </optgroup>
          )}
        </select>
      </div>

      {/* Followers */}
      <div className="filter-group">
        <label>Followers</label>
        <select
          value={filters.followers || ""}
          onChange={(e) => update("followers", e.target.value || null)}
        >
          <option value="">Any</option>
          <option value="0-10000">0 – 10K</option>
          <option value="10000-100000">10K – 100K</option>
          <option value="100000-500000">100K – 500K</option>
          <option value="500000-1000000">500K – 1M</option>
          <option value="1000000-999999999">1M+</option>
        </select>
      </div>

      {/* Paid-only filters */}
      <div className={`filter-group paid-group ${!isPaid ? "locked" : ""}`}>
        <div className="paid-header">
          <label>Contact & Links</label>
          {!isPaid && <span className="lock-badge">🔒 Pro</span>}
        </div>

        {paidCheckboxes.map(({ key, label }) => (
          <label
            key={key}
            className={`paid-checkbox ${!isPaid ? "disabled" : ""}`}
          >
            <input
              type="checkbox"
              disabled={!isPaid}
              checked={!!filters[key]}
              onChange={(e) => update(key, e.target.checked)}
            />
            {label}
          </label>
        ))}

        {!isPaid && (
          <button
            type="button"
            className="upgrade-cta"
            onClick={onUpgradeClick}
          >
            ⚡ Upgrade to unlock
          </button>
        )}
      </div>

      <button className="apply-filters-btn" onClick={onApply}>
        Apply Filters
      </button>
    </div>
  );
};

export default FilterSidebar;