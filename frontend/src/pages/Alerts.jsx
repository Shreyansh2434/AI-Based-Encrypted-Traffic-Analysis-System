import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import '../styles/alerts.css'

export default function AlertSystem() {
  const [alerts, setAlerts] = useState([
    { id: 1, severity: 'CRITICAL', message: 'DDoS Attack Detected', time: '14:32:45', acknowledged: false },
    { id: 2, severity: 'HIGH', message: 'Suspicious Encryption Pattern', time: '14:28:12', acknowledged: false },
    { id: 3, severity: 'MEDIUM', message: 'Port Scanning Activity', time: '14:15:33', acknowledged: true },
    { id: 4, severity: 'LOW', message: 'Unusual Protocol Usage', time: '14:01:22', acknowledged: true },
  ])

  const acknowledge = (id) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, acknowledged: true } : a))
  }

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'CRITICAL': return { bg: '#dc2626', text: '#ef5350' }
      case 'HIGH': return { bg: '#ef4444', text: '#ff7043' }
      case 'MEDIUM': return { bg: '#f97316', text: '#ffa726' }
      case 'LOW': return { bg: '#22c55e', text: '#66bb6a' }
      default: return { bg: '#3b82f6', text: '#42a5f5' }
    }
  }

  return (
    <div className="page">
      <h1>🚨 Alert Management</h1>
      <p className="page-subtitle">Real-time security alerts and threat notifications</p>

      <motion.div 
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="alerts-header">
          <h2>Active Alerts ({alerts.filter(a => !a.acknowledged).length})</h2>
          <button style={{ padding: '8px 16px', fontSize: '12px' }}>Acknowledge All</button>
        </div>

        <AnimatePresence>
          {alerts.map((alert, index) => {
            const color = getSeverityColor(alert.severity)
            return (
              <motion.div
                key={alert.id}
                className={`alert-item ${alert.acknowledged ? 'acknowledged' : ''}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                style={{ borderLeftColor: color.bg }}
              >
                <div className="alert-severity" style={{ backgroundColor: color.bg + '20', color: color.bg }}>
                  {alert.severity}
                </div>
                <div className="alert-content">
                  <h4>{alert.message}</h4>
                  <p>{alert.time}</p>
                </div>
                {!alert.acknowledged && (
                  <motion.button
                    className="acknowledge-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => acknowledge(alert.id)}
                  >
                    Acknowledge
                  </motion.button>
                )}
                {alert.acknowledged && (
                  <span className="acknowledged-badge">✓ Acknowledged</span>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2>⚙️ Alert Configuration</h2>
        <div className="alert-config">
          <label>
            <span>Critical Threshold</span>
            <input type="number" defaultValue="80" />
          </label>
          <label>
            <span>High Threshold</span>
            <input type="number" defaultValue="60" />
          </label>
          <label>
            <span>Enable Email Alerts</span>
            <input type="checkbox" defaultChecked />
          </label>
          <label>
            <span>Alert Timeout (min)</span>
            <input type="number" defaultValue="30" />
          </label>
        </div>
        <button style={{ marginTop: '16px' }}>Save Configuration</button>
      </motion.div>
    </div>
  )
}
