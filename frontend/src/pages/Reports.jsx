import { useState } from 'react'
import { motion } from 'framer-motion'
import '../styles/pages.css'

export default function Reports() {
  const [reports, setReports] = useState([
    { id: 1, name: 'Daily Threat Summary', date: '2026-04-22', threats: 34, status: 'Complete', type: 'daily' },
    { id: 2, name: 'Weekly Security Report', date: '2026-04-15', threats: 247, status: 'Complete', type: 'weekly' },
    { id: 3, name: 'Monthly Compliance', date: '2026-04-01', threats: 891, status: 'Complete', type: 'monthly' },
    { id: 4, name: 'Incident Response Log', date: '2026-04-20', threats: 5, status: 'Active', type: 'incident' },
  ])

  const generateReport = (type) => {
    const newReport = {
      id: reports.length + 1,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Report`,
      date: new Date().toISOString().split('T')[0],
      threats: Math.floor(Math.random() * 1000),
      status: 'Generating',
      type: type
    }
    setReports([newReport, ...reports])
    setTimeout(() => {
      setReports(prev => prev.map(r => r.id === newReport.id ? { ...r, status: 'Complete' } : r))
    }, 2000)
  }

  return (
    <motion.div 
      className="page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        📋 Security Reports
      </motion.h1>
      <motion.p 
        className="page-subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Generate and manage compliance and threat reports
      </motion.p>

      <motion.div 
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2>Generate New Report</h2>
        <div className="action-buttons">
          {['Daily', 'Weekly', 'Monthly', 'Custom'].map((type, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => generateReport(type.toLowerCase())}
              transition={{ delay: 0.3 + i * 0.05 }}
            >
              {type} Report
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div 
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2>📁 Report History ({reports.length})</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Generated Date</th>
                <th>Threats Detected</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, idx) => (
                <motion.tr 
                  key={report.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.05 }}
                  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                >
                  <td><strong>{report.name}</strong></td>
                  <td>{report.date}</td>
                  <td style={{ color: report.threats > 100 ? '#ef4444' : '#22c55e', fontWeight: 600 }}>
                    {report.threats}
                  </td>
                  <td>
                    <span style={{
                      color: report.status === 'Complete' ? '#22c55e' : '#f97316',
                      fontWeight: 700,
                      padding: '4px 8px',
                      background: (report.status === 'Complete' ? '#22c55e' : '#f97316') + '20',
                      borderRadius: '4px',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                    }}>
                      {report.status}
                    </span>
                  </td>
                  <td>
                    <motion.button 
                      style={{ padding: '6px 12px', fontSize: '11px' }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      Download
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div 
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h2>📊 Report Statistics</h2>
        <div className="report-stats">
          <div className="stat">
            <div className="stat-label">Total Reports</div>
            <div className="stat-large">{reports.length}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Completed</div>
            <div className="stat-large" style={{ color: '#22c55e' }}>
              {reports.filter(r => r.status === 'Complete').length}
            </div>
          </div>
          <div className="stat">
            <div className="stat-label">Total Threats Detected</div>
            <div className="stat-large" style={{ color: '#ef4444' }}>
              {reports.reduce((sum, r) => sum + r.threats, 0)}
            </div>
          </div>
          <div className="stat">
            <div className="stat-label">Average Threats/Report</div>
            <div className="stat-large">
              {Math.round(reports.reduce((sum, r) => sum + r.threats, 0) / reports.length)}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
