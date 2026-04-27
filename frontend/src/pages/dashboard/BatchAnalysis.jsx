/**
 * Batch Analysis page component - Enhanced with professional layout and charts
 */

import { useState } from "react";
import MetricsRow from "../../components/dashboard/MetricsRow";
import RiskDistributionChart from "../../components/dashboard/RiskDistributionChart";
import ThreatCountChart from "../../components/dashboard/ThreatCountChart";
import SeverityDistributionChart from "../../components/dashboard/SeverityDistributionChart";
import ProtocolAnalysisChart from "../../components/dashboard/ProtocolAnalysisChart";
import {
    calculateMetrics,
    formatNumber,
    generateThreat,
    parseCSV,
    normalizeDataFrame,
} from "../../utils/dashboardUtils";

const API_BASE = "http://127.0.0.1:8000";
const API_TIMEOUT = 10000;

export default function BatchAnalysis() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [processingMode, setProcessingMode] = useState("client");

  const processWithBackend = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error (${response.status})`);
      }

      const result = await response.json();

      if (!result.data || result.data.length === 0) {
        throw new Error("No data returned from backend");
      }

      setProcessingMode("backend");
      return result;
    } catch (err) {
      console.warn("Backend processing failed, falling back to client-side:", err.message);
      return null;
    }
  };

  const processClientSide = (csvContent) => {
    try {
      const rawData = parseCSV(csvContent);

      if (rawData.length === 0) {
        throw new Error("No valid data in CSV file");
      }

      const normalized = normalizeDataFrame(rawData);

      const attack_count = normalized.filter(f => f.risk_score >= 60).length;
      const benign_count = normalized.length - attack_count;
      const avg_risk = Math.round(
        normalized.reduce((sum, f) => sum + (f.risk_score || 0), 0) / normalized.length
      );
      const critical_count = normalized.filter(f => f.risk_score >= 80).length;
      const high_count = normalized.filter(f => f.risk_score >= 60 && f.risk_score < 80).length;

      setProcessingMode("client");
      return {
        data: normalized,
        total_flows: normalized.length,
        attack_count,
        benign_count,
        avg_risk,
        critical_count,
        high_count,
        model_mode: "client-side",
      };
    } catch (err) {
      throw new Error(`CSV parsing failed: ${err.message}`);
    }
  };

  const processFile = async (file) => {
    if (!file.name.endsWith('.csv')) {
      setError("❌ Invalid file format. Please upload a CSV file");
      return;
    }

    setLoading(true);
    setError(null);
    setFileName(file.name);

    try {
      const fileContent = await file.text();
      let result = await processWithBackend(file);

      if (!result) {
        result = processClientSide(fileContent);
      }

      if (!result.data || result.data.length === 0) {
        throw new Error("No data could be processed from the file");
      }

      setData(result.data);
      setStats({
        total_flows: result.total_flows,
        attack_count: result.attack_count,
        benign_count: result.benign_count,
        avg_risk: result.avg_risk,
        critical_count: result.critical_count,
        high_count: result.high_count,
        model_mode: result.model_mode,
      });
      setIsDemo(false);
    } catch (err) {
      setError(`⚠️ ${err.message}`);
      console.error("Processing error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDemoData = () => {
    setLoading(true);
    setError(null);

    setTimeout(() => {
      const demoThreats = Array.from({ length: 1000 }, () => generateThreat());
      setData(demoThreats);
      setIsDemo(true);
      setFileName("demo_dataset_1000_flows.csv");

      const metrics = calculateMetrics(demoThreats);
      setStats({
        total_flows: demoThreats.length,
        attack_count: metrics.critical + metrics.high,
        benign_count: demoThreats.length - (metrics.critical + metrics.high),
        avg_risk: metrics.avgRisk,
        critical_count: metrics.critical,
        high_count: metrics.high,
        model_mode: "demo",
      });
      setProcessingMode("demo");
      setLoading(false);
    }, 800);
  };

  const handleReset = () => {
    setData(null);
    setStats(null);
    setError(null);
    setFileName(null);
    setIsDemo(false);
    setProcessingMode("client");
  };

  if (!data) {
    return (
      <div className="page-content">
        <div className="batch-header">
          <h2>Batch Threat Analysis</h2>
          <p className="batch-subtitle">Upload your CICIDS2017 CSV dataset for instant threat detection</p>
        </div>

        <div className="batch-upload-area">
          <div
            className={`upload-box ${dragActive ? "active" : ""} ${loading ? "loading" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {loading ? (
              <div className="upload-loading">
                <div className="spinner"></div>
                <p>Analyzing your dataset...</p>
                <span className="loading-subtext">Processing with ML threat detection</span>
              </div>
            ) : (
              <>
                <div className="upload-icon">📊</div>
                <h3>Upload Dataset</h3>
                <p>Drag & drop CSV file or click to select</p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="file-input"
                  disabled={loading}
                />
                <span className="file-hint">Supports CICIDS2017, UNSW-NB15, and standard flow formats</span>
              </>
            )}
          </div>

          {error && (
            <div className="alert-box alert-error">
              <span className="alert-icon">⚠️</span>
              <div className="alert-content">
                <strong>Error</strong>
                <p>{error}</p>
              </div>
            </div>
          )}

          <div className="batch-options">
            <button
              className="btn btn-primary"
              onClick={handleDemoData}
              disabled={loading}
            >
              ▶ Load Demo Dataset
            </button>
            <span className="option-divider">or</span>
            <div className="quick-info">
              <p>• 1,000 synthetic threat flows</p>
              <p>• Full analysis pipeline validation</p>
            </div>
          </div>

          <div className="batch-info-grid">
            <div className="info-card">
              <div className="info-icon">🛡️</div>
              <h4>Multi-Model</h4>
              <p>RF + XGBoost + IsoForest</p>
            </div>
            <div className="info-card">
              <div className="info-icon">⚡</div>
              <h4>High Performance</h4>
              <p>10K flows/sec processing</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🎯</div>
              <h4>95%+ Accuracy</h4>
              <p>Enterprise-grade detection</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🔐</div>
              <h4>Privacy-First</h4>
              <p>Zero decryption required</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const metrics = stats;
  const highRiskFlows = data
    .filter((f) => f.risk_score > 60)
    .sort((a, b) => b.risk_score - a.risk_score)
    .slice(0, 20);

  const riskBuckets = {
    "0-20": 0,
    "20-40": 0,
    "40-60": 0,
    "60-80": 0,
    "80-100": 0,
  };
  data.forEach((f) => {
    const risk = parseFloat(f.risk_score) || 0;
    if (risk <= 20) riskBuckets["0-20"]++;
    else if (risk <= 40) riskBuckets["20-40"]++;
    else if (risk <= 60) riskBuckets["40-60"]++;
    else if (risk <= 80) riskBuckets["60-80"]++;
    else riskBuckets["80-100"]++;
  });

  const threatCounts = {};
  data.forEach((f) => {
    const threatType = f.threat_type || "Unknown";
    threatCounts[threatType] = (threatCounts[threatType] || 0) + 1;
  });

  const medium_count = data.filter(f => f.risk_score >= 40 && f.risk_score < 60).length;
  const low_count = data.filter(f => f.risk_score < 40).length;

  const protocolCounts = {};
  data.forEach((f) => {
    const proto = f.protocol || "OTHER";
    protocolCounts[proto] = (protocolCounts[proto] || 0) + 1;
  });

  const threatPercentage = metrics.total_flows > 0
    ? Math.round((metrics.attack_count / metrics.total_flows) * 100)
    : 0;

  return (
    <div className="page-content">
      <div className="results-header">
        <div className="header-top">
          <h2>Analysis Results</h2>
          <span className={`mode-badge ${isDemo ? "demo" : processingMode === "backend" ? "production" : "client"}`}>
            {isDemo ? "DEMO MODE" : processingMode === "backend" ? "BACKEND MODE" : "CLIENT-SIDE MODE"}
          </span>
        </div>
        <div className="file-info">
          <span className="file-name">📋 {fileName}</span>
          <button className="btn btn-secondary btn-small" onClick={handleReset}>
            ⟲ New Analysis
          </button>
        </div>
      </div>

      <div className={`status-banner ${metrics.critical_count > 0 ? "critical" : "safe"}`}>
        <div className="banner-content">
          <span className="banner-icon">
            {metrics.critical_count > 0 ? "🔴" : "🟢"}
          </span>
          <div className="banner-text">
            <strong>
              {metrics.critical_count > 0
                ? `THREAT LEVEL: CRITICAL (${metrics.critical_count} detected)`
                : "THREAT LEVEL: SAFE"}
            </strong>
            <p>
              {threatPercentage}% Malicious | {metrics.attack_count}/{metrics.total_flows} flows
            </p>
          </div>
        </div>
      </div>

      <MetricsRow
        metrics={{
          "Total Flows": formatNumber(metrics.total_flows),
          Critical: metrics.critical_count,
          "High Risk": metrics.high_count,
          "Avg Risk": Math.round(metrics.avg_risk),
          Attacks: metrics.attack_count,
          Benign: metrics.benign_count,
        }}
      />

      <div className="analysis-section enhanced">
        <h3>📊 Comprehensive Threat Analysis</h3>

        <div className="charts-grid full-width-row">
          <div className="chart-container large">
            <RiskDistributionChart distribution={riskBuckets} height={320} />
          </div>
          <div className="chart-container large">
            <ThreatCountChart counts={threatCounts} height={320} />
          </div>
        </div>

        <div className="charts-grid split-row">
          <div className="chart-container medium">
            <SeverityDistributionChart
              critical={metrics.critical_count}
              high={metrics.high_count}
              medium={medium_count}
              low={low_count}
              height={320}
            />
          </div>
          <div className="chart-container medium">
            <ProtocolAnalysisChart protocols={protocolCounts} height={320} />
          </div>
        </div>

        <div className="analytics-cards-grid">
          <div className="analytics-card">
            <div className="card-icon critical">🔴</div>
            <div className="card-content">
              <h4>Critical Threats</h4>
              <p className="card-value">{metrics.critical_count}</p>
              <span className="card-stat">{((metrics.critical_count / metrics.total_flows) * 100).toFixed(1)}% of flows</span>
            </div>
          </div>

          <div className="analytics-card">
            <div className="card-icon high">🟠</div>
            <div className="card-content">
              <h4>High Risk Flows</h4>
              <p className="card-value">{metrics.high_count}</p>
              <span className="card-stat">{((metrics.high_count / metrics.total_flows) * 100).toFixed(1)}% of flows</span>
            </div>
          </div>

          <div className="analytics-card">
            <div className="card-icon medium">🟡</div>
            <div className="card-content">
              <h4>Medium Risk</h4>
              <p className="card-value">{medium_count}</p>
              <span className="card-stat">{((medium_count / metrics.total_flows) * 100).toFixed(1)}% of flows</span>
            </div>
          </div>

          <div className="analytics-card">
            <div className="card-icon low">🟢</div>
            <div className="card-content">
              <h4>Benign Traffic</h4>
              <p className="card-value">{metrics.benign_count}</p>
              <span className="card-stat">{((metrics.benign_count / metrics.total_flows) * 100).toFixed(1)}% of flows</span>
            </div>
          </div>
        </div>
      </div>

      <div className="table-section">
        <div className="table-header">
          <h3>🔍 Detailed Threat Analysis</h3>
          <span className="table-count">{highRiskFlows.length} High-Risk Flows</span>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Source IP</th>
                <th>Destination IP</th>
                <th>Threat Type</th>
                <th>Risk Score</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {highRiskFlows.map((flow, idx) => {
                const risk = parseFloat(flow.risk_score) || 0;
                const riskLevel = Math.min(Math.floor(risk / 20), 4);
                const severity = flow.severity || (risk >= 80 ? "Critical" : risk >= 60 ? "High" : "Medium");

                return (
                  <tr key={idx} className={`risk-row-${riskLevel}`}>
                    <td className="idx-col">{idx + 1}</td>
                    <td className="ip-col">{flow.source_ip || "N/A"}</td>
                    <td className="ip-col">{flow.dest_ip || "N/A"}</td>
                    <td className="threat-col">{flow.threat_type || "Unknown"}</td>
                    <td className="score-col">
                      <span className={`risk-badge risk-${riskLevel}`}>
                        {Math.round(risk)}
                      </span>
                    </td>
                    <td className="severity-col">
                      <span className={`severity-badge sev-${severity.toLowerCase()}`}>
                        {severity}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="action-buttons">
        <button
          className="btn btn-primary"
          onClick={() => {
            const csv = [
              ["#", "source_ip", "dest_ip", "threat_type", "risk_score", "severity"].join(","),
              ...data.map((row, idx) =>
                [
                  idx + 1,
                  row.source_ip || "N/A",
                  row.dest_ip || "N/A",
                  row.threat_type || "Unknown",
                  Math.round(parseFloat(row.risk_score) || 0),
                  row.severity || "Unknown",
                ].join(","),
              ),
            ].join("\n");

            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute(
              "download",
              `cipher_analysis_${new Date().toISOString().slice(0, 10)}.csv`
            );
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >
          ↓ Export Results
        </button>
        <button className="btn btn-secondary" onClick={handleReset}>
          ⟲ New Analysis
        </button>
      </div>
    </div>
  );
}
