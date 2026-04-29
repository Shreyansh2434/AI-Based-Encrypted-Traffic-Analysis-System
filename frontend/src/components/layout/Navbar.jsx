/**
 * Ultra-Premium Navbar component for Cipher Traffic Analyzer
 * World-class animations and luxury design
 */

export default function Navbar({ onSidebarToggle, sidebarVisible }) {
  return (
    <nav className="navbar-luxury">
      {/* Animated background glow */}
      <div className="navbar-glow"></div>

      {/* Main navbar content */}
      <div className="navbar-content">
        {/* Branding Section */}
        <div className="navbar-brand">
          {/* Toggle button with luxury animation */}
          <button
            className="navbar-toggle-btn"
            onClick={onSidebarToggle}
            title={sidebarVisible ? "Hide Navigation" : "Show Navigation"}
            aria-label="Toggle sidebar"
          >
            <span className={`toggle-icon ${sidebarVisible ? "active" : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>

          {/* Logo and title */}
          <div className="navbar-logo-section">
            <div className="navbar-logo-icon">🔐</div>
            <div className="navbar-text">
              <h1 className="navbar-title">CIPHER</h1>
              <p className="navbar-subtitle">Traffic Analysis</p>
            </div>
          </div>
        </div>

        {/* Center tagline */}
        <div className="navbar-tagline">
          <span className="tagline-text">
            Encrypted Network Threat Detection
          </span>
          <span className="tagline-separator">•</span>
          <span className="tagline-text">Real-Time Analysis</span>
        </div>

        {/* Premium action buttons */}
        <div className="navbar-actions">
          {/* Status indicator */}
          <div className="navbar-status">
            <span className="status-dot"></span>
            <span className="status-text">Active</span>
          </div>

          {/* Premium CTA button */}
          <button className="navbar-btn navbar-btn-primary">
            <span className="btn-text">Dashboard</span>
            <span className="btn-icon">→</span>
          </button>

          {/* Secondary action button */}
          <button className="navbar-btn navbar-btn-secondary">
            <span className="btn-icon">⚙️</span>
          </button>
        </div>
      </div>

      {/* Bottom accent line with animation */}
      <div className="navbar-accent-line"></div>
    </nav>
  );
}
