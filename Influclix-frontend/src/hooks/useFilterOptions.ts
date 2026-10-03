// src/hooks/useFilterOptions.ts
import { useEffect, useState } from "react";
import { apiCall } from "../config/Api";

export interface FilterOptions {
  categories: string[];
  countries: string[];
  states: string[];
  cities: string[];
  platforms: string[];
}

interface State {
  options: FilterOptions | null;
  loading: boolean;
}

export function useFilterOptions(): State {
  const [state, setState] = useState<State>({ options: null, loading: true });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { ok, data } = await apiCall<any>("/influencers/filter-options");
      if (cancelled) return;

      if (ok && data) {
        setState({
          options: {
            categories: data.categories ?? [],
            countries: data.countries ?? [],
            states: data.states ?? [],
            cities: data.cities ?? [],
            platforms: data.platforms ?? [],
          },
          loading: false,
        });
      } else {
        setState({
          options: {
            categories: [],
            countries: [],
            states: [],
            cities: [],
            platforms: [],
          },
          loading: false,
        });
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return state;
}