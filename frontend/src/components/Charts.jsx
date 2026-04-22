import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { motion } from 'framer-motion'
import '../styles/charts.css'

const defaultTimelineData = [
  { time: '08:00', intensity: 12 },
  { time: '09:00', intensity: 18 },
  { time: '10:00', intensity: 22 },
  { time: '11:00', intensity: 26 },
  { time: '12:00', intensity: 24 },
  { time: '13:00', intensity: 31 },
  { time: '14:00', intensity: 27 },
  { time: '15:00', intensity: 29 },
]

const defaultRiskData = [
  { name: 'Critical', value: 34, color: '#dc2626' },
  { name: 'High', value: 56, color: '#ef4444' },
  { name: 'Medium', value: 89, color: '#f97316' },
  { name: 'Low', value: 145, color: '#22c55e' },
]

const defaultProtocolData = [
  { protocol: 'TCP', count: 3456 },
  { protocol: 'UDP', count: 2847 },
  { protocol: 'ICMP', count: 892 },
  { protocol: 'DNS', count: 1234 },
  { protocol: 'TLS', count: 2145 },
]

const tooltipStyle = {
  background: 'rgba(30, 41, 59, 0.95)',
  border: '1px solid rgba(59, 130, 246, 0.3)',
  borderRadius: '8px',
}

export function ThreatTimeline({
  data = defaultTimelineData,
  dataKey = 'intensity',
  title = 'Threat Intensity Timeline',
  stroke = '#ef4444',
}) {
  return (
    <motion.div
      className="chart-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.2)" />
          <XAxis dataKey="time" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#cbd5e1' }} />
          <Legend />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={stroke}
            strokeWidth={3}
            dot={{ fill: stroke, r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export function RiskDistribution({ data = defaultRiskData, title = 'Risk Distribution' }) {
  return (
    <motion.div
      className="chart-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={100}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#cbd5e1' }} />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export function ProtocolAnalysis({ data = defaultProtocolData, title = 'Protocol Distribution' }) {
  return (
    <motion.div
      className="chart-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.2)" />
          <XAxis dataKey="protocol" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#cbd5e1' }} />
          <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
