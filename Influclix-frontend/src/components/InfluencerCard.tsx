interface Influencer {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  followers: string;
  engagement: number;
  platform: string;
}

interface Props {
  influencer: Influencer;
  onViewProfile?: () => void;
  isPaid?: boolean;              // ← NEW (optional, defaults to false)
}

const InfluencerCard = ({ influencer, onViewProfile, isPaid = false }: Props) => {
  return (
    <div className="influencer-card">
      <img src={influencer.avatar} alt={influencer.name} />
      <h3>{influencer.name}</h3>
      <p className="handle">@{influencer.handle}</p>
      <div className="card-stats">
        <span>👥 {influencer.followers}</span>
        <span>{influencer.platform}</span>
      </div>
      <button
        className="view-profile-btn"
        onClick={(e) => {
          e.stopPropagation();
          onViewProfile?.();
        }}
      >
        View Profile
      </button>
    </div>
  );
};

export default InfluencerCard;