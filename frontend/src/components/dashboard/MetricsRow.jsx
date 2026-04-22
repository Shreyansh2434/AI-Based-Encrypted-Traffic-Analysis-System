/**
 * Metrics Row component - displays key metrics in a grid
 */

export default function MetricsRow({ metrics, title = null }) {
  const metricEntries = Object.entries(metrics);

  return (
    <section className="metrics-block">
      {title && <h3 className="metrics-title">{title}</h3>}
      <div className="metrics-row">
        {metricEntries.map(([label, value]) => (
          <div key={label} className="metric-card">
            <div className="metric-value">{value}</div>
            <div className="metric-label">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
