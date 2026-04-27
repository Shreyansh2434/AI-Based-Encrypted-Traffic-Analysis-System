/**
 * Utility functions for Cipher Traffic Analyzer frontend
 */

/**
 * Generate synthetic threat data for demo/testing
 */
export const generateThreat = () => {
  const risk = Math.floor(Math.random() * (95 - 10 + 1)) + 10
  const now = new Date()
  const timestamp = now.toLocaleTimeString()

  return {
    timestamp,
    source_ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    dest_ip: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    threat_type: ['Botnet C2', 'DDoS Attack', 'Brute Force', 'Data Exfil', 'Zero-Day'][
      Math.floor(Math.random() * 5)
    ],
    risk_score: risk,
    packets: Math.floor(Math.random() * (5000 - 50 + 1)) + 50,
    bytes: Math.floor(Math.random() * (500000 - 1000 + 1)) + 1000,
    protocol: ['TCP', 'UDP', 'ICMP'][Math.floor(Math.random() * 3)],
  }
}

/**
 * Get threat severity level and color code
 */
export const getSeverity = (risk) => {
  if (risk >= 80) return { level: 'CRITICAL', color: '#dc2626', class: 'threat-critical' }
  if (risk >= 60) return { level: 'HIGH', color: '#ef4444', class: 'threat-high' }
  if (risk >= 40) return { level: 'MEDIUM', color: '#f97316', class: 'threat-medium' }
  return { level: 'LOW', color: '#22c55e', class: 'threat-low' }
}

/**
 * Calculate metrics from threats array
 */
export const calculateMetrics = (threats) => {
  if (!threats || threats.length === 0) {
    return {
      total: 0,
      critical: 0,
      high: 0,
      avgRisk: 0,
      uniqueIPs: 0,
      totalMB: 0,
    }
  }

  const total = threats.length
  const critical = threats.filter(t => t.risk_score >= 80).length
  const high = threats.filter(t => t.risk_score >= 60 && t.risk_score < 80).length
  const avgRisk = Math.round(threats.reduce((sum, t) => sum + t.risk_score, 0) / total)

  const ips = new Set()
  threats.forEach(t => {
    ips.add(t.source_ip)
    ips.add(t.dest_ip)
  })
  const uniqueIPs = ips.size

  const totalBytes = threats.reduce((sum, t) => sum + t.bytes, 0)
  const totalMB = Math.round(totalBytes / 1_000_000)

  return { total, critical, high, avgRisk, uniqueIPs, totalMB }
}

/**
 * Parse CSV content (client-side)
 */
export const parseCSV = (csvContent) => {
  const lines = csvContent.split('\n').filter(line => line.trim())
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  const data = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    if (values.length !== headers.length) continue

    const row = {}
    headers.forEach((header, idx) => {
      row[header] = values[idx]
    })
    data.push(row)
  }

  return data
}

/**
 * Calculate risk score from flow characteristics
 */
export const calculateRiskScore = (row) => {
  let risk = 50 // Base risk

  const labels = [
    'label', 'class', 'attack type', 'threat_type', 'prediction'
  ].find(key => row[key])

  if (labels) {
    const label = String(row[labels]).toLowerCase()
    // Check for attack indicators
    if (label.includes('attack') || label.includes('malicious') ||
        label.includes('botnet') || label.includes('ddos') ||
        label.includes('infiltration') || label.includes('port scan') ||
        label.includes('web attack') || label.includes('brute force') ||
        label.includes('xss') || label.includes('sql')) {
      risk = 75 + Math.random() * 20 // 75-95
    } else if (label.includes('benign') || label.includes('normal')) {
      risk = 15 + Math.random() * 20 // 15-35
    }
  }

  // Adjust by packet characteristics
  const fwdPkts = parseFloat(row['total fwd packets'] || row['fwd_pkts'] || 0)
  const bwdPkts = parseFloat(row['total backward packets'] || row['bwd_pkts'] || 0)
  const duration = parseFloat(row['flow duration'] || row['duration'] || 0)

  // High packet count = suspicious
  if (fwdPkts > 1000 || bwdPkts > 1000) risk = Math.min(95, risk + 15)

  // Short duration with high packets = suspicious
  if (duration < 1000 && (fwdPkts > 500 || bwdPkts > 500)) risk = Math.min(95, risk + 10)

  return Math.round(Math.min(95, Math.max(10, risk)))
}

/**
 * Normalize CSV data to standard format
 */
export const normalizeDataFrame = (data) => {
  if (!Array.isArray(data)) return []

  const colMapping = {
    'flow duration': 'duration',
    'total fwd packets': 'fwd_pkts',
    'total backward packets': 'bwd_pkts',
    'total length of fwd packets': 'fwd_bytes',
    'total length of bwd packets': 'bwd_bytes',
    'source ip': 'source_ip',
    'destination ip': 'dest_ip',
    'protocol': 'protocol',
    'label': 'threat_type',
    'class': 'threat_type',
    'attack type': 'threat_type',
  }

  return data.map((row, idx) => {
    const normalized = {}

    // Normalize column names and map values
    Object.entries(row).forEach(([key, value]) => {
      const lowerKey = key.toLowerCase().trim()
      const mappedKey = colMapping[lowerKey] || lowerKey
      normalized[mappedKey] = value
    })

    // Fill missing required columns
    if (!normalized.source_ip) {
      normalized.source_ip = `192.168.1.${Math.floor(Math.random() * 255)}`
    }
    if (!normalized.dest_ip) {
      normalized.dest_ip = `10.0.0.${Math.floor(Math.random() * 255)}`
    }
    if (!normalized.threat_type) {
      normalized.threat_type = normalized.risk_score > 60 ? 'Attack' : 'Normal'
    }

    // Calculate risk_score from actual data or estimate
    if (!normalized.risk_score) {
      normalized.risk_score = calculateRiskScore(row)
    } else {
      normalized.risk_score = parseFloat(normalized.risk_score) || calculateRiskScore(row)
    }

    return normalized
  })
}

/**
 * Get threat distribution from threats array
 */
export const getThreatDistribution = (threats) => {
  const distribution = {}
  threats.forEach(t => {
    distribution[t.threat_type] = (distribution[t.threat_type] || 0) + 1
  })
  return distribution
}

/**
 * Format number with commas
 */
export const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * Convert bytes to MB
 */
export const formatBytes = (bytes) => {
  return Math.round(bytes / 1_000_000)
}
