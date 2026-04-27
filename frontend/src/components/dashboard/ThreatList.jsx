import { getSeverity } from "../../utils/dashboardUtils";

const formatBytes = (bytes) => {
  if (!bytes) return "0 B";
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(2)} MB`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(1)} KB`;
  return `${bytes} B`;
};

export default function ThreatList({ threats, showCount, isLive }) {
  if (!threats.length) {
    return (
      <div className="threat-feed-empty">
        <p>{isLive ? "Listening for encrypted traffic events..." : "Live monitoring is paused."}</p>
      </div>
    );
  }

  return (
    <div className="threat-list-section">
      <h3>Latest Threat Intelligence Feed</h3>
      <div className="threat-feed-list">
        {threats
          .slice(0, showCount)
          .map((threat, idx) => {
            const severity = getSeverity(threat.risk_score);
            return (
              <div
                key={threat.id || `${threat.source_ip}-${threat.dest_ip}-${idx}`}
                className={`threat-feed-row ${severity.class}`}
              >
                <div className="threat-feed-main">
                  <span className="threat-feed-type">{threat.threat_type}</span>
                  <span className={`threat-feed-badge ${severity.class}`}>
                    {severity.level} • {Math.round(threat.risk_score)}
                  </span>
                </div>
                <div className="threat-feed-route">
                  <span>{threat.source_ip}</span>
                  <span className="threat-feed-arrow">→</span>
                  <span>{threat.dest_ip}</span>
                </div>
                <div className="threat-feed-meta">
                  <span>{threat.protocol}</span>
                  <span>{Number(threat.packets || 0).toLocaleString()} pkts</span>
                  <span>{formatBytes(Number(threat.bytes || 0))}</span>
                  <span>{threat.timestamp}</span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
