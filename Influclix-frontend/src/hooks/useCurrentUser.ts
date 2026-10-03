// src/hooks/useCurrentUser.ts
import { useEffect, useState } from "react";
import { apiCall } from "../config/Api";

export interface CurrentUser {
  id: string;
  email: string;
  full_name: string | null;
  company: string | null;
  subscription_type: number;      // ← NEW: 0=free, 1=pro, 2=agency, 3=enterprise
  created_at: string;
  updated_at: string;
}

interface State {
  user: CurrentUser | null;
  loading: boolean;
  error: string | null;
}

export function useCurrentUser(): State {
  const [state, setState] = useState<State>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const cached = sessionStorage.getItem("currentUser");
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as CurrentUser;
          if (!cancelled) setState({ user: parsed, loading: false, error: null });
          return;
        } catch {
          sessionStorage.removeItem("currentUser");
        }
      }

      const { ok, data, details, status } = await apiCall<CurrentUser>("/auth/me");
      if (cancelled) return;

      if (ok && data) {
        sessionStorage.setItem("currentUser", JSON.stringify(data));
        setState({ user: data, loading: false, error: null });
      } else {
        setState({
          user: null,
          loading: false,
          error: details || `Failed to fetch user (${status})`,
        });
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return state;
}