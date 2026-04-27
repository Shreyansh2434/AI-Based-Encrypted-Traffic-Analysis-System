import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Shield, Radar, Sparkles, LineChart, Lock, Zap, Eye, ArrowRight, PlayCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const API_URL = "http://127.0.0.1:8000/predict";

const glass =
  "bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.45)]";

export default function PremiumEncryptedTrafficAI() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const riskGradient = useMemo(
    () =>
      "bg-[radial-gradient(circle_at_top,rgba(112,92,255,0.28),transparent_34%),radial-gradient(circle_at_70%_30%,rgba(0,229,255,0.16),transparent_28%),linear-gradient(180deg,#090b14_0%,#05070d_100%)]",
    []
  );

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      setData(result);
    } catch (err) {
      setError("Failed to connect to backend");
    }

    setLoading(false);
  };

  return (
    <div className={`min-h-screen text-white ${riskGradient}`}>
      
      <header className="flex justify-between p-6">
        <h1 className="text-xl font-semibold">🔐 Encrypted Traffic AI</h1>
      </header>

      <main className="max-w-6xl mx-auto p-6">

        {/* Upload Section */}
        <div className={`${glass} rounded-2xl p-6 mb-6`}>
          <h2 className="text-lg mb-4">Upload Traffic CSV</h2>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-4"
          />

          <Button onClick={handleUpload}>
            Analyze
          </Button>

          {loading && <p className="mt-4">⚡ Analyzing...</p>}
          {error && <p className="text-red-400 mt-4">{error}</p>}
        </div>

        {/* Results Section */}
        {data && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${glass} rounded-2xl p-6`}
          >
            <h2 className="text-lg mb-4">Live Results</h2>

            <div className="grid gap-3">
              {data.slice(0, 10).map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-3 bg-black/20 p-4 rounded-xl"
                >
                  <div>{row.final_decision}</div>
                  <div>Risk: {row.risk_score}</div>
                  <div>{row.severity}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}