// src/hooks/useSearchUsage.ts
import { useCallback, useEffect, useState } from "react";
import { apiCall } from "../config/Api";

export interface PlanInfo {
  code: string;
  name: string;
  price_inr: number | null;
  features: string[];
  search_limit: number | null;
}

export interface SearchUsage {
  used: number;
  limit: number | null;
  remaining: number | null;
  subscription_type: number;
  plan: PlanInfo;
}

interface State {
  usage: SearchUsage | null;
  loading: boolean;
}

export function useSearchUsage() {
  const [state, setState] = useState<State>({ usage: null, loading: true });

  const refresh = useCallback(async () => {
    const { ok, data } = await apiCall<SearchUsage>("/influencers/usage");
    if (ok && data) {
      setState({ usage: data, loading: false });
    } else {
      setState({ usage: null, loading: false });
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...state, refresh };
}