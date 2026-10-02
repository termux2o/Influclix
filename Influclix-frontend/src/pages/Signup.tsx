// src/pages/Signup.tsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiCall } from "../config/Api";
import { ENV } from "../config/Environment";

interface SignupResponse {
  details: string;
  status_code: number;
}

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const { ok, details, status } = await apiCall<SignupResponse>("/auth/signup", {
      method: "POST",
      body: {
        email,
        password,
        full_name: name || null,
        company: company || null,
      },
    });

    setLoading(false);

    if (!ok) {
      setError(details || `Signup failed (${status})`);
      return;
    }

    setSuccess(details || "User created successfully");

    // Backend sets the httpOnly cookie on this response,
    // so the user is already authenticated.
    setTimeout(() => navigate(ENV.ROUTES.DASHBOARD), 800);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account 🚀</h2>
        <p className="subtitle">Start finding influencers in India</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Company Name</label>
            <input
              type="text"
              placeholder="Enter your company name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password (min 8 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          {error && (
            <div style={{
              marginTop: "0.5rem",
              padding: "0.7rem",
              background: "#fee",
              color: "#a00",
              borderRadius: 8,
              fontSize: "0.9rem",
              textAlign: "center",
            }}>
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div style={{
              marginTop: "0.5rem",
              padding: "0.7rem",
              background: "#efe",
              color: "#060",
              borderRadius: 8,
              fontSize: "0.9rem",
              textAlign: "center",

            }}>
              ✅ {success}
            </div>
          )}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Creating account…" : "Create Account →"}
          </button>
        </form>

        <div className="auth-link">
          Already have an account? <Link to={ENV.ROUTES.LOGIN}>Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;