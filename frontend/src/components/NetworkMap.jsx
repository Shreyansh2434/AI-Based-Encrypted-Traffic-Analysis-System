/**
 * Network Map - Real-time threat visualization
 * Force-directed graph showing live attack flows
 */

import { useMemo, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";

export default function NetworkMap({ threats = [] }) {
  const [selectedNode, setSelectedNode] = useState(null);

  const { graph, stats } = useMemo(() => {
    const recentThreats = threats.slice(0, 280);
    const nodeMap = new Map();
    const links = [];
    let attackFlows = 0;

    recentThreats.forEach((threat, idx) => {
      const src = threat.source_ip || "unknown";
      const dst = threat.dest_ip || "unknown";
      const riskScore = Number(threat.risk_score || 0);
      const isAttack = threat.prediction === "attack" || riskScore >= 40;

      const upsertNode = (id) => {
        const existing = nodeMap.get(id);
        if (existing) {
          existing.count += 1;
          existing.maxRisk = Math.max(existing.maxRisk, riskScore);
          existing.isAttack = existing.isAttack || isAttack;
          existing.color = existing.isAttack ? "#ef4444" : "#22c55e";
          return existing;
        }

        const node = {
          id,
          count: 1,
          maxRisk: riskScore,
          isAttack,
          color: isAttack ? "#ef4444" : "#22c55e",
        };
        nodeMap.set(id, node);
        return node;
      };

      upsertNode(src);
      upsertNode(dst);

      links.push({
        id: `${src}-${dst}-${idx}`,
        source: src,
        target: dst,
        isAttack,
        riskScore,
        threatType: threat.threat_type || "Encrypted flow",
      });

      if (isAttack) {
        attackFlows += 1;
      }
    });

    const nodes = Array.from(nodeMap.values()).map((node) => ({
      ...node,
      nodeSize: Math.min(18, 6 + node.count * 1.8),
    }));

    const totalFlows = recentThreats.length;
    const benignFlows = Math.max(totalFlows - attackFlows, 0);

    return {
      graph: { nodes, links },
      stats: {
        totalFlows,
        attackFlows,
        benignFlows,
        uniqueHosts: nodes.length,
        detectionRate: totalFlows > 0 ? Math.round((attackFlows / totalFlows) * 100) : 0,
      },
    };
  }, [threats]);

  return (
    <div className="network-map-container">
      <div className="network-map-header">
        <h3>Live Network Threat Map</h3>
        <p>Topology from most recent encrypted flow events</p>
      </div>

      <div className="network-stats-grid">
        <div className="network-stat-card">
          <span className="network-stat-label">Recent Flows</span>
          <span className="network-stat-value">{stats.totalFlows}</span>
        </div>
        <div className="network-stat-card attack">
          <span className="network-stat-label">Attack Flows</span>
          <span className="network-stat-value">
            {stats.attackFlows}
          </span>
        </div>
        <div className="network-stat-card benign">
          <span className="network-stat-label">Benign Flows</span>
          <span className="network-stat-value">
            {stats.benignFlows}
          </span>
        </div>
        <div className="network-stat-card">
          <span className="network-stat-label">Threat Ratio</span>
          <span className="network-stat-value">{stats.detectionRate}%</span>
        </div>
        <div className="network-stat-card">
          <span className="network-stat-label">Unique Hosts</span>
          <span className="network-stat-value">{stats.uniqueHosts}</span>
        </div>
      </div>

      {graph.nodes.length > 0 ? (
        <div className="force-graph-wrapper">
          <ForceGraph2D
            graphData={graph}
            nodeCanvasObject={(node, ctx) => {
              if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) return;
              const size = node.nodeSize || 5;
              ctx.fillStyle = node.color || "#3b82f6";
              ctx.beginPath();
              ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
              ctx.fill();

                ctx.font = "10px Space Mono";
                ctx.fillStyle = "#cbd5e1";
                ctx.fillText(String(node.id).slice(0, 15), node.x + size + 3, node.y + 2);
              }}
              linkCanvasObject={(link, ctx) => {
                if (
                  typeof link.source !== "object" ||
                  typeof link.target !== "object" ||
                  !Number.isFinite(link.source.x) ||
                  !Number.isFinite(link.source.y) ||
                  !Number.isFinite(link.target.x) ||
                  !Number.isFinite(link.target.y)
                ) {
                  return;
                }
                ctx.strokeStyle = link.isAttack ? "#ef4444" : "#22c55e";
                ctx.lineWidth = link.isAttack ? 1.8 : 1;
                ctx.globalAlpha = link.isAttack ? 0.75 : 0.35;
                ctx.beginPath();
                ctx.moveTo(link.source.x, link.source.y);
                ctx.lineTo(link.target.x, link.target.y);
                ctx.stroke();
                ctx.globalAlpha = 1;
              }}
              linkDirectionalParticles={(link) => (link.isAttack ? 2 : 1)}
              linkDirectionalParticleSpeed={(link) => (link.isAttack ? 0.009 : 0.004)}
              onNodeClick={(node) => setSelectedNode(node)}
              minZoom={0.35}
              maxZoom={8}
              cooldownTicks={80}
              enableNodeDrag={true}
            />
          {selectedNode && (
            <div className="node-detail-panel">
              <h4>{selectedNode.id}</h4>
              <p>
                <strong>Type:</strong> {selectedNode.isAttack ? "High-risk host" : "Benign host"}
              </p>
              <p><strong>Flows:</strong> {selectedNode.count || 1}</p>
              <p><strong>Max Risk:</strong> {Math.round(selectedNode.maxRisk || 0)}</p>
              <button onClick={() => setSelectedNode(null)}>Close</button>
            </div>
          )}
        </div>
      ) : (
        <div className="no-data-placeholder">
          <p>Waiting for network traffic...</p>
          <p className="muted">Start live monitoring to see network flows</p>
        </div>
      )}
    </div>
  );
}
