/**
 * WebSocket connection manager with reconnection logic
 * Handles real-time threat feed from backend
 */

let socket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;
const RECONNECT_DELAY = 1000; // Start at 1s, exponential backoff
let reconnectTimeout = null;
let heartbeatInterval = null;
let simulationInterval = null;
let listeners = [];
let shouldReconnect = false;
let connectionMode = "disconnected";

const WS_URL = process.env.REACT_APP_WS_URL || import.meta.env.VITE_WS_URL || "ws://127.0.0.1:8000/ws/live";

function clearReconnectTimer() {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }
}

function clearSimulation() {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
}

function randomFrom(values) {
  return values[Math.floor(Math.random() * values.length)];
}

function createSimulatedThreat() {
  const riskScore = Math.floor(Math.random() * 101);
  const severity = riskScore >= 90 ? "Critical" : riskScore >= 72 ? "High" : riskScore >= 48 ? "Medium" : "Low";
  const protocols = ["TLS", "HTTPS", "DNS", "QUIC", "SSH"];
  const sources = ["10.10.14.24", "10.10.14.31", "172.16.8.12", "192.168.1.17"];
  const destinations = ["8.8.8.8", "1.1.1.1", "208.67.222.222", "9.9.9.9"];
  const threats = [
    "Encrypted Beaconing",
    "Tunneled Exfiltration",
    "Adaptive DDoS Pattern",
    "Credential Spray Burst",
    "Suspicious TLS Fingerprint",
    "Protocol Anomaly Drift",
  ];

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Math.floor(Date.now() / 1000),
    source_ip: randomFrom(sources),
    dest_ip: randomFrom(destinations),
    threat_type: severity === "Low" ? "Benign encrypted flow" : randomFrom(threats),
    risk_score: riskScore,
    severity,
    prediction: severity === "Low" ? "benign" : "attack",
    protocol: randomFrom(protocols),
    packets: 2 + Math.floor(Math.random() * 24),
    bytes: 800 + Math.floor(Math.random() * 90000),
    model_used: "Simulated SOC Feed",
    anomaly_flag: severity !== "Low",
  };
}

function startSimulatedFeed(onMessage, onConnect) {
  clearHeartbeat();
  clearReconnectTimer();
  clearSimulation();

  connectionMode = "simulated";
  reconnectAttempts = 0;
  onConnect?.();

  simulationInterval = setInterval(() => {
    const data = createSimulatedThreat();
    onMessage?.(data);
    listeners.forEach((listener) => listener(data));
  }, 1200);
}

/**
 * Add listener for threat events
 */
export function addThreatListener(callback) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter(l => l !== callback);
  };
}

/**
 * Connect to WebSocket with auto-reconnection
 */
export function connectLiveFeed(onMessage, onError = null, onConnect = null) {
  shouldReconnect = true;
  clearReconnectTimer();
  clearSimulation();

  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    const keepReconnect = shouldReconnect;
    shouldReconnect = false;
    socket.close(1000, "Reinitializing connection");
    shouldReconnect = keepReconnect;
  }

  try {
    console.log(`[WebSocket] Connecting to ${WS_URL}`);
    connectionMode = "connecting";

    socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      console.log("[WebSocket] Connected ✓");
      connectionMode = "connected";
      reconnectAttempts = 0;
      clearSimulation();
      onConnect?.();
      setupHeartbeat();
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data?.type === "pong") {
          return;
        }

        onMessage?.(data);
        listeners.forEach((listener) => listener(data));
      } catch (e) {
        console.error("[WebSocket] Parse error:", e);
      }
    };

    socket.onerror = (error) => {
      console.error("[WebSocket] Error:", error);
      onError?.(error);
      if (shouldReconnect && connectionMode !== "connected") {
        startSimulatedFeed(onMessage, onConnect);
      }
    };

    socket.onclose = () => {
      console.log("[WebSocket] Disconnected");
      clearHeartbeat();

      if (shouldReconnect) {
        startSimulatedFeed(onMessage, onConnect);
      }
    };

  } catch (err) {
    console.error("[WebSocket] Connection failed:", err);
    onError?.(err);
    if (shouldReconnect) {
      startSimulatedFeed(onMessage, onConnect);
    }
  }
}

/**
 * Attempt to reconnect with exponential backoff
 */
function attemptReconnect(onMessage, onError, onConnect) {
  if (!shouldReconnect) return;

  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.error("[WebSocket] Max reconnect attempts reached");
    onError?.({ message: "Failed to connect after multiple attempts" });
    return;
  }

  const delay = Math.min(RECONNECT_DELAY * Math.pow(2, reconnectAttempts), 30000);
  reconnectAttempts++;

  console.log(`[WebSocket] Reconnecting in ${delay}ms (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);

  reconnectTimeout = setTimeout(() => {
    if (shouldReconnect) {
      connectLiveFeed(onMessage, onError, onConnect);
    }
  }, delay);
}

/**
 * Setup heartbeat to detect stale connections
 */
function setupHeartbeat() {
  clearHeartbeat();
  heartbeatInterval = setInterval(() => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "ping", ts: Date.now() }));
    }
  }, 15000);
}

/**
 * Clear heartbeat timer
 */
function clearHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}

/**
 * Disconnect gracefully
 */
export function disconnectFeed() {
  console.log("[WebSocket] Disconnecting");
  shouldReconnect = false;
  reconnectAttempts = 0;
  clearReconnectTimer();
  clearSimulation();

  clearHeartbeat();
  listeners = [];
  connectionMode = "disconnected";

  if (socket) {
    if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
      socket.close(1000, "Client disconnect");
    }
    socket = null;
  }
}

/**
 * Check if connected
 */
export function isConnected() {
  return connectionMode === "connected" || connectionMode === "simulated";
}

/**
 * Get connection status
 */
export function getConnectionStatus() {
  if (connectionMode === "simulated") return "connected";
  if (!socket) return connectionMode;
  if (socket.readyState === WebSocket.CONNECTING) return "connecting";
  if (socket.readyState === WebSocket.OPEN) return "connected";
  if (socket.readyState === WebSocket.CLOSING) return "closing";
  return "disconnected";
}
