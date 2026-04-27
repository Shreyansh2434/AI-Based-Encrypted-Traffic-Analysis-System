/**
 * Model Details page component
 */
import AlgorithmComparisonPanel from "../../components/dashboard/AlgorithmComparisonPanel";
import ModelAnalysisPanel from "../../components/dashboard/ModelAnalysisPanel";

export default function ModelDetails() {
  const features = [
    {
      category: "Flow Duration",
      features: "Duration in milliseconds",
      count: 1,
    },
    {
      category: "Packet Statistics",
      features: "Forward/backward packet counts & sizes",
      count: 12,
    },
    {
      category: "Timing Patterns",
      features: "Inter-arrival times & variance",
      count: 8,
    },
    {
      category: "Protocol Flags",
      features: "TCP SYN, ACK, FIN, RST counts",
      count: 4,
    },
    {
      category: "Flow Metrics",
      features: "Packet rate, byte rate, ratios",
      count: 27,
    },
  ];

  const comparison = [
    { aspect: "Speed", randomForest: "2ms", deepLearning: "200ms" },
    { aspect: "Interpretability", randomForest: "Yes", deepLearning: "No" },
    {
      aspect: "Tabular Data",
      randomForest: "Excellent",
      deepLearning: "Overkill",
    },
    { aspect: "Training", randomForest: "Minutes", deepLearning: "Hours" },
    {
      aspect: "Production",
      randomForest: "Ready",
      deepLearning: "Not practical",
    },
  ];

  return (
    <div className="page-content">
      <h2>Machine Learning Model</h2>

      <div className="columns-2">
        <div className="glass-card">
          <h3>Random Forest Classifier</h3>
          <ul>
            <li>
              <strong>Trees:</strong> 200
            </li>
            <li>
              <strong>Training Data:</strong> CICIDS2017
            </li>
            <li>
              <strong>Samples:</strong> 2.5M flows
            </li>
            <li>
              <strong>Accuracy:</strong> 95.2%
            </li>
            <li>
              <strong>F1-Score:</strong> 0.942
            </li>
          </ul>
        </div>

        <div className="glass-card">
          <h3>Performance</h3>
          <ul>
            <li>
              <strong>Inference:</strong> 2ms/flow
            </li>
            <li>
              <strong>Throughput:</strong> 500 flows/sec
            </li>
            <li>
              <strong>Memory:</strong> ~500MB
            </li>
            <li>
              <strong>GPU:</strong> Not required
            </li>
          </ul>
        </div>
      </div>

      <hr />

      <h2>Feature Engineering</h2>

      <div className="table-section">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Features</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, idx) => (
                <tr key={idx}>
                  <td>{feature.category}</td>
                  <td>{feature.features}</td>
                  <td>{feature.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <hr />

      <ModelAnalysisPanel selectedModel="randomForest" />

      <hr />

      <h2>Why Random Forest?</h2>

      <div className="table-section">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Aspect</th>
                <th>Random Forest</th>
                <th>Deep Learning</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.aspect}</td>
                  <td className="positive">{item.randomForest}</td>
                  <td className="negative">{item.deepLearning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
