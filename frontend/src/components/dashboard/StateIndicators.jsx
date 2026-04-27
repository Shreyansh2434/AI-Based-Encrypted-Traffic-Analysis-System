/**
 * Reusable badge component for demo data indicators
 */

export function DemoBadge() {
  return (
    <span className="demo-badge">
      <span className="demo-badge-dot"></span>
      DEMO DATA
    </span>
  );
}

export function LoadingState({ message = "Loading data..." }) {
  return (
    <div className="data-state-container loading">
      <div className="loading-spinner"></div>
      <p className="state-message">{message}</p>
    </div>
  );
}

export function EmptyState({ message = "No data available", icon = "📭" }) {
  return (
    <div className="data-state-container empty">
      <div className="empty-icon">{icon}</div>
      <p className="state-message">{message}</p>
    </div>
  );
}
