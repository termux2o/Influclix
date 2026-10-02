export interface Influencer {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  followers: string;
  engagement: number;
  platform: 'instagram' | 'youtube' | 'tiktok';
  bio?: string;
  location?: string;
}

export interface SearchFilters {
  platform: string;
  location: string;
  followers: string;
  engagement: string;
  niche?: string;
}
