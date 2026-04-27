/**
 * Threat Distribution Pie Chart component
 */

export default function ThreatDistributionChart({ distribution }) {
  if (!distribution || Object.keys(distribution).length === 0) {
    return <div className="chart-placeholder">No data available</div>;
  }

  const colors = ["#3b82f6", "#f97316", "#ef4444", "#8b5cf6", "#22c55e"];
  const entries = Object.entries(distribution);
  const total = entries.reduce((sum, [_, count]) => sum + count, 0);

  let currentAngle = -90;
  const slices = entries.map(([label, count], idx) => {
    const percentage = (count / total) * 100;
    const sliceAngle = (count / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;

    // SVG arc path
    const radius = 80;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = 100 + radius * Math.cos(startRad);
    const y1 = 100 + radius * Math.sin(startRad);
    const x2 = 100 + radius * Math.cos(endRad);
    const y2 = 100 + radius * Math.sin(endRad);

    const largeArc = sliceAngle > 180 ? 1 : 0;

    const pathData = [
      `M 100 100`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      "Z",
    ].join(" ");

    currentAngle = endAngle;

    return {
      label,
      count,
      percentage,
      pathData,
      color: colors[idx % colors.length],
      idx,
    };
  });

  return (
    <div className="chart-wrapper">
      <h3>Threat Types</h3>
      <svg
        width="100%"
        height="300"
        viewBox="0 0 250 300"
        className="chart-svg"
      >
        {slices.map((slice) => (
          <g key={`slice-${slice.idx}`}>
            <path d={slice.pathData} fill={slice.color} opacity="0.8" />
          </g>
        ))}
      </svg>
      <div className="chart-legend">
        {slices.map((slice) => (
          <div key={`legend-${slice.idx}`} className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: slice.color }}
            ></div>
            <span>
              {slice.label}: {slice.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
