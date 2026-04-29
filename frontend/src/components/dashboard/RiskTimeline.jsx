/**
 * Risk Timeline Chart component - Premium SOC-Grade Visualization
 */

export default function RiskTimeline({ risks }) {
  if (!risks || risks.length === 0) {
    return <div className="chart-placeholder">No risk data available</div>;
  }

  const maxRisk = Math.max(...risks, 100);
  const svgWidth = 1200;
  const svgHeight = 420;
  const padding = 70;
  const chartWidth = svgWidth - padding * 2;
  const chartHeight = svgHeight - padding * 2;

  const points = risks.map((risk, idx) => {
    const x = (idx / (risks.length - 1 || 1)) * chartWidth + padding;
    const y = svgHeight - (risk / maxRisk) * chartHeight - padding;
    return `${x},${y}`;
  });

  // Calculate statistics
  const avgRisk = Math.round(risks.reduce((a, b) => a + b, 0) / risks.length);
  const maxRiskValue = Math.max(...risks);
  const minRiskValue = Math.min(...risks);

  return (
    <div className="chart-wrapper full-width premium-risk-timeline">
      <div className="chart-header premium-header">
        <div>
          <h3>📊 Risk Timeline (Last 100 Threats)</h3>
          <span className="chart-subtitle">
            Real-time risk score progression with threat intensity analysis
          </span>
        </div>
        <div className="stats-badges">
          <div className="stat-badge">
            <span className="stat-label">Avg Risk</span>
            <span className="stat-value">{avgRisk}%</span>
          </div>
          <div className="stat-badge">
            <span className="stat-label">Peak</span>
            <span className="stat-value">{maxRiskValue}%</span>
          </div>
          <div className="stat-badge">
            <span className="stat-label">Low</span>
            <span className="stat-value">{minRiskValue}%</span>
          </div>
        </div>
      </div>

      <svg
        width="100%"
        height="420"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="chart-svg premium-chart"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background gradient */}
        <defs>
          <linearGradient id="riskGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.05" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Y-axis */}
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={svgHeight - padding}
          stroke="#3b82f6"
          strokeWidth="3"
          opacity="0.7"
        />

        {/* X-axis */}
        <line
          x1={padding}
          y1={svgHeight - padding}
          x2={svgWidth - padding}
          y2={svgHeight - padding}
          stroke="#3b82f6"
          strokeWidth="3"
          opacity="0.7"
        />

        {/* Y-axis label */}
        <text
          x={25}
          y={svgHeight / 2}
          fontSize="14"
          fill="#60a5fa"
          fontWeight="700"
          textAnchor="middle"
          transform={`rotate(-90 25 ${svgHeight / 2})`}
          letterSpacing="1"
        >
          RISK SCORE (%)
        </text>

        {/* X-axis label */}
        <text
          x={svgWidth / 2}
          y={svgHeight - 15}
          fontSize="14"
          fill="#60a5fa"
          fontWeight="700"
          textAnchor="middle"
          letterSpacing="1"
        >
          TIME PROGRESSION →
        </text>

        {/* Grid lines and Y-axis labels */}
        {[0, 20, 40, 60, 80, 100].map((val) => {
          const y = svgHeight - (val / 100) * chartHeight - padding;
          return (
            <g key={`grid-${val}`}>
              <line
                x1={padding}
                y1={y}
                x2={svgWidth - padding}
                y2={y}
                stroke="#3b82f6"
                strokeOpacity="0.12"
                strokeDasharray="6,3"
                strokeWidth="1.5"
              />
              <text
                x={padding - 15}
                y={y + 5}
                fontSize="13"
                fill="#60a5fa"
                textAnchor="end"
                fontWeight="600"
              >
                {val}%
              </text>
            </g>
          );
        })}

        {/* Fill area under line */}
        <polygon
          points={`${padding},${svgHeight - padding} ${points.join(" ")} ${svgWidth - padding},${svgHeight - padding}`}
          fill="url(#riskGradient)"
        />

        {/* Line chart with glow effect */}
        <polyline
          points={points.join(" ")}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
          filter="url(#glow)"
          opacity="0.9"
        />

        {/* Data points with enhanced styling */}
        {points.slice(0, Math.min(risks.length, 50)).map((point, idx) => {
          const [x, y] = point.split(",").map(Number);
          const riskValue = risks[idx];
          const isHigh = riskValue > 70;
          const isMedium = riskValue > 40;

          return (
            <g key={`point-${idx}`}>
              {/* Outer glow */}
              <circle
                cx={x}
                cy={y}
                r="5"
                fill={isHigh ? "#ef4444" : isMedium ? "#f97316" : "#3b82f6"}
                opacity="0.3"
              />
              {/* Main point */}
              <circle
                cx={x}
                cy={y}
                r="3"
                fill={isHigh ? "#ef4444" : isMedium ? "#f97316" : "#3b82f6"}
                opacity="0.9"
              />
            </g>
          );
        })}

        {/* Peak marker line */}
        {(() => {
          const peakIdx = risks.indexOf(maxRiskValue);
          if (peakIdx >= 0) {
            const [peakX, peakY] = points[peakIdx].split(",").map(Number);
            return (
              <g opacity="0.6">
                <line
                  x1={peakX}
                  y1={peakY}
                  x2={peakX}
                  y2={svgHeight - padding}
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                />
                <text
                  x={peakX}
                  y={peakY - 10}
                  fontSize="12"
                  fill="#ef4444"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  PEAK: {maxRiskValue}%
                </text>
              </g>
            );
          }
          return null;
        })()}
      </svg>

      {/* Premium Legend and Stats */}
      <div className="premium-legend-section">
        <div className="legend-row">
          <div className="legend-item">
            <div
              className="legend-dot"
              style={{ backgroundColor: "#3b82f6" }}
            ></div>
            <span>Risk Score Line</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-dot"
              style={{ backgroundColor: "#3b82f6", opacity: 0.2 }}
            ></div>
            <span>Risk Area</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-dot"
              style={{ backgroundColor: "#ef4444" }}
            ></div>
            <span>Critical (70%+)</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-dot"
              style={{ backgroundColor: "#f97316" }}
            ></div>
            <span>High (40-70%)</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-dot"
              style={{ backgroundColor: "#3b82f6" }}
            ></div>
            <span>Low (&lt;40%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
