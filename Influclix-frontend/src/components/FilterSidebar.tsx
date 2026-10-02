interface FilterProps {
  filters: any;
  setFilters: (filters: any) => void;
}

const FilterSidebar = ({ filters, setFilters }: FilterProps) => {
  return (
    <div className="filter-sidebar">
      <h3>Filters</h3>
      
      <div className="filter-group">
        <label>Platform</label>
        <select onChange={(e) => setFilters({...filters, platform: e.target.value})}>
          <option value="all">All Platforms</option>
          <option value="instagram">Instagram</option>
          <option value="youtube">YouTube</option>
          <option value="tiktok">TikTok</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Location</label>
        <select>
          <option>India</option>
          <option>Mumbai</option>
          <option>Delhi</option>
          <option>Bangalore</option>
        </select>
      </div>

      <button className="apply-filters">Apply Filters</button>
    </div>
  );
};

export default FilterSidebar;
