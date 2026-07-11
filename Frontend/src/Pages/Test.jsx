import React from "react";
import styles from "./Test.module.css"

const features = [
  {
    icon: "📷",
    title: "Instant barcode scan",
    text: "Point your camera at any packaged food's barcode and get a match in under a second, no typing required.",
  },
  {
    icon: "🧬",
    title: "Real nutrition data",
    text: "Every scan pulls live product details — name, brand, image, ingredients, and full nutrition facts — from a free, open food database.",
  },
  {
    icon: "🚦",
    title: "Healthy, moderate, or unhealthy",
    text: "Our rule engine checks sugar, sodium, saturated fat, and additives against nutrition guidelines and gives you a clear verdict, not a confusing score.",
  },
  {
    icon: "🕘",
    title: "Your scan history",
    text: "Every product you've ever scanned is saved automatically, so you can track what you've been eating over time.",
  },
  {
    icon: "❤️",
    title: "Save favorites",
    text: "Found a product you trust? Save it to your favorites so it's one tap away the next time you're shopping.",
  },
  {
    icon: "⚡",
    title: "Built for the grocery aisle",
    text: "Fast, mobile-friendly scanning designed to work while you're standing in front of the shelf, not after you get home.",
  },
];

const steps = [
  {
    number: "01",
    title: "Scan the barcode",
    text: "Open the scanner and point your camera at the barcode on any packaged food product.",
  },
  {
    number: "02",
    title: "We fetch the details",
    text: "NutriLens looks up the product's name, brand, ingredients, and nutrition facts from a free public food database.",
  },
  {
    number: "03",
    title: "Get your verdict",
    text: "Predefined health rules evaluate the product and label it Healthy, Moderate, or Unhealthy in plain language.",
  },
];

const stats = [
  { value: "3", label: "Health categories" },
  { value: "100%", label: "Free to use" },
  { value: "<1s", label: "Average scan time" },
  { value: "∞", label: "Products covered" },
];

function LandingPage() {
  return (
    <div className="page">
      <nav className="nav">
        <div className="nav-logo">NutriLens</div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#" className="nav-signin">
            Sign in
          </a>
        </div>
      </nav>

      <section className="hero">
        <div className="glow-left" />
        <div className="glow-right" />
        <div className="grid-overlay" />
        <div className="scan-line" />

        <div className="content">
          <span className="badge">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2z" />
            </svg>
            OPEN FOOD FACTS, IN REAL TIME
          </span>

          <h1>
            Know what
            <br />
            you're <span className="line2">really eating</span>
          </h1>

          <p className="subtext">
            Scan any packaged food's barcode and get an instant Healthy,
            Moderate, or Unhealthy verdict — backed by real nutrition data, not
            marketing on the box.
          </p>

          <div className="cta-row">
            <button className="btn-primary">
              Start scanning
              <svg
                viewBox="0 0 24 24"
                width="17"
                height="17"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </button>
            <button className="btn-secondary">Sign in</button>
          </div>
        </div>
      </section>

      <section className="stats">
        {stats.map((s) => (
          <div className="stat" key={s.label}>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      <section className="features" id="features">
        <div className="section-head">
          <span className="eyebrow">What you get</span>
          <h2>Everything you need before you buy it</h2>
          <p>
            NutriLens turns a five-second scan into a clear, honest answer about
            what's actually inside the package.
          </p>
        </div>

        <div className="feature-grid">
          {features.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="how-it-works" id="how-it-works">
        <div className="section-head">
          <span className="eyebrow">How it works</span>
          <h2>Three steps, one honest answer</h2>
        </div>

        <div className="steps">
          {steps.map((s) => (
            <div className="step" key={s.number}>
              <div className="step-number">{s.number}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-final">
        <h2>Stop guessing what's in your food.</h2>
        <p>
          Create a free account and start scanning in the next thirty seconds.
        </p>
        <button className="btn-primary large">
          Begin your journey
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </button>
      </section>

      <footer className="footer">
        <span>NutriLens</span>
        <span className="footer-muted">Built with the Open Food Facts API</span>
      </footer>
    </div>
  );
}

export default Test;
