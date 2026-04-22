/**
 * Risk Timeline Chart component
 */

export default function RiskTimeline({ risks }) {
  if (!risks || risks.length === 0) {
    return <div className="chart-placeholder">No data available</div>;
  }

  const maxRisk = Math.max(...risks, 100);
  const width = 100;
  const height = 300;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = risks.map((risk, idx) => {
    const x = (idx / (risks.length - 1 || 1)) * chartWidth + padding;
    const y = height - (risk / maxRisk) * chartHeight - padding;
    return `${x},${y}`;
  });

  return (
    <div className="chart-wrapper">
      <h3>Risk Timeline</h3>
      <svg
        width="100%"
        height="300"
        viewBox={`0 0 ${width} ${height}`}
        className="chart-svg"
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((val) => {
          const y = height - (val / 100) * chartHeight - padding;
          return (
            <g key={`grid-${val}`}>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#3b82f6"
                strokeOpacity="0.1"
              />
              <text
                x={padding - 5}
                y={y + 4}
                fontSize="10"
                fill="#60a5fa"
                textAnchor="end"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Line chart */}
        <polyline
          points={points.join(" ")}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />

        {/* Fill area */}
        <polygon
          points={`${padding},${height - padding} ${points.join(" ")} ${width - padding},${height - padding}`}
          fill="#3b82f6"
          opacity="0.2"
        />

        {/* Data points */}
        {points.slice(0, Math.min(risks.length, 20)).map((point, idx) => {
          const [x, y] = point.split(",").map(Number);
          return (
            <circle key={`point-${idx}`} cx={x} cy={y} r="3" fill="#3b82f6" />
          );
        })}
      </svg>
    </div>
  );
}
