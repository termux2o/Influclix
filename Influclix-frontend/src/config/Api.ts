// src/config/Api.ts

import { ENV } from "./Environment";

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
};

export type ApiResult<T = unknown> = {
  ok: boolean;
  status: number;
  details: string;
  data: T | null;
};

export async function apiCall<T = unknown>(
  path: string,
  options: ApiOptions = {}
): Promise<ApiResult<T>> {
  const { method = "GET", body, headers = {} } = options;

  let res: Response;
  try {
    res = await fetch(`${ENV.API_URL}${path}`, {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    // Network error: backend is down, CORS blocked, DNS failed, etc.
    // Return the same shape so callers don't have to special-case it.
    return {
      ok: false,
      status: 0,
      details:
        "Cannot reach the server. Please check your internet connection and try again.",
      data: null,
    };
  }

  let parsed: any = null;
  try {
    parsed = await res.json();
  } catch {
    parsed = null;
  }

  return {
    ok: res.ok,
    status: res.status,
    details:
      parsed?.details ??
      res.statusText ??
      `Request failed (${res.status})`,
    data: parsed as T,
  };
}