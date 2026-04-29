/**
 * Navbar component for Cipher Traffic Analyzer
 */

export default function Navbar({ onSidebarToggle, sidebarVisible }) {
  return (
    <div className="navbar-premium">
      <h1
        className="navbar-cipher-toggle"
        onClick={onSidebarToggle}
        title={sidebarVisible ? "Hide Navigation" : "Show Navigation"}
      >
        CIPHER TRAFFIC ANALYZER
      </h1>
      <p className="navbar-subtitle">
        Encrypted Network Threat Detection • Real-Time Analysis
      </p>
    </div>
  );
}
