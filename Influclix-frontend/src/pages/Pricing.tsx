// src/pages/Pricing.tsx
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { apiCall } from "../config/Api";
import "./Pricing.css";

const PLANS = [
  {
    type: 0,
    code: "free",
    name: "Free",
    price_inr: 0,
    tagline: "Try it out",
    features: [
      "5 total searches",
      "Filter by category, platform, followers, location",
      "Contact details hidden",
    ],
    cta: "Current plan",
    ctaDisabled: true,
  },
  {
    type: 1,
    code: "pro",
    name: "Pro",
    price_inr: 999,
    tagline: "For growing teams",
    features: [
      "Unlimited searches",
      "All filters unlocked",
      "Email, phone, website visible",
      "CSV export",
    ],
    cta: "Upgrade to Pro",
    highlight: true,
  },
  {
    type: 2,
    code: "agency",
    name: "Agency",
    price_inr: 2999,
    tagline: "For agencies & teams",
    features: [
      "Everything in Pro",
      "5 team seats",
      "API access",
      "Priority support",
    ],
    cta: "Upgrade to Agency",
  },
  {
    type: 3,
    code: "enterprise",
    name: "Enterprise",
    price_inr: null,
    tagline: "Custom for large brands",
    features: [
      "Everything in Agency",
      "SSO + audit logs",
      "Dedicated success manager",
      "Custom SLAs",
    ],
    cta: "Contact sales",
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const currentPlan = user?.subscription_type ?? 0;

  const handleUpgrade = async (planType: number) => {
    // TODO: wire to real payment flow (Razorpay/Stripe)
    // For now, this demo endpoint flips subscription_type directly.
    const { ok, details } = await apiCall("/subscriptions/upgrade", {
      method: "POST",
      body: { subscription_type: planType },
    });

    if (ok) {
      // Clear cached user so the app re-fetches fresh subscription_type
      sessionStorage.removeItem("currentUser");
      alert("Upgraded successfully! Refreshing…");
      window.location.href = "/search";
    } else {
      alert(details || "Upgrade failed.");
    }
  };

  return (
    <div className="pricing-page">
      <div className="pricing-header">
        <h1>Simple, transparent pricing</h1>
        <p>Choose the plan that fits your influencer marketing workflow.</p>
      </div>

      <div className="pricing-grid">
        {PLANS.map((plan) => {
          const isCurrent = plan.type === currentPlan;
          return (
            <div
              key={plan.code}
              className={`pricing-card ${plan.highlight ? "highlight" : ""} ${
                isCurrent ? "current" : ""
              }`}
            >
              {plan.highlight && <div className="popular-badge">Most popular</div>}
              {isCurrent && <div className="current-badge">Your plan</div>}

              <h2>{plan.name}</h2>
              <p className="tagline">{plan.tagline}</p>

              <div className="price">
                {plan.price_inr === null ? (
                  <span className="custom-price">Custom</span>
                ) : plan.price_inr === 0 ? (
                  <span className="free-price">Free</span>
                ) : (
                  <>
                    <span className="currency">₹</span>
                    <span className="amount">{plan.price_inr.toLocaleString()}</span>
                    <span className="period">/month</span>
                  </>
                )}
              </div>

              <ul className="features-list">
                {plan.features.map((f, i) => (
                  <li key={i}>✓ {f}</li>
                ))}
              </ul>

              <button
                className={`plan-cta ${
                  isCurrent ? "current" : plan.highlight ? "primary" : "secondary"
                }`}
                disabled={isCurrent}
                onClick={() => handleUpgrade(plan.type)}
              >
                {isCurrent ? "Current plan" : plan.cta}
              </button>
            </div>
          );
        })}
      </div>

      <div className="pricing-footer">
        {/*<p>
          Need something different?{" "}
          <a href="mailto:sales@influclix.com">Contact sales</a>
        </p> 
        */}
        <button className="back-link" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
    </div>
  );
};

export default Pricing;