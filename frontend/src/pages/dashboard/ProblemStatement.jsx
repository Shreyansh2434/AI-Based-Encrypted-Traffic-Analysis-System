/**
 * Problem Statement page component
 * Ultra-premium presentation of the challenge and solution
 */

export default function ProblemStatement() {
  return (
    <div className="problem-statement-page">
      {/* Hero Section */}
      <div className="ps-hero">
        <div className="ps-hero-glow"></div>
        <div className="ps-hero-content">
          <h1 className="ps-hero-title">The Challenge</h1>
          <p className="ps-hero-subtitle">
            Traditional security measures fail against sophisticated threats
            hiding in encrypted traffic
          </p>
        </div>
      </div>

      {/* Problem vs Solution */}
      <section className="ps-section">
        <div className="ps-grid-2">
          <div className="ps-card ps-card-problem">
            <div className="card-header-icon">🚨</div>
            <h3>The Problem</h3>
            <p className="card-description">
              Modern attacks hide in encrypted HTTPS traffic where traditional
              packet inspection is blind
            </p>
            <ul className="ps-list">
              <li>
                <span className="bullet">❌</span>
                <div>
                  <strong>Packet Inspection is Ineffective</strong>
                  <p>Cannot see inside encrypted payloads</p>
                </div>
              </li>
              <li>
                <span className="bullet">❌</span>
                <div>
                  <strong>Decryption is Expensive & Invasive</strong>
                  <p>Impacts performance and violates privacy</p>
                </div>
              </li>
              <li>
                <span className="bullet">❌</span>
                <div>
                  <strong>Privacy & Regulatory Concerns</strong>
                  <p>GDPR, HIPAA, PCI-DSS compliance issues</p>
                </div>
              </li>
              <li>
                <span className="bullet">❌</span>
                <div>
                  <strong>Attackers Exploit This Blind Spot</strong>
                  <p>Advanced threats go undetected</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="ps-card ps-card-solution">
            <div className="card-header-icon">💡</div>
            <h3>The Solution</h3>
            <p className="card-description">
              ML-based detection on network metadata without requiring
              decryption
            </p>
            <ul className="ps-list">
              <li>
                <span className="bullet">✓</span>
                <div>
                  <strong>Analyze Packet Patterns & Timing</strong>
                  <p>Extract behavioral features without decryption</p>
                </div>
              </li>
              <li>
                <span className="bullet">✓</span>
                <div>
                  <strong>Zero Decryption Required</strong>
                  <p>Privacy and performance maintained</p>
                </div>
              </li>
              <li>
                <span className="bullet">✓</span>
                <div>
                  <strong>Detects Known & Zero-Day Threats</strong>
                  <p>Both signature and anomaly detection</p>
                </div>
              </li>
              <li>
                <span className="bullet">✓</span>
                <div>
                  <strong>Enterprise Proven</strong>
                  <p>Used by Darktrace, Cisco, and major SOCs</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* System Architecture */}
      <section className="ps-section ps-section-architecture">
        <h2 className="ps-section-title">System Architecture</h2>
        <div className="ps-grid-4">
          <div className="ps-arch-card">
            <div className="arch-icon">📡</div>
            <h4>Capture Layer</h4>
            <p>Scapy network sniffer</p>
            <ul className="arch-list">
              <li>Live packet capture</li>
              <li>Flow extraction</li>
              <li>PCAP parsing</li>
            </ul>
          </div>

          <div className="ps-arch-card">
            <div className="arch-icon">⚙️</div>
            <h4>Feature Engine</h4>
            <p>Behavioral analysis</p>
            <ul className="arch-list">
              <li>Packet statistics</li>
              <li>Timing analysis</li>
              <li>Flow patterns</li>
            </ul>
          </div>

          <div className="ps-arch-card">
            <div className="arch-icon">🤖</div>
            <h4>ML Engine</h4>
            <p>scikit-learn models</p>
            <ul className="arch-list">
              <li>Random Forest</li>
              <li>XGBoost</li>
              <li>Isolation Forest</li>
            </ul>
          </div>

          <div className="ps-arch-card">
            <div className="arch-icon">🎨</div>
            <h4>Frontend</h4>
            <p>Real-time dashboard</p>
            <ul className="arch-list">
              <li>Threat visualization</li>
              <li>Live monitoring</li>
              <li>Performance metrics</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Why This Works */}
      <section className="ps-section">
        <h2 className="ps-section-title">Why This Works</h2>
        <div className="ps-grid-2">
          <div className="ps-advantage-card">
            <div className="advantage-icon">🔬</div>
            <h3>Technical Advantages</h3>
            <ul className="advantage-list">
              <li>
                <span className="check">✓</span> Handles encrypted HTTPS traffic
              </li>
              <li>
                <span className="check">✓</span> Detects zero-day threats
                (anomaly detection)
              </li>
              <li>
                <span className="check">✓</span> 2ms inference latency
              </li>
              <li>
                <span className="check">✓</span> 95%+ accuracy on test datasets
              </li>
              <li>
                <span className="check">✓</span> Scalable to millions of flows
              </li>
            </ul>
          </div>

          <div className="ps-advantage-card">
            <div className="advantage-icon">💼</div>
            <h3>Business Advantages</h3>
            <ul className="advantage-list">
              <li>
                <span className="check">✓</span> No licensing costs
              </li>
              <li>
                <span className="check">✓</span> Privacy respecting (no
                decryption)
              </li>
              <li>
                <span className="check">✓</span> GDPR/PCI/HIPAA compliant
              </li>
              <li>
                <span className="check">✓</span> Enterprise deployable
                on-premise
              </li>
              <li>
                <span className="check">✓</span> Minimal operational overhead
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="ps-section ps-section-metrics">
        <h2 className="ps-section-title">Key Performance Indicators</h2>
        <div className="ps-grid-4">
          <div className="metric-card">
            <div className="metric-value">95.2%</div>
            <div className="metric-label">Accuracy</div>
            <div className="metric-desc">On Random Forest model</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">2ms</div>
            <div className="metric-label">Latency</div>
            <div className="metric-desc">Per packet inference</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">6</div>
            <div className="metric-label">Metrics</div>
            <div className="metric-desc">Analyzed per algorithm</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">0</div>
            <div className="metric-label">Decryption</div>
            <div className="metric-desc">Required for analysis</div>
          </div>
        </div>
      </section>

      {/* Data Flow */}
      <section className="ps-section ps-section-flow">
        <h2 className="ps-section-title">Data Processing Pipeline</h2>
        <div className="data-flow">
          <div className="flow-step">
            <div className="flow-icon">📦</div>
            <div className="flow-label">Capture</div>
            <div className="flow-desc">Network packets</div>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <div className="flow-icon">🔍</div>
            <div className="flow-label">Extract</div>
            <div className="flow-desc">Flow features</div>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <div className="flow-icon">⚡</div>
            <div className="flow-label">Analyze</div>
            <div className="flow-desc">ML inference</div>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <div className="flow-icon">🎯</div>
            <div className="flow-label">Alert</div>
            <div className="flow-desc">Threat detected</div>
          </div>
        </div>
      </section>
    </div>
  );
}
