/**
 * Ultra-Premium Navbar component for Cipher Traffic Analyzer
 * World-class animations and luxury design
 */

import hamburgerIcon from "../../assets/hamburger-menu.svg";

export default function Navbar({ onSidebarToggle, sidebarVisible }) {
  return (
    <nav className="navbar-luxury">
      {/* Animated background glow */}
      <div className="navbar-glow"></div>

      {/* Main navbar content */}
      <div className="navbar-content">
        {/* Branding Section */}
        <div className="navbar-brand">
          {/* Toggle button with hamburger icon */}
          <button
            className="navbar-toggle-btn"
            onClick={onSidebarToggle}
            title={sidebarVisible ? "Hide Navigation" : "Show Navigation"}
            aria-label="Toggle sidebar"
          >
            <img
              src={hamburgerIcon}
              alt="Menu"
              className="hamburger-icon"
            />
          </button>

          {/* Logo and title */}
          <div className="navbar-logo-section">
            <div className="navbar-text">
              <h1 className="navbar-title">CIPHER</h1>
              <p className="navbar-subtitle">Traffic Analysis</p>
            </div>
          </div>
        </div>

        {/* Center tagline */}
        <div className="navbar-tagline">
          <span className="tagline-text">Encrypted Network Threat Detection</span>
          <span className="tagline-separator">•</span>
          <span className="tagline-text">Real-Time Analysis</span>
        </div>
      </div>

      {/* Bottom accent line with animation */}
      <div className="navbar-accent-line"></div>
    </nav>
  );
}
