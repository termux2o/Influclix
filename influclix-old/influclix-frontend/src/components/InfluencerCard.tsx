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
}

const InfluencerCard = ({ influencer }: Props) => {
  return (
    <div className="influencer-card fade-in">
      <div className="avatar-wrapper">
        <img src={influencer.avatar} alt={influencer.name} />
        <span className="platform-badge">{influencer.platform}</span>
      </div>
      <h3>{influencer.name}</h3>
      <p className="handle">@{influencer.handle}</p>
      <div className="stats">
        <span>👥 {influencer.followers}</span>
        <span>❤️ {influencer.engagement}%</span>
      </div>
      <button className="view-btn">View Profile →</button>
    </div>
  );
};

export default InfluencerCard;