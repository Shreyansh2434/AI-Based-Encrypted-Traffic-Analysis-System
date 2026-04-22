import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ThreatTimeline, RiskDistribution, ProtocolAnalysis } from '../components/Charts'
import '../styles/pages.css'
import '../styles/charts.css'

const BASE_PACKETS = 2847563
const BASE_THREATS = 34
const PROTOCOLS = ['TLS', 'HTTPS', 'DNS', 'QUIC', 'HTTP/2', 'SSH']
const RISK_LEVELS = [
  { label: 'Critical', min: 90, color: '#dc2626' },
  { label: 'High', min: 72, color: '#ef4444' },
  { label: 'Medium', min: 48, color: '#f97316' },
  { label: 'Low', min: 0, color: '#22c55e' },
]
const SOURCES = ['10.10.14.24', '10.10.14.31', '172.16.8.12', '172.16.8.44', '192.168.1.17', '192.168.1.84']
const DESTINATIONS = ['8.8.8.8', '1.1.1.1', '208.67.222.222', '9.9.9.9', '104.18.12.44', '52.95.110.1']
const THREAT_TYPES = [
  'Encrypted Beaconing',
  'Tunneled Exfiltration',
  'Adaptive DDoS Pattern',
  'Credential Spray Burst',
  'Suspicious TLS Fingerprint',
  'Protocol Anomaly Drift',
]
const REGIONS = ['APAC', 'EMEA', 'NA', 'LATAM']

