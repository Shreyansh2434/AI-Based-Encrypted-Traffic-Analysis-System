import { useState, useEffect } from 'react'
import './styles/app.css'
import Navigation from './components/Navigation'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import Reports from './pages/Reports'
import Alerts from './pages/Alerts'

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(false)
  }, [currentPage])

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'reports':
        return <Reports />
      case 'alerts':
        return <Alerts />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="app-container">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="app-main">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        ) : (
          renderPage()
        )}
      </main>
      <footer className="app-footer">
        <p>CIPHER TRAFFIC ANALYZER • Enterprise Threat Detection • v1.0</p>
        <p>AI-Powered Encrypted Traffic Analysis • Real-Time Detection</p>
      </footer>
    </div>
  )
}
