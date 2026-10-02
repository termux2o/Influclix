import { useState } from 'react';
import FilterSidebar from '../components/FilterSidebar';
import InfluencerCard from '../components/InfluencerCard';

interface Influencer {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  followers: string;
  engagement: number;
  platform: string;
}

const Search = () => {
  const [influencers] = useState<Influencer[]>([
    {
      id: '1',
      name: 'Priya Sharma',
      handle: 'priyasharma',
      avatar: 'https://via.placeholder.com/100',
      followers: '250K',
      engagement: 4.5,
      platform: 'Instagram'
    },
    {
      id: '2',
      name: 'Rahul Kumar',
      handle: 'rahulkumar',
      avatar: 'https://via.placeholder.com/100',
      followers: '180K',
      engagement: 3.8,
      platform: 'YouTube'
    }
  ]);
  const [filters, setFilters] = useState({
    platform: 'all',
    followers: '',
    location: 'India',
    engagement: ''
  });

  return (
    <div className="search-page">
      <div className="search-sidebar">
        <FilterSidebar filters={filters} setFilters={setFilters} />
      </div>
      <div className="search-results">
        <div style={{ marginBottom: '1rem' }}>
          <p>Showing {influencers.length} influencers</p>
        </div>
        <div className="influencer-grid">
          {influencers.map(inf => (
            <InfluencerCard key={inf.id} influencer={inf} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
