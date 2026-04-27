/**
 * Risk Distribution Chart - Uniform Professional SOC Grade
 */

export default function RiskDistributionChart({ distribution, height = 180 }) {
  if (!distribution) return <div className="chart-placeholder">No data available</div>;

  const data = Object.entries(distribution);
  const maxValue = Math.max(...data.map(([_, v]) => v), 1);

  // UNIFORM SIZING FOR ALL CHARTS
  const chartWidth = 320;
  const chartHeight = height;
  const padding = 12;
  const plotHeight = chartHeight - (padding * 2);
  const plotWidth = chartWidth - (padding * 2);
  const barWidth = Math.floor(plotWidth / data.length) - 8;
  const barSpacing = 4;

  return (
    <div className="chart-wrapper full-width">
      <div className="chart-header">
        <h3>📊 Risk Distribution</h3>
        <span className="chart-subtitle">Flows by risk score range</span>
      </div>
      <svg
        width="100%"
        height={chartHeight}
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="chart-svg professional"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines */}
        {[25, 50, 75].map((val) => {
          const y = padding + ((100 - val) / 100) * plotHeight;
          return (
            <line
              key={`grid-${val}`}
              x1={padding}
              y1={y}
              x2={chartWidth - padding}
              y2={y}
              stroke="#334155"
              strokeDasharray="3,3"
              opacity="0.1"
            />
          );
        })}

        {/* Y-axis labels */}
        {[0, 50, 100].map((val) => {
          const y = padding + ((100 - val) / 100) * plotHeight;
          return (
            <text
              key={`label-${val}`}
              x={padding - 6}
              y={y + 3}
              fontSize="10"
              fill="#94a3b8"
              textAnchor="end"
              fontWeight="600"
            >
              {val}
            </text>
          );
        })}

        {/* Bars */}
        {data.map(([label, value], idx) => {
          const x = padding + idx * (barWidth + barSpacing) + barSpacing / 2;
          const barHeight = (value / maxValue) * plotHeight;
          const y = padding + plotHeight - barHeight;

          return (
            <g key={`bar-${idx}`}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="#3b82f6"
                opacity="0.85"
                rx="1"
              />
              {value > 0 && (
                <text
                  x={x + barWidth / 2}
                  y={y - 6}
                  fontSize="11"
                  fill="#60a5fa"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {value}
                </text>
              )}
              <text
                x={x + barWidth / 2}
                y={chartHeight - 3}
                fontSize="10"
                fill="#94a3b8"
                textAnchor="middle"
                fontWeight="600"
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
