import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'
import ProblemStatement from './dashboard/ProblemStatement'
import LiveMonitoring from './dashboard/LiveMonitoring'
import BatchAnalysis from './dashboard/BatchAnalysis'
import ModelDetails from './dashboard/ModelDetails'
import PerformanceTesting from './dashboard/PerformanceTesting'
import '../styles/global.css'
import '../styles/dashboard.css'
import '../styles/batch-analysis.css'

export default function DashboardLayout() {
  const [mode, setMode] = useState('problem-statement')
  const navigate = useNavigate()
  const location = useLocation()

  const navigationOptions = [
    { id: 'problem-statement', label: 'Problem Statement', path: 'problem-statement' },
    { id: 'live-monitoring', label: 'Live Monitoring', path: 'live-monitoring' },
    { id: 'batch-analysis', label: 'Batch Analysis', path: 'batch-analysis' },
    { id: 'model-details', label: 'Model Details', path: 'model-details' },
    { id: 'performance-testing', label: 'Performance Testing', path: 'performance-testing' },
  ]

  // Sync mode with current location
  useEffect(() => {
    const pathname = location.pathname.replace('/', '')
    const matchedOption = navigationOptions.find(opt => opt.path === pathname)
    if (matchedOption) {
      setMode(matchedOption.id)
    } else {
      setMode('problem-statement')
    }
  }, [location.pathname])

  const handleModeChange = (selectedMode) => {
    const option = navigationOptions.find(opt => opt.id === selectedMode)
    if (option) navigate(`/${option.path}`)
  }

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar
          navigationOptions={navigationOptions}
          currentMode={mode}
          onModeChange={handleModeChange}
        />
        <main className="dashboard-main">
          <Routes>
            <Route path="problem-statement" element={<ProblemStatement />} />
            <Route path="live-monitoring" element={<LiveMonitoring />} />
            <Route path="batch-analysis" element={<BatchAnalysis />} />
            <Route path="model-details" element={<ModelDetails />} />
            <Route path="performance-testing" element={<PerformanceTesting />} />
            <Route path="/" element={<ProblemStatement />} />
            <Route path="*" element={<ProblemStatement />} />
          </Routes>
        </main>
      </div>
      <footer className="dashboard-footer">
        <p>CIPHER TRAFFIC ANALYZER • Enterprise Threat Detection • v3.0</p>
        <p>ML-Powered Encrypted Traffic Analysis • Real-Time Detection • Zero Decryption</p>
      </footer>
    </div>
  )
}
