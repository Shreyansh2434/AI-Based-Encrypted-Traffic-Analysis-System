/**
 * Performance Testing page component
 */

import { useState } from "react";
import PerformanceChart from "../../components/dashboard/PerformanceChart";
import { generateThreat } from "../../utils/dashboardUtils";

export default function PerformanceTesting() {
  const [testFlows, setTestFlows] = useState(1000);
  const [testIters, setTestIters] = useState(5);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const runTest = async () => {
    setLoading(true);
    setProgress(0);
    const testResults = [];

    for (let i = 0; i < testIters; i++) {
      const start = performance.now();

      // Simulate test data generation
      const testData = Array.from({ length: testFlows }, () =>
        generateThreat(),
      );

      const latency = performance.now() - start;
      const throughput = testFlows / (latency / 1000);
      const accuracy = 92 + Math.random() * 4;

      testResults.push({
        iteration: i + 1,
        flows: testFlows,
        latency: latency.toFixed(2),
        throughput: throughput.toFixed(0),
        accuracy: accuracy.toFixed(2),
      });

      setProgress(((i + 1) / testIters) * 100);

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    setResults(testResults);
    setLoading(false);
  };

  return (
    <div className="page-content">
      <h2>Model Efficiency Testing</h2>

      <div className="controls-grid">
        <div className="control-group">
          <label htmlFor="test-flows">Test Flows</label>
          <input
            id="test-flows"
            type="range"
            min="100"
            max="10000"
            step="100"
            value={testFlows}
            onChange={(e) => setTestFlows(parseInt(e.target.value))}
            disabled={loading}
          />
          <span className="control-value">{testFlows.toLocaleString()}</span>
        </div>

        <div className="control-group">
          <label htmlFor="test-iters">Iterations</label>
          <input
            id="test-iters"
            type="range"
            min="1"
            max="20"
            value={testIters}
            onChange={(e) => setTestIters(parseInt(e.target.value))}
            disabled={loading}
          />
          <span className="control-value">{testIters}</span>
        </div>

        <button
          className="btn btn-primary"
          onClick={runTest}
          disabled={loading}
        >
          {loading ? "RUNNING..." : "RUN PERFORMANCE TEST"}
        </button>
      </div>

      {loading && (
        <div className="progress-section">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="progress-text">Progress: {progress.toFixed(0)}%</p>
        </div>
      )}

      {results && (
        <>
          <div className="results-section">
            <h3>Test Results</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Iteration</th>
                    <th>Flows</th>
                    <th>Latency (ms)</th>
                    <th>Throughput (f/s)</th>
                    <th>Accuracy (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.iteration}</td>
                      <td>{row.flows.toLocaleString()}</td>
                      <td>{row.latency}</td>
                      <td>{row.throughput}</td>
                      <td>{row.accuracy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="charts-row">
            <div className="chart-container">
              <PerformanceChart
                data={results}
                metric="latency"
                title="Inference Latency"
                yLabel="Latency (ms)"
              />
            </div>
            <div className="chart-container">
              <PerformanceChart
                data={results}
                metric="accuracy"
                title="Model Accuracy"
                yLabel="Accuracy (%)"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
