import { useParams } from 'react-router-dom';

const Profile = () => {
  const { id } = useParams();
  
  return (
    <div className="profile-page">
      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px' }}>
        <h1>Influencer Profile</h1>
        <p>ID: {id}</p>
        <div className="profile-stats">
          <div className="stat-card">
            <h3>Followers</h3>
            <p>100K</p>
          </div>
          <div className="stat-card">
            <h3>Engagement</h3>
            <p>4.5%</p>
          </div>
          <div className="stat-card">
            <h3>Platform</h3>
            <p>Instagram</p>
          </div>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <h3>Audience Demographics</h3>
          <p>📍 Top Cities: Mumbai, Delhi, Bangalore</p>
          <p>👤 Age: 18-24 (45%), 25-34 (35%)</p>
        </div>
        <button style={{ marginTop: '1rem' }}>📧 Get Email</button>
      </div>
    </div>
  );
};

export default Profile;
