/**
 * Algorithm Comparison Panel - RF vs XGB vs IsoForest
 * Displays performance metrics comparison across three algorithms
 */
import { DemoBadge, LoadingState, EmptyState } from "./StateIndicators";

export default function AlgorithmComparisonPanel({ isLoading = false }) {
  const algorithms = [
    {
      name: "Random Forest",
      color: "#3b82f6",
      metrics: {
        accuracy: 95.2,
        f1Score: 0.942,
        speed: 95,
        interpretability: 90,
        scalability: 75,
        memoryUsage: 80,
      },
    },
    {
      name: "XGBoost",
      color: "#f59e0b",
      metrics: {
        accuracy: 96.8,
        f1Score: 0.961,
        speed: 85,
        interpretability: 60,
        scalability: 88,
        memoryUsage: 70,
      },
    },
    {
      name: "Isolation Forest",
      color: "#10b981",
      metrics: {
        accuracy: 92.1,
        f1Score: 0.908,
        speed: 98,
        interpretability: 85,
        scalability: 92,
        memoryUsage: 65,
      },
    },
  ];

  const metricLabels = {
    accuracy: "Accuracy (%)",
    f1Score: "F1-Score",
    speed: "Speed",
    interpretability: "Interpretability",
    scalability: "Scalability",
    memoryUsage: "Memory Efficiency",
  };

  const metricKeys = Object.keys(metricLabels);
  const maxValue = 100;

  // Radar chart dimensions - scaled appropriately
  const svgSize = 280;
  const centerX = svgSize / 2;
  const centerY = svgSize / 2;
  const radius = 80;
  const angleSlice = (Math.PI * 2) / metricKeys.length;

  const getPoint = (index, value) => {
    const angle = angleSlice * index - Math.PI / 2;
    const x = centerX + radius * (value / maxValue) * Math.cos(angle);
    const y = centerY + radius * (value / maxValue) * Math.sin(angle);
    return { x, y };
  };

  const getPathData = (metrics) => {
    const points = metricKeys.map((key, idx) => {
      const point = getPoint(idx, metrics[key]);
      return `${point.x},${point.y}`;
    });
    return points.join(" ");
  };

  const getAxisPoint = (index) => {
    const angle = angleSlice * index - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x, y };
  };

  const getLabelPoint = (index) => {
    const angle = angleSlice * index - Math.PI / 2;
    const distance = radius + 25;
    const x = centerX + distance * Math.cos(angle);
    const y = centerY + distance * Math.sin(angle);
    return { x, y };
  };

  return (
    <div className="chart-wrapper full-width">
      <div className="chart-header">
        <div>
          <h3>🤖 Algorithm Comparison</h3>
          <span className="chart-subtitle">
            RF vs XGB vs IsoForest Performance
          </span>
        </div>
        <DemoBadge />
      </div>

      {isLoading && <LoadingState message="Loading algorithm metrics..." />}
      {!isLoading && (
        <>
          <div className="chart-legend-info">
            <div className="legend-info-item">
              <span className="legend-info-label">Chart Type:</span>
              <span className="legend-info-value">
                Radar Chart (Performance Metrics)
              </span>
            </div>
            <div className="legend-info-item">
              <span className="legend-info-label">Metrics Compared:</span>
              <span className="legend-info-value">
                Accuracy, F1-Score, Speed, Interpretability, Scalability,
                Memory
              </span>
            </div>
            <div className="legend-info-item">
              <span className="legend-info-label">Scale:</span>
              <span className="legend-info-value">0-100 (Higher is Better)</span>
            </div>
          </div>

          <svg
            width="100%"
            height="280"
            viewBox={`0 0 ${svgSize} ${svgSize}`}
            className="chart-svg professional"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Grid circles */}
            {[25, 50, 75, 100].map((val) => (
              <circle
                key={`grid-${val}`}
                cx={centerX}
                cy={centerY}
                r={(radius * val) / maxValue}
                fill="none"
                stroke="#334155"
                strokeDasharray="2,2"
                opacity="0.1"
              />
            ))}

            {/* Grid lines and labels */}
            {metricKeys.map((key, idx) => {
              const axisPoint = getAxisPoint(idx);
              const labelPoint = getLabelPoint(idx);
              return (
                <g key={`axis-${idx}`}>
                  <line
                    x1={centerX}
                    y1={centerY}
                    x2={axisPoint.x}
                    y2={axisPoint.y}
                    stroke="#334155"
                    strokeWidth="1"
                    opacity="0.2"
                  />
                  <text
                    x={labelPoint.x}
                    y={labelPoint.y}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#94a3b8"
                    fontWeight="600"
                  >
                    {metricLabels[key]}
                  </text>
                </g>
              );
            })}

            {/* Algorithm polygons */}
            {algorithms.map((algo, algoIdx) => (
              <g key={`algo-${algoIdx}`}>
                <polygon
                  points={getPathData(algo.metrics)}
                  fill={algo.color}
                  fillOpacity="0.15"
                  stroke={algo.color}
                  strokeWidth="2"
                  opacity="0.8"
                />
                {/* Data points */}
                {metricKeys.map((key, idx) => {
                  const point = getPoint(idx, algo.metrics[key]);
                  return (
                    <circle
                      key={`point-${algoIdx}-${idx}`}
                      cx={point.x}
                      cy={point.y}
                      r="3"
                      fill={algo.color}
                      opacity="0.9"
                    />
                  );
                })}
              </g>
            ))}
          </svg>

          {/* Legend */}
          <div className="comparison-legend">
            {algorithms.map((algo, idx) => (
              <div key={idx} className="legend-item">
                <span
                  className="legend-color"
                  style={{ backgroundColor: algo.color }}
                ></span>
                <span className="legend-label">{algo.name}</span>
              </div>
            ))}
          </div>

          {/* Metrics Table */}
          <div className="comparison-table-section">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  {algorithms.map((algo, idx) => (
                    <th key={idx} style={{ color: algo.color }}>
                      {algo.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {metricKeys.map((key) => (
                  <tr key={key}>
                    <td className="metric-name">{metricLabels[key]}</td>
                    {algorithms.map((algo, idx) => {
                      const value = algo.metrics[key];
                      const isHighest =
                        value ===
                        Math.max(...algorithms.map((a) => a.metrics[key]));
                      return (
                        <td
                          key={idx}
                          className={isHighest ? "highlight-best" : ""}
                        >
                          {key === "f1Score"
                            ? value.toFixed(3)
                            : `${value}${key === "accuracy" ? "%" : ""}`}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
