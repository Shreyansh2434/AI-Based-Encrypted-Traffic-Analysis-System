import { useNavigate } from "react-router-dom";
import "../styles/landing.css";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-wrapper">
      {/* Animated background elements */}
      <div className="landing-ambient landing-ambient-1"></div>
      <div className="landing-ambient landing-ambient-2"></div>
      <div className="landing-ambient landing-ambient-3"></div>

      {/* Header */}
      <header className="landing-header">
        <div className="landing-logo">🔐 CIPHER</div>
        <nav className="landing-nav">
          <a href="#why">Why</a>
          <a href="#what">What</a>
          <a href="#how">How</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-eyebrow">
            Enterprise-Grade Threat Detection
          </div>

          <h1 className="landing-title">
            Detect Threats in{" "}
            <span className="gradient-text">Encrypted Traffic</span>
          </h1>

          <p className="landing-subtitle">
            Advanced AI-powered analysis for encrypted HTTPS traffic that finds
            threats traditional methods miss.
          </p>

          <div className="landing-stats">
            <div className="stat-item">
              <span className="stat-value">95%+</span>
              <span className="stat-label">Accuracy</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">2ms</span>
              <span className="stat-label">Latency</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">Zero</span>
              <span className="stat-label">Decryption</span>
            </div>
          </div>

          <div className="landing-cta-group">
            <button
              onClick={() => navigate("/problem-statement")}
              className="landing-btn landing-btn-primary"
            >
              Enter Dashboard
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 12L10 8L6 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <button className="landing-btn landing-btn-secondary">
              Learn More
            </button>
          </div>
        </div>

        <div className="landing-hero-visual">
          <div className="visual-glow-outer"></div>
          <div className="visual-card">
            <div className="card-header">THREAT ANALYSIS</div>
            <div className="card-metric">
              <span>Risk Level</span>
              <span className="metric-value">⚠️ HIGH</span>
            </div>
            <div className="card-metric">
              <span>Accuracy</span>
              <span className="metric-value">✓ 95.2%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section id="why" className="landing-section">
        <h2 className="section-title">Why This Exists</h2>
        <div className="landing-grid-2">
          <div className="premium-card">
            <div className="card-icon">🚨</div>
            <h3>The Problem</h3>
            <p>
              Modern attacks hide in encrypted HTTPS traffic where traditional
              firewalls can't see them.
            </p>
            <ul className="card-list">
              <li>Packet inspection: ineffective</li>
              <li>Decryption: expensive & invasive</li>
              <li>Privacy & regulatory concerns</li>
              <li>Attackers exploit this blind spot</li>
            </ul>
          </div>

          <div className="premium-card">
            <div className="card-icon">💡</div>
            <h3>The Solution</h3>
            <p>
              ML-based detection on network metadata without requiring
              decryption.
            </p>
            <ul className="card-list">
              <li>Analyze packet patterns & timing</li>
              <li>No decryption required</li>
              <li>Detects known & zero-day threats</li>
              <li>Used by Darktrace & Cisco</li>
            </ul>
          </div>
        </div>
      </section>

      {/* What Section */}
      <section id="what" className="landing-section">
        <h2 className="section-title">What It Does</h2>
        <div className="landing-grid-3">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Real-Time Monitoring</h3>
            <p>
              Continuous analysis of encrypted traffic patterns with instant
              threat detection.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>ML-Powered Analysis</h3>
            <p>
              Random Forest, XGBoost, and Isolation Forest algorithms working in
              concert.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Privacy Compliant</h3>
            <p>
              GDPR and PCI compliant analysis without storing sensitive payload
              data.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Ultra-Fast Inference</h3>
            <p>
              2ms per packet inference latency for real-time threat detection.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Anomaly Detection</h3>
            <p>
              Detects zero-day threats through behavioral anomaly detection.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Enterprise Ready</h3>
            <p>
              Deployable on-premise with no licensing costs or external
              dependencies.
            </p>
          </div>
        </div>
      </section>

      {/* How Section */}
      <section id="how" className="landing-section">
        <h2 className="section-title">How It Works</h2>
        <div className="landing-architecture">
          <div className="arch-step">
            <div className="step-number">01</div>
            <div className="arch-card">
              <h4>Capture</h4>
              <p>
                Scapy sniffer captures network packets and extracts flow-level
                features without inspecting payload.
              </p>
            </div>
          </div>

          <div className="step-arrow">→</div>

          <div className="arch-step">
            <div className="step-number">02</div>
            <div className="arch-card">
              <h4>Engineer</h4>
              <p>
                Feature engineering extracts 15+ behavioral metrics: packet
                sizes, timing, directionality.
              </p>
            </div>
          </div>

          <div className="step-arrow">→</div>

          <div className="arch-step">
            <div className="step-number">03</div>
            <div className="arch-card">
              <h4>Detect</h4>
              <p>
                ML models analyze patterns and assign risk scores in real-time.
              </p>
            </div>
          </div>

          <div className="step-arrow">→</div>

          <div className="arch-step">
            <div className="step-number">04</div>
            <div className="arch-card">
              <h4>Alert</h4>
              <p>
                Threats are surfaced with confidence scores and contextual data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="landing-section">
        <h2 className="section-title">Technology Stack</h2>
        <div className="landing-grid-4">
          <div className="tech-card">
            <span className="tech-name">Frontend</span>
            <span className="tech-detail">React + Vite</span>
          </div>
          <div className="tech-card">
            <span className="tech-name">Backend</span>
            <span className="tech-detail">FastAPI</span>
          </div>
          <div className="tech-card">
            <span className="tech-name">ML Engine</span>
            <span className="tech-detail">scikit-learn</span>
          </div>
          <div className="tech-card">
            <span className="tech-name">Capture</span>
            <span className="tech-detail">Scapy</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta-section">
        <h2>Ready to Detect Threats?</h2>
        <p>Experience advanced encrypted traffic analysis</p>
        <button
          onClick={() => navigate("/problem-statement")}
          className="landing-btn landing-btn-primary landing-btn-large"
        >
          Launch Dashboard Now
        </button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>CIPHER TRAFFIC ANALYZER • Enterprise Threat Detection • v3.0</p>
      </footer>
    </div>
  );
}
