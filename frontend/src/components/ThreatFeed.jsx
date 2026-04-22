import { motion } from "framer-motion";

export default function ThreatFeed({ data }) {

  if (!data || data.length === 0) {
    return (
      <div className="text-gray-500 text-center py-10">
        Waiting for network traffic...
      </div>
    );
  }

  return (

    <div className="space-y-2 max-h-[400px] overflow-auto">

      {data.map((row, i) => (

        <motion.div
          key={i}
          initial={{ opacity:0, y:8 }}
          animate={{ opacity:1, y:0 }}
          className={`grid grid-cols-3 p-3 rounded-lg border
          
          ${row.severity?.includes("Critical")
            ? "border-red-500/40 bg-red-500/10"
            : "border-white/10 bg-black/30"}
          
          `}
        >

          <div className="text-sm">
            {row.final_decision}
          </div>

          <div className="text-sm text-gray-400">
            Risk: {row.risk_score}
          </div>

          <div className="text-sm">
            {row.severity}
          </div>

        </motion.div>

      ))}

    </div>

  );
}