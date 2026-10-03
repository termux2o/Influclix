// src/hooks/useSearchInfluencers.ts
import { useCallback, useEffect, useState } from "react";
import { apiCall } from "../config/Api";

export interface SearchInfluencer {
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

export interface SearchFilters {
  q?: string | null;
  category?: string | null;
  platform?: string | null;
  location?: string | null;
  min_followers?: number | null;
  max_followers?: number | null;
  has_email?: boolean;
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_dir?: number;
}

export interface SearchResponse {
  details: string;
  status_code: number;
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  influencers: SearchInfluencer[];
}

interface State {
  data: SearchResponse | null;
  loading: boolean;
  error: string | null;
}

/**
 * Runs /influencers/search whenever `filters` change.
 * Empty filters {} = default listing.
 */
export function useSearchInfluencers(filters: SearchFilters): State & {
  refetch: () => void;
} {
  const [state, setState] = useState<State>({
    data: null,
    loading: true,
    error: null,
  });
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));

    (async () => {
      const payload = {
        page: 1,
        page_size: 20,
        sort_by: "followers",
        sort_dir: -1,
        has_email: false,
        ...filters,
      };

      const { ok, data, details, status } = await apiCall<SearchResponse>(
        "/influencers/search",
        { method: "POST", body: payload }
      );

      if (cancelled) return;

      if (ok && data) {
        setState({ data, loading: false, error: null });
      } else {
        setState({
          data: null,
          loading: false,
          error: details || `Search failed (${status})`,
        });
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters), tick]);

  return { ...state, refetch };
}