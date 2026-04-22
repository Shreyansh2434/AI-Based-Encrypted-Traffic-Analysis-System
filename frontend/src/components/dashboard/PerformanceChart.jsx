/**
 * Performance Chart component - displays performance metrics over iterations
 */

export default function PerformanceChart({ data, metric, title, yLabel }) {
  if (!data || data.length === 0) {
    return <div className="chart-placeholder">No data available</div>;
  }

  const values = data.map((d) => parseFloat(d[metric]));
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const chartHeight = 250;
  const pointSpacing = 100;
  const padding = 40;
  const width = data.length * pointSpacing + padding * 2;

  const points = values.map((val, idx) => {
    const x = padding + idx * pointSpacing;
    const range = maxValue - minValue || 1;
    const normalized = (val - minValue) / range;
    const y = chartHeight - normalized * (chartHeight - padding * 1.5) - padding * 0.75;
    return { x, y, val };
  });

  return (
    <div className="chart-wrapper">
      <h3>{title}</h3>
      <svg
        width="100%"
        height={chartHeight}
        viewBox={`0 0 ${width} ${chartHeight}`}
        className="chart-svg"
      >
        {/* Y-axis labels */}
        {[0, 25, 50, 75, 100].map((percent) => {
          const val = minValue + (percent / 100) * (maxValue - minValue);
          const range = maxValue - minValue || 1;
          const normalized = (val - minValue) / range;
          const y = chartHeight - normalized * (chartHeight - padding * 1.5) - padding * 0.75;

          return (
            <g key={`axis-${percent}`}>
              <text
                x={padding - 10}
                y={y + 4}
                fontSize="11"
                fill="#60a5fa"
                textAnchor="end"
              >
                {val.toFixed(0)}
              </text>
            </g>
          );
        })}

        {/* Line */}
        <polyline
          points={points.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />

        {/* Fill area */}
        <polygon
          points={`${padding},${chartHeight - padding * 0.75} ${points.map((p) => `${p.x},${p.y}`).join(" ")} ${width - padding},${chartHeight - padding * 0.75}`}
          fill="#3b82f6"
          opacity="0.2"
        />

        {/* Data points */}
        {points.map((point, idx) => (
          <g key={`point-${idx}`}>
            <circle cx={point.x} cy={point.y} r="4" fill="#3b82f6" />
            <text
              x={point.x}
              y={point.y - 12}
              fontSize="11"
              fill="#3b82f6"
              textAnchor="middle"
              fontWeight="bold"
            >
              {point.val.toFixed(0)}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {points.map((point, idx) => (
          <text
            key={`x-label-${idx}`}
            x={point.x}
            y={chartHeight - padding * 0.25}
            fontSize="11"
            fill="#cbd5e1"
            textAnchor="middle"
          >
            {idx + 1}
          </text>
        ))}
      </svg>
    </div>
  );
}
