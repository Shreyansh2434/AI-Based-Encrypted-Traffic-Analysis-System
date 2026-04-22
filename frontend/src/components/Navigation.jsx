import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import '../styles/navigation.css'

export default function Navigation({ currentPage, onPageChange }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const pages = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'alerts', label: 'Alerts', icon: '🚨' },
    { id: 'reports', label: 'Reports', icon: '📋' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ]

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  }

  const sidebarVariants = {
    hidden: { x: -280 },
    visible: { x: 0, transition: { duration: 0.3 } },
  }

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: (index) => ({
      x: 0,
      opacity: 1,
      transition: { delay: index * 0.1, duration: 0.3 },
    }),
  }

  return (
    <>
      <motion.nav className="navbar" variants={navVariants} initial="hidden" animate="visible">
        <div className="navbar-left">
          <motion.h1
            className="navbar-title"
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            ⚡ CIPHER TRAFFIC ANALYZER
          </motion.h1>
          <p className="navbar-subtitle">Enterprise Threat Detection System</p>
        </div>
        <div className="navbar-right">
          <motion.div
            className="connection-status"
            animate={{ opacity: [0.7, 1, 0.85] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            <div className="status-dot connected" />
            <span className="connection-label">Online</span>
          </motion.div>
          <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            ☰
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="sidebar-overlay"
            onClick={() => setIsMenuOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <motion.div
        className={`sidebar ${isMenuOpen ? 'open' : ''}`}
        variants={sidebarVariants}
        initial="hidden"
        animate={isMenuOpen ? 'visible' : 'hidden'}
      >
        <h2 className="sidebar-title">Navigation</h2>
        <div className="nav-items">
          {pages.map((page, index) => (
            <motion.button
              key={page.id}
              className={`nav-item ${currentPage === page.id ? 'active' : ''}`}
              onClick={() => {
                onPageChange(page.id)
                setIsMenuOpen(false)
              }}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              custom={index}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.span
                className="nav-icon"
                animate={{ rotate: currentPage === page.id ? 360 : 0 }}
                transition={{ duration: 0.5 }}
              >
                {page.icon}
              </motion.span>
              <span className="nav-label">{page.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </>
  )
}
