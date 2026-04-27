/**
 * Live Monitoring page - Real-time threat detection
 */

import { useEffect, useState, useCallback, useRef } from "react";
import MetricsRow from "../../components/dashboard/MetricsRow";
import RiskTimeline from "../../components/dashboard/RiskTimeline";
import ThreatDistributionChart from "../../components/dashboard/ThreatDistributionChart";
import ThreatList from "../../components/dashboard/ThreatList";
import NetworkMap from "../../components/NetworkMap";
import { connectLiveFeed, disconnectFeed, getConnectionStatus } from "../../services/websocket";
import {
  calculateMetrics,
  formatNumber,
  getThreatDistribution,
  getSeverity
} from "../../utils/dashboardUtils";

const THROUGHPUT_WINDOW_MS = 5000;
const THREATS_PER_MIN_WINDOW_MS = 60000;
const MAX_THREATS_IN_MEMORY = 1200;
const MAX_INTERVAL_SAMPLES = 50;

function normalizeThreat(rawThreat) {
  const now = Date.now();
  const riskScore = Number(rawThreat?.risk_score ?? 0);
  const normalizedRisk = Number.isFinite(riskScore) ? Math.min(100, Math.max(0, riskScore)) : 0;
  const severity = rawThreat?.severity || getSeverity(normalizedRisk).level;
  const prediction = rawThreat?.prediction || (normalizedRisk >= 40 ? "attack" : "benign");
  const sourceIp = rawThreat?.source_ip || rawThreat?.src || "unknown";
  const destIp = rawThreat?.dest_ip || rawThreat?.destination_ip || rawThreat?.dst || "unknown";
  const packets = Math.max(1, Number(rawThreat?.packets ?? 1) || 1);
  const bytes = Math.max(0, Number(rawThreat?.bytes ?? 0) || 0);
  const protocol = String(rawThreat?.protocol || "OTHER").toUpperCase();

  const timestamp = typeof rawThreat?.timestamp === "number"
    ? new Date(rawThreat.timestamp * 1000)
    : new Date();

  return {
    id: rawThreat?.id || `${sourceIp}-${destIp}-${now}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: timestamp.toLocaleTimeString(),
    source_ip: sourceIp,
    dest_ip: destIp,
    threat_type:
      rawThreat?.threat_type ||
      (prediction === "attack" ? `${severity} ${protocol} anomaly` : "Benign encrypted flow"),
    risk_score: normalizedRisk,
    severity,
    prediction,
    protocol,
    packets,
    bytes,
    model_used: rawThreat?.model_used || "RF+XGB Ensemble",
    anomaly_flag: Boolean(rawThreat?.anomaly_flag),
    ingested_at: now,
  };
}

export default function LiveMonitoring() {
  const [threats, setThreats] = useState([]);
  const [isLive, setIsLive] = useState(true);
  const [showCount, setShowCount] = useState(20);
  const [connectionStatus, setConnectionStatus] = useState("connected");
  const [error, setError] = useState(null);
  const [systemMetrics, setSystemMetrics] = useState({
    detectionLatency: 0,
    packetsPerSec: 0,
    threatsPerMin: 0,
    throughputMbps: 0,
    dataFreshness: "--",
    uptime: 0,
  });
  const totalThreatsRef = useRef(0);
  const startTimeRef = useRef(0);
  const throughputWindowRef = useRef([]);
  const intervalSamplesRef = useRef([]);
  const lastEventAtRef = useRef(0);

  // Handle new threat from WebSocket
  const handleThreatReceived = useCallback((threatData) => {
    const nextThreat = normalizeThreat(threatData);
    const now = nextThreat.ingested_at;

    if (lastEventAtRef.current > 0) {
      const delta = now - lastEventAtRef.current;
      intervalSamplesRef.current = [...intervalSamplesRef.current, delta].slice(
        -MAX_INTERVAL_SAMPLES,
      );
    }
    lastEventAtRef.current = now;

    throughputWindowRef.current = [
      ...throughputWindowRef.current,
      {
        at: now,
        packets: nextThreat.packets,
        bytes: nextThreat.bytes,
      },
    ].filter((sample) => now - sample.at <= THREATS_PER_MIN_WINDOW_MS);

    totalThreatsRef.current += 1;

    setThreats((prev) => {
      return [nextThreat, ...prev].slice(0, MAX_THREATS_IN_MEMORY);
    });

    setError(null);
    setConnectionStatus("connected");
  }, []);

  // Handle WebSocket errors
  const handleError = useCallback((err) => {
    setError(err?.message || "Connection error. Will retry...");
    setConnectionStatus(getConnectionStatus());
    console.error("[LiveMonitoring] Error:", err);
  }, []);

  // Handle connection established
  const handleConnect = useCallback(() => {
    setConnectionStatus("connected");
    setError(null);
  }, []);

  // Start/Stop live capture
  useEffect(() => {
    if (!isLive) {
      disconnectFeed();
      setConnectionStatus("disconnected");
      setError(null);
      return;
    }

    totalThreatsRef.current = 0;
    throughputWindowRef.current = [];
    intervalSamplesRef.current = [];
    lastEventAtRef.current = 0;
    startTimeRef.current = Date.now();
    setConnectionStatus("connecting");
    setError(null);

    connectLiveFeed(handleThreatReceived, handleError, handleConnect);

    return () => {
      disconnectFeed();
    };
  }, [isLive, handleThreatReceived, handleError, handleConnect]);

  // Update system metrics periodically
  useEffect(() => {
    const metricsInterval = setInterval(() => {
      const now = Date.now();
      const window5s = throughputWindowRef.current.filter(
        (sample) => now - sample.at <= THROUGHPUT_WINDOW_MS,
      );
      const window60s = throughputWindowRef.current.filter(
        (sample) => now - sample.at <= THREATS_PER_MIN_WINDOW_MS,
      );
      throughputWindowRef.current = window60s;

      const packetsLast5s = window5s.reduce((sum, item) => sum + item.packets, 0);
      const bytesLast5s = window5s.reduce((sum, item) => sum + item.bytes, 0);
      const intervals = intervalSamplesRef.current;
      const avgInterval =
        intervals.length > 0
          ? intervals.reduce((sum, value) => sum + value, 0) / intervals.length
          : 0;

      const elapsed = startTimeRef.current
        ? (now - startTimeRef.current) / 1000
        : 0;
      const freshness = lastEventAtRef.current
        ? `${((now - lastEventAtRef.current) / 1000).toFixed(1)}s ago`
        : "No events";

      setSystemMetrics({
        detectionLatency: avgInterval,
        packetsPerSec: packetsLast5s / Math.max(THROUGHPUT_WINDOW_MS / 1000, 1),
        threatsPerMin: window60s.length,
        throughputMbps:
          ((bytesLast5s * 8) / 1_000_000) / Math.max(THROUGHPUT_WINDOW_MS / 1000, 1),
        dataFreshness: freshness,
        uptime: Math.round(elapsed),
      });

      if (isLive) {
        setConnectionStatus(getConnectionStatus());
      }
    }, 1000);

    return () => clearInterval(metricsInterval);
  }, [isLive]);

  // Calculate metrics from threats
  const metrics = calculateMetrics(threats);
  const threatDist = getThreatDistribution(threats.slice(0, 200));
  const risks = threats
    .slice(0, 100)
    .map((t) => t.risk_score || 0)
    .reverse();

  const activeThreatRate = Math.round(
    ((metrics.critical + metrics.high) / Math.max(metrics.total, 1)) * 100,
  );
  const statusLabel =
    connectionStatus === "connected"
      ? "Live stream active"
      : connectionStatus === "connecting"
        ? "Connecting to stream"
        : "Stream offline";

  return (
    <div className="page-content live-monitor-page">
      <div className="live-monitor-header">
        <div>
          <h2>Live Threat Monitoring</h2>
          <p className="live-monitor-subtitle">
            SOC-grade visibility for encrypted traffic intelligence
          </p>
        </div>
        <div className={`live-health-pill ${connectionStatus}`}>{statusLabel}</div>
      </div>

      <div className={`connection-banner ${connectionStatus}`}>
        <div className="status-dot"></div>
        <span className="status-text">
          {connectionStatus === "connected" && "WebSocket connected on /ws/live"}
          {connectionStatus === "connecting" && "Establishing secure telemetry channel..."}
          {connectionStatus === "disconnected" && "Live feed disconnected"}
        </span>
        {error && <span className="error-message">{error}</span>}
      </div>

      <div className="controls-row">
        <button
          className={`btn ${isLive ? "btn-danger" : "btn-success"}`}
          onClick={() => setIsLive(!isLive)}
        >
          {isLive ? "Stop Monitoring" : "Start Monitoring"}
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => {
            setThreats([]);
            throughputWindowRef.current = [];
            intervalSamplesRef.current = [];
            lastEventAtRef.current = 0;
            totalThreatsRef.current = 0;
          }}
        >
          Clear Feed
        </button>

        <div className="slider-control">
          <label htmlFor="show-count">Display Count</label>
          <input
            id="show-count"
            type="range"
            min="5"
            max="100"
            value={showCount}
            onChange={(e) => setShowCount(parseInt(e.target.value))}
          />
          <span>{showCount}</span>
        </div>

        <div className="system-info">
          <span>
            Threats Captured: <strong>{threats.length}</strong>
          </span>
          <span>
            Session Total: <strong>{totalThreatsRef.current}</strong>
          </span>
        </div>
      </div>

      <MetricsRow
        title="Threat Posture"
        metrics={{
          "Total Threats": formatNumber(metrics.total),
          "Critical Alerts": metrics.critical,
          "High Risk": metrics.high,
          "Avg Risk": `${Math.round(metrics.avgRisk)}%`,
          "Detection Rate": `${activeThreatRate}%`,
          "Unique Hosts": formatNumber(metrics.uniqueIPs),
          Status: metrics.critical > 0 ? "ALERT" : "SECURE",
        }}
      />

      <MetricsRow
        title="Streaming Performance"
        metrics={{
          "Detection Latency": `${systemMetrics.detectionLatency.toFixed(1)}ms`,
          "Packets/Sec": formatNumber(Math.round(systemMetrics.packetsPerSec)),
          Throughput: `${systemMetrics.throughputMbps.toFixed(3)} Mbps`,
          "Threats/Min": formatNumber(systemMetrics.threatsPerMin),
          "Last Event": systemMetrics.dataFreshness,
          Uptime: `${systemMetrics.uptime}s`,
        }}
      />

      <div
        className={`status-alert ${metrics.critical > 0 ? "alert-danger" : "alert-success"}`}
      >
        {metrics.critical > 0 ? (
          <>
            <strong>🔴 SECURITY ALERT:</strong> {metrics.critical} critical
            threat(s) detected. Immediate investigation required.
          </>
        ) : (
          <>
            <strong>SECURE:</strong> Network secure. Safety level:{" "}
            {Math.round(100 - metrics.avgRisk)}%
          </>
        )}
      </div>

      <div className="charts-row">
        <div className="chart-container">
          <h3>Risk Timeline (Last 100 threats)</h3>
          <RiskTimeline risks={risks} />
        </div>
        <div className="chart-container">
          {Object.keys(threatDist).length > 0 && (
            <>
              <h3>Threat Distribution</h3>
              <ThreatDistributionChart distribution={threatDist} />
            </>
          )}
          {Object.keys(threatDist).length === 0 && (
            <div className="chart-placeholder">Threat distribution will appear when events arrive.</div>
          )}
        </div>
      </div>

      <NetworkMap threats={threats} />

      <ThreatList threats={threats} showCount={showCount} isLive={isLive} />
    </div>
  );
}
