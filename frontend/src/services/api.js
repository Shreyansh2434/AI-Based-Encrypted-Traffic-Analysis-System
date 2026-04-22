// WebSocket Service for real-time data
export class WebSocketService {
  constructor(url = 'ws://127.0.0.1:8000/ws') {
    this.url = url
    this.ws = null
    this.listeners = new Map()
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 3000
  }

  connect() {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url)
        this.ws.onopen = () => {
          console.log('[WS] Connected')
          this.reconnectAttempts = 0
          resolve()
        }
        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            this.emit(data.type || 'message', data)
          } catch (e) {
            console.error('[WS] Parse error:', e)
          }
        }
        this.ws.onerror = (error) => {
          console.error('[WS] Error:', error)
          reject(error)
        }
        this.ws.onclose = () => {
          console.log('[WS] Closed')
          this.attemptReconnect()
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => this.connect(), this.reconnectDelay)
    }
  }

  send(type, data = {}) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, ...data }))
    }
  }

  on(type, callback) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, [])
    }
    this.listeners.get(type).push(callback)
    return () => {
      const callbacks = this.listeners.get(type)
      const index = callbacks.indexOf(callback)
      if (index > -1) callbacks.splice(index, 1)
    }
  }

  emit(type, data) {
    if (this.listeners.has(type)) {
      this.listeners.get(type).forEach(cb => cb(data))
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN
  }
}

// API Service
const API = "http://127.0.0.1:8000"

export class APIService {
  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${API}${endpoint}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error(`[API] Error:`, error)
      throw error
    }
  }

  async getThreatData() {
    return this.request('/api/threats')
  }

  async getStats() {
    return this.request('/api/stats')
  }

  async startCapture() {
    return this.request('/api/capture/start', { method: 'POST' })
  }

  async stopCapture() {
    return this.request('/api/capture/stop', { method: 'POST' })
  }

  async predictThreat(data) {
    return this.request('/predict', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async analyzeDataset(file) {
    const form = new FormData()
    form.append("file", file)
    return fetch(`${API}/predict`, {
      method: "POST",
      body: form
    }).then(res => res.json())
  }
}

export const apiService = new APIService()
export const wsService = new WebSocketService()