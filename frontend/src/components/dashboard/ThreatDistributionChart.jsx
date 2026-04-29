/**
 * Threat Distribution Pie Chart component
 */

export default function ThreatDistributionChart({ distribution }) {
  if (!distribution || Object.keys(distribution).length === 0) {
    return (
      <div className="chart-placeholder">
        Threat distribution will appear when events arrive
      </div>
    );
  }

  const colors = [
    "#3b82f6",
    "#f97316",
    "#ef4444",
    "#8b5cf6",
    "#22c55e",
    "#10b981",
    "#ec4899",
  ];
  const entries = Object.entries(distribution);
  const total = entries.reduce((sum, [_, count]) => sum + count, 0);

  let currentAngle = -90;
  const slices = entries.map(([label, count], idx) => {
    const percentage = (count / total) * 100;
    const sliceAngle = (count / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;

    // SVG arc path (larger donut)
    const centerX = 150;
    const centerY = 150;
    const radius = 100;
    const innerRadius = 60;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const x3 = centerX + innerRadius * Math.cos(endRad);
    const y3 = centerY + innerRadius * Math.sin(endRad);
    const x4 = centerX + innerRadius * Math.cos(startRad);
    const y4 = centerY + innerRadius * Math.sin(startRad);

    const largeArc = sliceAngle > 180 ? 1 : 0;

    const pathData = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
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

  // Center text
  const centerLabel = `Total: ${total}`;

  return (
    <div className="chart-wrapper full-width">
      <div className="chart-header">
        <div>
          <h3>🎯 Threat Distribution</h3>
          <span className="chart-subtitle">
            Classification of detected threat types
          </span>
        </div>
      </div>

      <svg
        width="100%"
        height="220"
        viewBox="0 0 350 300"
        className="chart-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Donut slices */}
        {slices.map((slice) => (
          <g key={`slice-${slice.idx}`}>
            <path
              d={slice.pathData}
              fill={slice.color}
              opacity="0.85"
              stroke="rgba(15, 23, 42, 0.8)"
              strokeWidth="1"
            />
          </g>
        ))}

        {/* Center text */}
        <text
          x="150"
          y="150"
          fontSize="18"
          fill="#60a5fa"
          fontWeight="700"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {centerLabel}
        </text>
      </svg>

      {/* Legend with percentages */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          marginTop: "16px",
        }}
      >
        {slices.map((slice) => (
          <div
            key={`legend-${slice.idx}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: slice.color,
                borderRadius: "2px",
                flexShrink: 0,
              }}
            ></div>
            <span style={{ color: "#cbd5e1" }}>
              {slice.label}:{" "}
              <strong style={{ color: "#60a5fa" }}>{slice.count}</strong> (
              {slice.percentage.toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
