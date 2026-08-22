import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  DollarSign, 
  Truck, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Scale, 
  Info
} from 'lucide-react';

export function ProcurementIntelligenceCard({ 
  score = 93.5, 
  vendorName = "CompSource Enterprise Ltd.",
  breakdown = [
    { dimension: "Price Optimization", weight: 25, score: 24.5, icon: DollarSign, color: "text-primary", barColor: "bg-primary", note: "₹30k below max budget ceiling" },
    { dimension: "Delivery SLA", weight: 20, score: 19.0, icon: Truck, color: "text-success", barColor: "bg-success", note: "5-day SLA fulfills ≤ 7-day requirement" },
    { dimension: "Seller Reliability", weight: 35, score: 33.0, icon: ShieldCheck, color: "text-primary", barColor: "bg-primary", note: "94% historical SLA fulfillment rating" },
    { dimension: "Risk Profile", weight: 10, score: 8.5, icon: AlertTriangle, color: "text-warning", barColor: "bg-warning", note: "Low 14/100 risk score with return warranty" },
    { dimension: "Corporate Compliance", weight: 10, score: 8.5, icon: CheckCircle2, color: "text-success", barColor: "bg-success", note: "100% hard constraints met, enterprise Tier 1" }
  ]
}) {
  const [displayedScore, setDisplayedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = score;
    const duration = 1200; // 1.2s
    const startTime = performance.now();

    const animateNumber = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutProgress = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      const current = +(start + (end - start) * easeOutProgress).toFixed(1);
      setDisplayedScore(current);

      if (progress < 1) {
        requestAnimationFrame(animateNumber);
      } else {
        setDisplayedScore(end);
      }
    };

    requestAnimationFrame(animateNumber);
  }, [score]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="p-6 md:p-8 rounded-2xl bg-gradient-to-b from-surface via-surface to-bg border border-primary/40 shadow-glow-primary space-y-6 relative overflow-hidden"
    >
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-5 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FLAGSHIP INTELLIGENCE ENGINE</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-mono text-text-primary tracking-tight mt-2">
            Procurement Intelligence Score
          </h2>
          <p className="text-xs text-text-muted font-mono">
            Deterministic multi-objective decision matrix for <span className="text-text-primary font-bold">{vendorName}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-text-secondary bg-bg px-3 py-1.5 rounded-xl border border-border">
          <Scale className="w-4 h-4 text-primary" />
          <span>Multi-Objective Sourcing Matrix</span>
        </div>
      </div>

      {/* Large Center Score Section */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-6 rounded-2xl bg-black/40 border border-border/80 text-center sm:text-left relative z-10">
        <div className="relative flex items-center justify-center">
          {/* Circular glow indicator */}
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary/30 via-success/20 to-primary/40 flex items-center justify-center p-2.5 shadow-glow-primary">
            <div className="w-full h-full rounded-full bg-bg flex flex-col items-center justify-center border border-primary/50">
              <span className="text-3xl md:text-4xl font-extrabold font-mono text-text-primary tracking-tighter">
                {displayedScore}
              </span>
              <span className="text-[10px] font-mono text-primary uppercase font-bold tracking-wider">
                / 100 PTS
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-1 max-w-md">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-success text-bg shadow-glow-success">
              ⭐ OPTIMAL SELECTION
            </span>
            <span className="text-xs font-mono text-success font-semibold">Tier-1 Confidence</span>
          </div>
          <h3 className="text-base font-bold font-mono text-text-primary">
            Enterprise-Grade Recommendation Confidence
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed font-mono">
            Scored highest among 12 evaluated suppliers across price advantage, delivery lead time, and contract warranty fulfillment.
          </p>
        </div>
      </div>

      {/* 5 Scoring Dimensions Breakdown */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between text-xs font-mono text-text-muted uppercase tracking-wider">
          <span>Scoring Dimension & Weight</span>
          <span>Contribution Score</span>
        </div>

        <div className="space-y-3">
          {breakdown.map((item, idx) => {
            const Icon = item.icon;
            const percentage = (item.score / item.weight) * 100;

            return (
              <motion.div
                key={item.dimension}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.15 + 0.2, duration: 0.4 }}
                className="p-3.5 rounded-xl bg-surface border border-border/80 hover:border-border-glow transition-all"
              >
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-bg border border-border flex items-center justify-center text-text-primary">
                      <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                    </div>
                    <span className="font-semibold text-text-primary">{item.dimension}</span>
                    <span className="text-[10px] text-text-muted">(Weight: {item.weight}%)</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-text-primary font-mono text-xs">
                      {item.score.toFixed(1)} / {item.weight}
                    </span>
                    <span className="text-[10px] text-success font-bold font-mono">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full h-2 rounded-full bg-bg overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.15 + 0.3, ease: "easeOut" }}
                    className={`h-full ${item.barColor} rounded-full`}
                  />
                </div>

                <div className="text-[11px] text-text-muted font-mono mt-1.5 flex justify-between">
                  <span>{item.note}</span>
                  <span className="text-text-secondary">Optimal</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Trust & Transparency Explanation Footer */}
      <div className="p-4 rounded-xl bg-bg border border-border text-xs font-mono text-text-secondary flex items-start gap-3 relative z-10">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-text-primary">Confidence Calculation Rationale:</strong> Confidence is calculated using deterministic multi-objective procurement scoring, ensuring transparent vendor selection rather than opaque AI-only recommendations.
        </p>
      </div>
    </motion.div>
  );
}

export default ProcurementIntelligenceCard;
