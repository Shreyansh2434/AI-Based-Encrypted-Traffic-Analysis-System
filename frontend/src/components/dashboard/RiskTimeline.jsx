/**
 * Risk Timeline Chart component
 */

export default function RiskTimeline({ risks }) {
  if (!risks || risks.length === 0) {
    return <div className="chart-placeholder">No risk data available</div>;
  }

  const maxRisk = Math.max(...risks, 100);
  const svgWidth = 800;
  const svgHeight = 300;
  const padding = 60;
  const chartWidth = svgWidth - padding * 2;
  const chartHeight = svgHeight - padding * 2;

  const points = risks.map((risk, idx) => {
    const x = (idx / (risks.length - 1 || 1)) * chartWidth + padding;
    const y = svgHeight - (risk / maxRisk) * chartHeight - padding;
    return `${x},${y}`;
  });

  return (
    <div className="chart-wrapper full-width">
      <div className="chart-header">
        <div>
          <h3>📊 Risk Timeline (Last 100 Threats)</h3>
          <span className="chart-subtitle">
            Risk scores over time, higher = more dangerous
          </span>
        </div>
      </div>

      <svg
        width="100%"
        height="220"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="chart-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Y-axis */}
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={svgHeight - padding}
          stroke="#60a5fa"
          strokeWidth="2"
        />

        {/* X-axis */}
        <line
          x1={padding}
          y1={svgHeight - padding}
          x2={svgWidth - padding}
          y2={svgHeight - padding}
          stroke="#60a5fa"
          strokeWidth="2"
        />

        {/* Y-axis label */}
        <text
          x={20}
          y={svgHeight / 2}
          fontSize="12"
          fill="#94a3b8"
          fontWeight="600"
          textAnchor="middle"
          transform={`rotate(-90 20 ${svgHeight / 2})`}
        >
          Risk Score (%)
        </text>

        {/* X-axis label */}
        <text
          x={svgWidth / 2}
          y={svgHeight - 10}
          fontSize="12"
          fill="#94a3b8"
          fontWeight="600"
          textAnchor="middle"
        >
          Time →
        </text>

        {/* Grid lines and Y-axis labels */}
        {[0, 25, 50, 75, 100].map((val) => {
          const y = svgHeight - (val / 100) * chartHeight - padding;
          return (
            <g key={`grid-${val}`}>
              <line
                x1={padding}
                y1={y}
                x2={svgWidth - padding}
                y2={y}
                stroke="#3b82f6"
                strokeOpacity="0.15"
                strokeDasharray="4,4"
              />
              <text
                x={padding - 10}
                y={y + 4}
                fontSize="11"
                fill="#60a5fa"
                textAnchor="end"
                fontWeight="600"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Fill area under line */}
        <polygon
          points={`${padding},${svgHeight - padding} ${points.join(" ")} ${svgWidth - padding},${svgHeight - padding}`}
          fill="#3b82f6"
          opacity="0.15"
        />

        {/* Line chart */}
        <polyline
          points={points.join(" ")}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
        />

        {/* Data points */}
        {points.slice(0, Math.min(risks.length, 30)).map((point, idx) => {
          const [x, y] = point.split(",").map(Number);
          return (
            <circle
              key={`point-${idx}`}
              cx={x}
              cy={y}
              r="2.5"
              fill="#60a5fa"
              opacity="0.8"
            />
          );
        })}
      </svg>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginTop: "12px",
          fontSize: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: "#3b82f6",
              borderRadius: "2px",
            }}
          ></div>
          <span style={{ color: "#cbd5e1" }}>Risk Score Line</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: "#3b82f6",
              opacity: "0.15",
              borderRadius: "2px",
            }}
          ></div>
          <span style={{ color: "#cbd5e1" }}>Risk Area</span>
        </div>
      </div>
    </div>
  );
}
