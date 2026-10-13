// src/hooks/useOutreachAgent.ts
import { useCallback, useState } from "react";
import { apiCall } from "../config/Api";

export interface OutreachResult {
  details: string;
  status_code: number;
  subject: string;
  body: string;
  influencer_id: string;
  model: string;
  cost_usd: number;
  latency_ms: number;
}

interface State {
  loading: boolean;
  error: string | null;
  result: OutreachResult | null;
}

export function useOutreachAgent() {
  const [state, setState] = useState<State>({
    loading: false,
    error: null,
    result: null,
  });

  const generate = useCallback(
    async (params: {
      influencer_id: string;
      campaign_brief: string;
      brand_name?: string;
      tone?: "friendly" | "professional" | "casual" | "enthusiastic";
    }) => {
      setState({ loading: true, error: null, result: null });

      const res = await apiCall<OutreachResult>("/agents/outreach", {
        method: "POST",
        body: params,
      });

      if (res.ok && res.data) {
        console.log("[outreach] SUCCESS:", res.data);
        setState({ loading: false, error: null, result: res.data });
        return { ok: true, data: res.data };
        }
        console.log("[outreach] FAILED:", res);
      setState({
        loading: false,
        error: res.details || "Failed to generate outreach",
        result: null,
      });
      return { ok: false, details: res.details, status: res.status };
    },
    []
  );

  const reset = useCallback(() => {
    setState({ loading: false, error: null, result: null });
  }, []);

  return { ...state, generate, reset };
}