function pick(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function getRiskBand(score) {
  return RISK_LEVELS.find((level) => score >= level.min) || RISK_LEVELS[RISK_LEVELS.length - 1]
}

function createPacket() {
  const riskScore = Math.floor(Math.random() * 101)
  const band = getRiskBand(riskScore)
  const protocol = pick(PROTOCOLS)
  const source = pick(SOURCES)
  const destination = pick(DESTINATIONS)
  const bytes = 800 + Math.floor(Math.random() * 90000)
  const packets = 2 + Math.floor(Math.random() * 24)
  const latency = 2 + Math.floor(Math.random() * 31)
  const confidence = 72 + Math.floor(Math.random() * 28)
  const timestamp = new Date().toLocaleTimeString()

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp,
    source_ip: source,
    dest_ip: destination,
    protocol,
    region: pick(REGIONS),
    threat_type: band.label === 'Low' ? 'Benign encrypted flow' : pick(THREAT_TYPES),
    risk_score: riskScore,
    severity: band.label,
    bytes,
    packets,
    latency,
    confidence,
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function formatMetric(value) {
  return value.toLocaleString()
}

export default function Dashboard() {
  const [packets, setPackets] = useState(() => Array.from({ length: 14 }, createPacket).reverse())
  const [lastSync, setLastSync] = useState(new Date())
  const [latencyMs, setLatencyMs] = useState(11)

  useEffect(() => {
    const interval = setInterval(() => {
      const packet = createPacket()
      setPackets((prev) => [packet, ...prev].slice(0, 16))
      setLastSync(new Date())
      setLatencyMs(packet.latency)
    }, 1200)

    return () => clearInterval(interval)
  }, [])

  const liveMetrics = useMemo(() => {
    const totalBytes = packets.reduce((sum, packet) => sum + packet.bytes, 0)
    const riskAverage = Math.round(packets.reduce((sum, packet) => sum + packet.risk_score, 0) / packets.length)
    const uniqueHosts = new Set([
      ...packets.map((packet) => packet.source_ip),
      ...packets.map((packet) => packet.dest_ip),
    ]).size
    const criticalCount = packets.filter((packet) => packet.severity === 'Critical').length
    const threatCount = packets.filter((packet) => packet.risk_score >= 72).length

    return {
      packetsProcessed: BASE_PACKETS + packets.length * 83,
      threatsDetected: BASE_THREATS + threatCount,
      riskAverage,
      uniqueHosts,
      criticalCount,
      throughput: `${(totalBytes / 1024 / 1024).toFixed(2)} MB/s`,
      freshness: `${Math.max(1, Math.round(latencyMs / 2))} ms`,
    }
  }, [latencyMs, packets])

  const timelineData = useMemo(
    () =>
      [...packets]
        .reverse()
        .map((packet) => ({
          time: packet.timestamp,
          intensity: packet.risk_score,
        })),
    [packets],
  )

  const riskDistributionData = useMemo(() => {
    const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 }

    packets.forEach((packet) => {
      if (counts[packet.severity] !== undefined) {
        counts[packet.severity] += 1
      }
    })

    return [
      { name: 'Critical', value: counts.Critical, color: '#dc2626' },
      { name: 'High', value: counts.High, color: '#ef4444' },
      { name: 'Medium', value: counts.Medium, color: '#f97316' },
      { name: 'Low', value: counts.Low, color: '#22c55e' },
    ]
  }, [packets])

  const protocolData = useMemo(() => {
    const counts = PROTOCOLS.reduce((acc, protocol) => ({ ...acc, [protocol]: 0 }), {})

    packets.forEach((packet) => {
      counts[packet.protocol] = (counts[packet.protocol] || 0) + 1
    })

    return PROTOCOLS.map((protocol) => ({
      protocol,
      count: counts[protocol] || 0,
    }))
  }, [packets])

  const topPackets = useMemo(() => packets.slice(0, 8), [packets])

  return (
    <motion.div
      className="page dashboard-page soc-dashboard"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <section className="hero-panel">
        <div className="hero-copy">
          <div className="hero-kicker">SOC COMMAND CENTER • ALWAYS ONLINE</div>
          <h1>AI Based Encrypted Traffic Detection</h1>
          <p className="hero-description">
            Synchronized live traffic telemetry, threat scoring, and packet intelligence in one premium command view.
          </p>
          <div className="hero-badges">
            <span className="hero-badge hero-badge-live">
              <span className="live-dot" />
              LIVE STREAM
            </span>
            <span className="hero-badge">Latency {latencyMs}ms</span>
            <span className="hero-badge">Synced {lastSync.toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="hero-radar">
          <div className="orbit-ring orbit-ring-1" />
          <div className="orbit-ring orbit-ring-2" />
          <div className="orbit-core">
            <span>ONLINE</span>
            <strong>{liveMetrics.threatsDetected}</strong>
            <small>{liveMetrics.criticalCount} critical events</small>
          </div>
        </div>
      </section>

      <motion.div className="metrics-row premium-metrics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        {[
          { label: 'Packets Monitored', value: formatMetric(liveMetrics.packetsProcessed), tone: '#3b82f6' },
          { label: 'Threats Detected', value: formatMetric(liveMetrics.threatsDetected), tone: '#ef4444' },
          { label: 'Risk Average', value: `${liveMetrics.riskAverage}/100`, tone: '#f97316' },
          { label: 'Unique Hosts', value: formatMetric(liveMetrics.uniqueHosts), tone: '#8b5cf6' },
          { label: 'Throughput', value: liveMetrics.throughput, tone: '#22c55e' },
          { label: 'Freshness', value: liveMetrics.freshness, tone: '#60a5fa' },
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            className="metric premium-metric"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            whileHover={{ y: -4 }}
          >
            <div className="metric-label">{metric.label}</div>
            <div className="metric-value" style={{ color: metric.tone }}>{metric.value}</div>
          </motion.div>
        ))}
      </motion.div>

      <section className="signal-grid">
        <motion.div
          className="glass-card live-stream-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="card-heading">
            <div>
              <h2>Live Packet Stream</h2>
              <p>Newest encrypted sessions and their real-time risk classification</p>
            </div>
            <div className="pill online">Always Online</div>
          </div>

          <div className="table-container live-table">
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Source</th>
                  <th>Destination</th>
                  <th>Protocol</th>
                  <th>Severity</th>
                  <th>Payload</th>
                  <th>Confidence</th>
                  <th>Latency</th>
                </tr>
              </thead>
              <tbody>
                {topPackets.map((packet, index) => (
                  <motion.tr
                    key={packet.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.04 }}
                    whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.08)' }}
                  >
                    <td>{packet.timestamp}</td>
                    <td className="font-mono">{packet.source_ip}</td>
                    <td className="font-mono">{packet.dest_ip}</td>
                    <td>
                      <span className="packet-chip">{packet.protocol}</span>
                    </td>
                    <td>
                      <span className={`risk-pill risk-${packet.severity.toLowerCase()}`}>{packet.severity}</span>
                    </td>
                    <td>{formatBytes(packet.bytes)}</td>
                    <td>{packet.confidence}%</td>
                    <td>{packet.latency} ms</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          className="glass-card intelligence-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="card-heading">
            <div>
              <h2>Security Pulse</h2>
              <p>Operational state and anomaly highlights</p>
            </div>
          </div>

          <div className="pulse-stack">
            {[
              { label: 'Detection engine', value: 'Active', tone: 'good' },
              { label: 'Stream sync', value: 'Real-time', tone: 'good' },
              { label: 'Threat confidence', value: `${Math.min(99, liveMetrics.riskAverage + 11)}%`, tone: 'warning' },
              { label: 'Evidence retention', value: 'Encrypted', tone: 'good' },
            ].map((item) => (
              <div key={item.label} className="pulse-item">
                <div className="pulse-label">{item.label}</div>
                <div className={`pulse-value ${item.tone}`}>{item.value}</div>
              </div>
            ))}
          </div>

          <div className="pulse-log">
            {topPackets.slice(0, 4).map((packet) => (
              <div key={packet.id} className="pulse-log-item">
                <span className={`risk-dot risk-${packet.severity.toLowerCase()}`} />
                <div>
                  <strong>{packet.threat_type}</strong>
                  <p>{packet.region} • {packet.source_ip} → {packet.dest_ip}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="grid-2 charts-grid">
        <ThreatTimeline data={timelineData} dataKey="intensity" title="Threat Intensity Timeline" />
        <RiskDistribution data={riskDistributionData} title="Severity Mix" />
      </section>

      <section className="glass-card">
        <ProtocolAnalysis data={protocolData} title="Encrypted Protocol Mix" />
      </section>

      <section className="glass-card">
        <div className="card-heading">
          <div>
            <h2>Command Actions</h2>
            <p>Fast controls for a live SOC showcase</p>
          </div>
          <div className="pill">Synced to live feed</div>
        </div>
        <div className="action-buttons action-buttons--premium">
          <button>Freeze Snapshot</button>
          <button>Generate Report</button>
          <button>Export Evidence</button>
          <button>Start Capture</button>
        </div>
      </section>
    </motion.div>
  )
}
