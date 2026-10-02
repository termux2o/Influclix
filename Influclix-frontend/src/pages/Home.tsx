// src/pages/Home.tsx

import SearchBar from '../components/SearchBar';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Home = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const features = [
    {
      icon: '🔍',
      title: 'Advanced Filters',
      description: 'Filter by location, followers, engagement rate, niche, and more',
    },
    {
      icon: '📊',
      title: 'Audience Analytics',
      description: 'Check demographics, interests, and fake follower detection',
    },
    {
      icon: '📧',
      title: 'Bulk Email Finder',
      description: 'Get influencer contact emails in 1 click for outreach',
    },
    {
      icon: '📋',
      title: 'Manage',
      description: 'Keep every collaboration organized from start to finish with one CRM for contacts, notes, statuses, and history.',
    },
    {
      icon: '📈',
      title: 'Track',
      description: 'Automatic content collection and performance tracking, without creators signing up.',
    },
    {
      icon: '💳',
      title: 'Pay',
      description: 'Run paid partnerships, affiliate, and gifting from the same platform with automated payouts.',
    },
  ];

  const useCases = [
    {
      icon: '🎁',
      title: 'Gifting',
      description: 'Send products at scale, cut "address & size" follow-ups, and track what gets posted automatically.',
    },
    {
      icon: '🔗',
      title: 'Affiliates',
      description: 'Links + codes, attribution, and automated payouts without stitching systems together.',
    },
    {
      icon: '🤝',
      title: 'Paid Partnerships',
      description: 'Run sponsored campaigns end-to-end, from discovery to reporting.',
    },
  ];

  const testimonials = [
    {
      quote: "Such a relief to have everything in one place. Before, our influencer marketing work was split across too many tools. Now, all of that lives in one platform.",
      author: "Regina Kacajeva",
      role: "Creator Partnerships Manager",
    },
    {
      quote: "One of the best tools for influencer discovery. I've worked with Modash for 3+ years across two companies. 17/23 voted for it being their #1.",
      author: "Rugile Paleviciute",
      role: "Head of Global Partnerships",
    },
    {
      quote: "Finding this platform was brilliant. It not only covers influencer discovery, but it can collect & track our influencers' live content reliably.",
      author: "Ayme Mendes Da Costa",
      role: "Influencer Marketing Manager",
    },
  ];

  const faqs = [
    {
      question: 'What is Influclix and how does it work?',
      answer: 'Influclix is a Shopify-first influencer marketing platform that helps you find creators, manage partnerships, track performance, and pay creators — all from one place.',
    },
    {
      question: 'Is Influclix a platform, an agency, or a marketplace?',
      answer: "We're a SaaS platform. You get access to our discovery tools, CRM, email sync, tracking, and payment features to run your own influencer program in-house.",
    },
    {
      question: "Can I use Influclix if I'm not on Shopify?",
      answer: 'Absolutely! While we have deep Shopify integration, our platform works with any e-commerce setup. Shopify users get additional benefits like two-way sync and automatic discount code management.',
    },
    {
      question: "Will I find the creators I'm looking for?",
      answer: 'With 50M+ creators across Instagram, YouTube, and TikTok, plus advanced filters for audience demographics, engagement rates, and fake follower detection — yes, you will.',
    },
    {
      question: 'How does Influclix pricing work?',
      answer: 'We offer flexible pricing based on your team size and needs. Start with a 14-day free trial, no credit card required. Contact us for custom enterprise plans.',
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! Every plan comes with a 14-day free trial. No credit card required. Full access to all features so you can see the value before committing.',
    },
  ];

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-badge">
          <span className="badge-dot"></span>
          Free virtual event: hear from influencer leaders at top brands
          <Link to="/signup" className="badge-link">See the lineup →</Link>
        </div>

        <h1 className="hero-title">
          Find <span className="text-script-accent">Top Influencers</span>
          <br />
          On-device intelligence.
        </h1>

        <p className="hero-subtitle">
          Search 50M+ creators on Instagram, YouTube & TikTok.
          No accounts. No data collection. No strings attached.
        </p>

        <div className="search-container">
          <SearchBar placeholder="Search influencers by name, niche, or location..." />
        </div>

        <div className="hero-social-proof">
          <p>Trusted by <strong>2,600+</strong> in-house teams running paid partnerships, gifting, and affiliates</p>
          <div className="logo-row">
            <span className="logo-placeholder">Brand 1</span>
            <span className="logo-placeholder">Brand 2</span>
            <span className="logo-placeholder">Brand 3</span>
            <span className="logo-placeholder">Brand 4</span>
            <span className="logo-placeholder">Brand 5</span>
          </div>
        </div>
      </section>

      {/* ===== PROBLEM / SOLUTION ===== */}
      <section className="problem-solution">
        <h2 className="section-title">
          Your influencer marketing program is good.
          <br />
          <span className="highlight">But hustling between 6 different tools won't get you to great.</span>
        </h2>
        <p className="section-subtitle">
          Everything under one roof, so you can concentrate on growing your program.
        </p>
      </section>

      {/* ===== WHY INFLUCLIX / FEATURES ===== */}
      <section>
        <h2 className="section-title">Why Influclix?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <h3>{feature.icon} {feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== USE CASES ===== */}
      <section className="use-cases">
        <h2 className="section-title">Run paid partnerships, affiliate, and gifting from the same platform</h2>
        <div className="use-cases-grid">
          {useCases.map((useCase, index) => (
            <div className="use-case-card" key={index}>
              <div className="use-case-icon">{useCase.icon}</div>
              <h3>{useCase.title}</h3>
              <p>{useCase.description}</p>
              <Link to="/signup" className="use-case-link">Explore →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SHOPIFY SECTION ===== */}
      <section className="shopify-section">
        <div className="shopify-content">
          <div className="shopify-text">
            <h2>Built for brands using Shopify</h2>
            <p>
              Fast implementation, get value immediately. Two-way sync between Shopify and Influclix
              so your discount codes, orders, and revenue stay consistent in both places.
            </p>
            <ul className="shopify-list">
              <li>✓ Create and manage discount codes from Influclix</li>
              <li>✓ Send product gifts with one link (less logistics, fewer emails)</li>
              <li>✓ Pull Shopify data into one place for reporting</li>
            </ul>
            <Link to="/signup" className="btn btn-primary">Learn more</Link>
          </div>
          <div className="shopify-visual">
            <div className="shopify-mockup">
              <div className="mockup-header">
                <span className="mockup-dot"></span>
                <span className="mockup-dot"></span>
                <span className="mockup-dot"></span>
              </div>
              <div className="mockup-body">
                <div className="mockup-line long"></div>
                <div className="mockup-line medium"></div>
                <div className="mockup-line short"></div>
                <div className="mockup-chart">
                  <div className="chart-bar" style={{ height: '60%' }}></div>
                  <div className="chart-bar" style={{ height: '80%' }}></div>
                  <div className="chart-bar" style={{ height: '45%' }}></div>
                  <div className="chart-bar" style={{ height: '90%' }}></div>
                  <div className="chart-bar" style={{ height: '70%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="testimonials">
        <h2 className="section-title">Here's what customers say</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div className="testimonial-card" key={index}>
              <div className="quote-mark">"</div>
              <p className="testimonial-quote">{testimonial.quote}</p>
              <div className="testimonial-author">
                <div className="author-avatar">{testimonial.author.charAt(0)}</div>
                <div>
                  <p className="author-name">{testimonial.author}</p>
                  <p className="author-role">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="faq">
        <h2 className="section-title">Frequently asked questions</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              className={`faq-item ${openFaq === index ? 'open' : ''}`}
              key={index}
              onClick={() => toggleFaq(index)}
            >
              <div className="faq-question">
                <span>{faq.question}</span>
                <span className="faq-toggle">{openFaq === index ? '−' : '+'}</span>
              </div>
              {openFaq === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="final-cta">
        <h2>Bring everything under one roof</h2>
        <p>Find creators, manage partnerships, track performance, and pay creators from one platform.</p>
        <div className="final-cta-buttons">
          <Link to="/signup" className="btn btn-primary btn-lg">Start free trial</Link>
          <Link to="/demo" className="btn btn-outline btn-lg">Request demo</Link>
        </div>
        <p className="cta-note">14-day free trial • No credit card required</p>
      </section>
    </div>
  );
};

export default Home;