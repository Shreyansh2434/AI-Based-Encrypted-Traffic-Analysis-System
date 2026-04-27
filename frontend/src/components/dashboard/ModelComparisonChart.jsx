/**
 * Model Comparison Chart - Side by side comparison of all three models
 */
import metricsData from "../../data/metrics.json";
import { DemoBadge } from "./StateIndicators";

export default function ModelComparisonChart() {
  const models = ["randomForest", "xgboost", "isolationForest"];
  const modelNames = {
    randomForest: "Random Forest",
    xgboost: "XGBoost",
    isolationForest: "Isolation Forest",
  };

  const modelColors = {
    randomForest: "#3b82f6",
    xgboost: "#f59e0b",
    isolationForest: "#10b981",
  };

  const comparisonMetrics = [
    {
      key: "accuracy",
      label: "Accuracy",
      format: (v) => (v * 100).toFixed(1) + "%",
    },
    {
      key: "f1Score",
      label: "F1-Score",
      format: (v) => (v * 100).toFixed(1) + "%",
    },
    {
      key: "rocAuc",
      label: "ROC AUC",
      format: (v) => (v * 100).toFixed(1) + "%",
    },
  ];

  const performanceMetrics = [
    {
      key: "inferenceTime",
      label: "Inference Time",
      format: (v) => v,
    },
    {
      key: "throughput",
      label: "Throughput",
      format: (v) => v,
    },
  ];

  return (
    <div className="chart-wrapper full-width">
      <div className="chart-header">
        <div>
          <h3>📊 Model Comparison Dashboard</h3>
          <span className="chart-subtitle">
            Side-by-side performance and metrics comparison
          </span>
        </div>
        <DemoBadge />
      </div>

      <div className="comparison-legend">
        {models.map((model) => (
          <div key={model} className="legend-item">
            <span
              className="legend-color"
              style={{ backgroundColor: modelColors[model] }}
            ></span>
            <span className="legend-label">{modelNames[model]}</span>
          </div>
        ))}
      </div>

      {/* Classification Metrics Comparison */}
      <h4>Classification Metrics</h4>
      <div className="model-comparison-grid">
        {comparisonMetrics.map((metric) => (
          <div key={metric.key} className="comparison-card">
            <div className="metric-header">{metric.label}</div>
            <div className="metric-bars">
              {models.map((model) => {
                const value =
                  metricsData[model].classificationMetrics[metric.key];
                const percentage = (value / 1) * 100;
                return (
                  <div key={model} className="bar-item">
                    <div className="bar-label">{modelNames[model]}</div>
                    <div className="bar-container">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: modelColors[model],
                        }}
                      ></div>
                    </div>
                    <div className="bar-value">{metric.format(value)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="divider-line"></div>

      {/* Performance Metrics Comparison */}
      <h4>Performance Metrics</h4>
      <div className="performance-comparison-table">
        <table className="metrics-table">
          <thead>
            <tr>
              <th>Metric</th>
              {models.map((model) => (
                <th key={model} style={{ color: modelColors[model] }}>
                  {modelNames[model]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {performanceMetrics.map((metric) => (
              <tr key={metric.key}>
                <td className="metric-name">{metric.label}</td>
                {models.map((model) => {
                  const value =
                    metricsData[model].performanceMetrics[metric.key];
                  return <td key={model}>{metric.format(value)}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divider-line"></div>

      {/* Summary Stats Table */}
      <h4>Summary Statistics</h4>
      <div className="summary-stats-grid">
        {models.map((model) => {
          const metrics = metricsData[model];
          return (
            <div key={model} className="summary-card">
              <div
                className="summary-header"
                style={{ borderLeftColor: modelColors[model] }}
              >
                {modelNames[model]}
              </div>
              <div className="summary-content">
                <div className="stat-row">
                  <span className="stat-label">Accuracy</span>
                  <span className="stat-value">
                    {(metrics.classificationMetrics.accuracy * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">F1-Score</span>
                  <span className="stat-value">
                    {(metrics.classificationMetrics.f1Score * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Inference</span>
                  <span className="stat-value">
                    {metrics.performanceMetrics.inferenceTime}
                  </span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Memory</span>
                  <span className="stat-value">
                    {metrics.performanceMetrics.memory}
                  </span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Model Size</span>
                  <span className="stat-value">
                    {metrics.performanceMetrics.modelSize}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
