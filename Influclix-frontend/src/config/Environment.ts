// src/config/Environment.ts

/**
 * Central place for all environment-driven configuration.
 * Reads from Vite env vars (VITE_*) with sane dev defaults.
 */


export const ENV = {
  API_URL:  ("http://localhost:8000"),

  // Route paths — keeps navigation strings in one place
  ROUTES: {
    HOME: "/",
    LOGIN: "/login",
    SIGNUP: "/signup",
    DASHBOARD: "/dashboard",
    SEARCH: "/search",
    DEMO: "/demo",
    PRICING: "/pricing",       // ← NEW
  },

  // Cookie / auth behavior hints (for the frontend)
  AUTH: {
    COOKIE_NAME: "hjsklsghbsai112nc98e3thjacaq@39VSWjpwi",   // must match backend
    ACCESS_TOKEN_MINUTES: 15,      // matches backend config
  },
} as const;

export type Env = typeof ENV;