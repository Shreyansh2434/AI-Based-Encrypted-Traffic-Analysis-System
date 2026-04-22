import { motion } from "framer-motion";

export default function StatCard({ title, value, color="cyan" }) {

  const colors = {
    cyan: "border-cyan-500/30 text-cyan-300",
    red: "border-red-500/40 text-red-400",
    yellow: "border-yellow-500/40 text-yellow-300",
    green: "border-green-500/40 text-green-300"
  }

  return (

    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`p-5 rounded-xl border bg-white/5 backdrop-blur-xl ${colors[color]}`}
    >

      <div className="text-sm text-gray-400 mb-1">
        {title}
      </div>

      <div className="text-2xl font-semibold">
        {value}
      </div>

    </motion.div>

  );
}