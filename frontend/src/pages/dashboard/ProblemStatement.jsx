/**
 * Problem Statement page component
 */

export default function ProblemStatement() {
  return (
    <div className="page-content">
      <h2>The Challenge</h2>

      <div className="columns-2">
        <div className="glass-card">
          <h3>The Problem:</h3>
          <p>Modern attacks hide in encrypted HTTPS traffic</p>
          <ul>
            <li>Packet inspection is ineffective</li>
            <li>Decryption is expensive &amp; invasive</li>
            <li>Privacy &amp; regulatory concerns</li>
            <li>Attackers exploit this blind spot</li>
          </ul>
        </div>

        <div className="glass-card">
          <h3>The Solution:</h3>
          <p>ML-based detection on network metadata</p>
          <ul>
            <li>Analyze packet patterns &amp; timing</li>
            <li>No decryption required</li>
            <li>Detects known &amp; zero-day threats</li>
            <li>Used by Darktrace &amp; Cisco</li>
          </ul>
        </div>
      </div>

      <hr />

      <h2>System Architecture</h2>

      <div className="columns-4">
        <div className="glass-card">
          <h4>Frontend</h4>
          <p>
            Streamlit UI
            <br />
            Real-time dashboard
            <br />
            Threat visualization
          </p>
        </div>

        <div className="glass-card">
          <h4>API Layer</h4>
          <p>
            FastAPI
            <br />
            REST + WebSocket
            <br />
            Batch &amp; streaming
          </p>
        </div>

        <div className="glass-card">
          <h4>ML Engine</h4>
          <p>
            Random Forest
            <br />
            Anomaly detection
            <br />
            Risk scoring
          </p>
        </div>

        <div className="glass-card">
          <h4>Capture Layer</h4>
          <p>
            Scapy sniffer
            <br />
            Flow extraction
            <br />
            Feature engineering
          </p>
        </div>
      </div>

      <hr />

      <h2>Why This Works</h2>

      <div className="columns-2">
        <div>
          <h4>Technical Advantages</h4>
          <ul>
            <li>Handles encrypted HTTPS</li>
            <li>Detects zero-days (anomaly detection)</li>
            <li>2ms inference latency</li>
            <li>95%+ accuracy</li>
          </ul>
        </div>

        <div>
          <h4>Business Advantages</h4>
          <ul>
            <li>No licensing costs</li>
            <li>Privacy respecting</li>
            <li>GDPR/PCI compliant</li>
            <li>Enterprise deployable</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
