/**
 * Model Analysis / Performance Section - Displays comprehensive model metrics
 */
import metricsData from "../../data/metrics.json";
import { DemoBadge, LoadingState, EmptyState } from "./StateIndicators";

export default function ModelAnalysisPanel({
  selectedModel = "randomForest",
  isLoading = false,
}) {
  const metrics = metricsData[selectedModel];

  if (!metrics) {
    return <EmptyState message="No metrics available for this model" icon="📊" />;
  }

  if (isLoading) {
    return <LoadingState message="Loading model analysis..." />;
  }

  const {
    classificationMetrics,
    confusionMatrix,
    classMetrics,
    performanceMetrics,
  } = metrics;

  // Calculate metrics percentages for visualization
  const getMetricPercentage = (value) => Math.round(value * 100);

  // Confusion matrix stats
  const total =
    confusionMatrix.trueNegative +
    confusionMatrix.falsePositive +
    confusionMatrix.falseNegative +
    confusionMatrix.truePositive;
  const sensitivity =
    confusionMatrix.truePositive /
    (confusionMatrix.truePositive + confusionMatrix.falseNegative);
  const specificity =
    confusionMatrix.trueNegative /
    (confusionMatrix.trueNegative + confusionMatrix.falsePositive);
  const precision =
    confusionMatrix.truePositive /
    (confusionMatrix.truePositive + confusionMatrix.falsePositive);

  return (
    <div className="chart-wrapper full-width">
      <div className="chart-header">
        <div>
          <h3>📊 Model Analysis & Performance</h3>
          <span className="chart-subtitle">Comprehensive evaluation metrics</span>
        </div>
        <DemoBadge />
      </div>

      {/* Classification Metrics */}
      <div className="metrics-grid">
        <div className="metric-box">
          <div className="metric-label">Accuracy</div>
          <div className="metric-value">
            {getMetricPercentage(classificationMetrics.accuracy)}%
          </div>
          <div className="metric-subtext">
            {classificationMetrics.accuracy.toFixed(4)}
          </div>
        </div>
        <div className="metric-box">
          <div className="metric-label">Precision</div>
          <div className="metric-value">
            {getMetricPercentage(classificationMetrics.precision)}%
          </div>
          <div className="metric-subtext">
            {classificationMetrics.precision.toFixed(4)}
          </div>
        </div>
        <div className="metric-box">
          <div className="metric-label">Recall</div>
          <div className="metric-value">
            {getMetricPercentage(classificationMetrics.recall)}%
          </div>
          <div className="metric-subtext">
            {classificationMetrics.recall.toFixed(4)}
          </div>
        </div>
        <div className="metric-box">
          <div className="metric-label">F1-Score</div>
          <div className="metric-value">
            {getMetricPercentage(classificationMetrics.f1Score)}%
          </div>
          <div className="metric-subtext">
            {classificationMetrics.f1Score.toFixed(4)}
          </div>
        </div>
        <div className="metric-box">
          <div className="metric-label">ROC AUC</div>
          <div className="metric-value">
            {getMetricPercentage(classificationMetrics.rocAuc)}%
          </div>
          <div className="metric-subtext">
            {classificationMetrics.rocAuc.toFixed(4)}
          </div>
        </div>
      </div>

      <div className="divider-line"></div>

      {/* Confusion Matrix */}
      <h4>Confusion Matrix</h4>
      <div className="confusion-matrix-container">
        <div className="confusion-matrix-grid">
          <div className="confusion-cell header"></div>
          <div className="confusion-cell header-text">Predicted Benign</div>
          <div className="confusion-cell header-text">Predicted Attack</div>

          <div className="confusion-cell header-text">Actual Benign</div>
          <div className="confusion-cell tn-cell">
            <div className="cell-value">{confusionMatrix.trueNegative}</div>
            <div className="cell-label">True Negative</div>
          </div>
          <div className="confusion-cell fp-cell">
            <div className="cell-value">{confusionMatrix.falsePositive}</div>
            <div className="cell-label">False Positive</div>
          </div>

          <div className="confusion-cell header-text">Actual Attack</div>
          <div className="confusion-cell fn-cell">
            <div className="cell-value">{confusionMatrix.falseNegative}</div>
            <div className="cell-label">False Negative</div>
          </div>
          <div className="confusion-cell tp-cell">
            <div className="cell-value">{confusionMatrix.truePositive}</div>
            <div className="cell-label">True Positive</div>
          </div>
        </div>

        <div className="matrix-stats">
          <div className="stat-item">
            <span className="stat-label">Sensitivity (TPR):</span>
            <span className="stat-value">
              {(sensitivity * 100).toFixed(2)}%
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Specificity (TNR):</span>
            <span className="stat-value">
              {(specificity * 100).toFixed(2)}%
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Precision (PPV):</span>
            <span className="stat-value">{(precision * 100).toFixed(2)}%</span>
          </div>
        </div>
      </div>

      <div className="divider-line"></div>

      {/* Per-Class Metrics */}
      <h4>Per-Class Performance</h4>
      <div className="class-metrics-table">
        <table className="metrics-table">
          <thead>
            <tr>
              <th>Class</th>
              <th>Precision</th>
              <th>Recall</th>
              <th>F1-Score</th>
              <th>Support</th>
            </tr>
          </thead>
          <tbody>
            {classMetrics.map((metric, idx) => (
              <tr key={idx}>
                <td className="class-name">{metric.class}</td>
                <td>{(metric.precision * 100).toFixed(2)}%</td>
                <td>{(metric.recall * 100).toFixed(2)}%</td>
                <td className="f1-score">
                  {(metric.f1Score * 100).toFixed(2)}%
                </td>
                <td>{metric.support}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divider-line"></div>

      {/* Performance Metrics */}
      <h4>Runtime Performance</h4>
      <div className="performance-metrics-grid">
        <div className="performance-card">
          <div className="perf-icon">⚡</div>
          <div className="perf-label">Inference Time</div>
          <div className="perf-value">{performanceMetrics.inferenceTime}</div>
        </div>
        <div className="performance-card">
          <div className="perf-icon">📈</div>
          <div className="perf-label">Throughput</div>
          <div className="perf-value">{performanceMetrics.throughput}</div>
        </div>
        <div className="performance-card">
          <div className="perf-icon">💾</div>
          <div className="perf-label">Memory Usage</div>
          <div className="perf-value">{performanceMetrics.memory}</div>
        </div>
        <div className="performance-card">
          <div className="perf-icon">📦</div>
          <div className="perf-label">Model Size</div>
          <div className="perf-value">{performanceMetrics.modelSize}</div>
        </div>
      </div>
    </div>
  );
}
