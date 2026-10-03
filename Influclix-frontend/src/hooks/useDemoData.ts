// src/hooks/useDemoData.ts
import { useEffect, useState } from "react";
import { apiCall } from "../config/Api";

export interface DemoInfluencer {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  profile_image_url: string | null;
  verified: boolean;

  category: string | null;
  tags: string[];

  email: string | null;

  instagram: string | null;
  youtube: string | null;
  twitter: string | null;
  tiktok: string | null;
  linkedin: string | null;
  website: string | null;

  followers: number;
  following: number;
}

export interface DemoCategoryGroup {
  category: string;
  count: number;
  influencers: DemoInfluencer[];
}

export interface DemoDataResponse {
  details: string;
  status_code: number;
  total_categories: number;
  total_influencers: number;
  groups: DemoCategoryGroup[];
}

interface State {
  data: DemoDataResponse | null;
  loading: boolean;
  error: string | null;
}

export function useDemoData(): State {
  const [state, setState] = useState<State>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { ok, data, details, status } = await apiCall<DemoDataResponse>(
        "/influencers/demo"
      );
      if (cancelled) return;

      if (ok && data) {
        setState({ data, loading: false, error: null });
      } else {
        setState({
          data: null,
          loading: false,
          error: details || `Failed to load demo data (${status})`,
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}