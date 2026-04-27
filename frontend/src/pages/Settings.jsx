import { useState } from 'react'
import '../styles/pages.css'

export default function Settings() {
  const [settings, setSettings] = useState({
    captureEnabled: true,
    alertLevel: 'HIGH',
    autoAnalysis: true,
    dataRetention: '30',
  })

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="page">
      <h1>⚙️ System Settings</h1>
      <p className="page-subtitle">Configure your threat detection system</p>

      <div className="glass-card">
        <h2>Detection Settings</h2>
        <div className="settings-group">
          <label>
            <span>Enable Live Capture</span>
            <input 
              type="checkbox" 
              checked={settings.captureEnabled}
              onChange={(e) => handleChange('captureEnabled', e.target.checked)}
            />
          </label>
          <label>
            <span>Alert Level Threshold</span>
            <select 
              value={settings.alertLevel}
              onChange={(e) => handleChange('alertLevel', e.target.value)}
            >
              <option>CRITICAL</option>
              <option>HIGH</option>
              <option>MEDIUM</option>
              <option>LOW</option>
            </select>
          </label>
          <label>
            <span>Enable Auto Analysis</span>
            <input 
              type="checkbox"
              checked={settings.autoAnalysis}
              onChange={(e) => handleChange('autoAnalysis', e.target.checked)}
            />
          </label>
        </div>
      </div>

      <div className="glass-card">
        <h2>Data Management</h2>
        <div className="settings-group">
          <label>
            <span>Data Retention (days)</span>
            <input 
              type="number" 
              value={settings.dataRetention}
              onChange={(e) => handleChange('dataRetention', e.target.value)}
              min="1"
              max="365"
            />
          </label>
        </div>
      </div>

      <div className="glass-card">
        <h2>System Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">System Version</span>
            <span className="info-value">v1.0.0</span>
          </div>
          <div className="info-item">
            <span className="info-label">Database Status</span>
            <span className="info-value" style={{ color: '#22c55e' }}>Connected</span>
          </div>
          <div className="info-item">
            <span className="info-label">ML Model</span>
            <span className="info-value">XGBoost v2.0</span>
          </div>
          <div className="info-item">
            <span className="info-label">Uptime</span>
            <span className="info-value">99.8%</span>
          </div>
        </div>
      </div>

      <div className="glass-card">
        <h2>Danger Zone</h2>
        <div className="action-buttons">
          <button style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
            Clear Cache
          </button>
          <button style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
            Reset Settings
          </button>
          <button style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
            Export Database
          </button>
        </div>
      </div>
    </div>
  )
}
