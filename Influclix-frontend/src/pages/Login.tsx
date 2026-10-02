// src/pages/Login.tsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiCall } from "../config/Api";
import { ENV } from "../config/Environment";

interface LoginResponse {
  details: string;
  status_code: number;
}

interface LoginProps {
  setIsLoggedIn?: (value: boolean) => void;
}

const Login = ({ setIsLoggedIn }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const { ok, details, status } = await apiCall<LoginResponse>("/auth/login", {
      method: "POST",
      body: { email, password },
    });

    setLoading(false);

    if (!ok) {
      setError(details || `Login failed (${status})`);
      return;
    }

    setSuccess(details || "Logged in successfully");

    // Tell the App shell the user is now authenticated.
    // (The cookie is already set by the backend; this just flips
    //  React state so ProtectedRoute lets us through.)
    setIsLoggedIn?.(true);

    setTimeout(() => navigate(ENV.ROUTES.DASHBOARD), 600);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome Back 👋</h2>
        <p className="subtitle">Login to access your influencer dashboard</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div
              style={{
                marginTop: "0.5rem",
                padding: "0.7rem",
                background: "#fee",
                color: "#a00",
                borderRadius: 8,
                fontSize: "0.9rem",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                marginTop: "0.5rem",
                padding: "0.7rem",
                background: "#efe",
                color: "#060",
                borderRadius: 8,
                fontSize: "0.9rem",
              }}
            >
              ✅ {success}
            </div>
          )}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Logging in…" : "Login →"}
          </button>
        </form>

        <div className="auth-link">
          Don't have an account? <Link to={ENV.ROUTES.SIGNUP}>Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;