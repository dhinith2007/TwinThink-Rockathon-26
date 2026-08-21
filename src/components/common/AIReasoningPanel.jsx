import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot, Sparkles, CheckCircle2, ShieldCheck, Cpu, Terminal } from 'lucide-react';
import { useProcurement } from '../../context/ProcurementContext';

export function AIReasoningPanel() {
  const { isReasoningOpen, toggleReasoningPanel, aiConfidence, currentRequest, reasoningSteps } = useProcurement();

  const reasoningLogs = (reasoningSteps && reasoningSteps.length > 0)
    ? reasoningSteps.map((step, idx) => ({
        text: `✓ ${step}`,
        color: idx === 0 || idx === 1 || idx === 6 ? "text-success" : (idx === 7 ? "text-warning" : "text-primary")
      }))
    : [
        { text: "✓ Buying intent ingested & parsed in 140ms", color: "text-success" },
        { text: `✓ 4 Hard Constraints extracted (RAM ≥ 16GB, SSD ≥ 512GB, Qty = ${currentRequest.quantity}, Budget ≤ ₹${(currentRequest.unitBudget).toLocaleString()})`, color: "text-success" },
        { text: "✓ Ambiguity detected: OS unstated → Policy default assigned (Windows 11 Pro)", color: "text-warning" },
        { text: "✓ Multi-source network scan: 12 vendors evaluated", color: "text-primary" },
        { text: "✓ 7 vendors eliminated via Hard Constraint filtering", color: "text-text-secondary" },
        { text: "✓ Vendor B eliminated: Reliability 63% < 85% safety threshold", color: "text-danger" },
        { text: "✓ Vendor A selected: ₹42,000/unit, 5d delivery, 94% reliability", color: "text-success" },
        { text: "✓ Autonomous negotiation: Saved ₹20,000 on bulk order", color: "text-success" },
        { text: "✓ Firewall evaluation: POL-001 triggered → Escalated to VP Approval", color: "text-warning" },
        { text: `✓ Overall AI Decision Confidence: ${aiConfidence}%`, color: "text-primary font-bold" }
      ];

  return (
    <AnimatePresence>
      {isReasoningOpen && (
        <>
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleReasoningPanel}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40"
          />

          {/* Slide-over Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-surface border-l border-primary/40 z-50 p-6 flex flex-col shadow-glow-primary overflow-y-auto"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold font-mono text-text-primary">AI Reasoning Log</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-primary/20 text-primary border border-primary/30">
                      LIVE INFERENCE
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted font-mono">ProcuraAI Neural Sourcing Engine</p>
                </div>
              </div>

              <button
                onClick={toggleReasoningPanel}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Confidence Score Gauge */}
            <div className="p-4 rounded-2xl bg-bg border border-border mb-5 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-text-muted">Decision Confidence Metric</span>
                <span className="text-success font-bold">{aiConfidence}% Optimal</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${aiConfidence}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-primary to-success"
                ></motion.div>
              </div>
              <div className="text-[10px] text-text-muted font-mono flex justify-between">
                <span>Hard Constraints: 100% Met</span>
                <span>Risk Index: 14/100</span>
              </div>
            </div>

            {/* Sequential Reasoning Output in JetBrains Mono */}
            <div className="flex-1 space-y-3 font-mono text-xs">
              <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-primary" />
                <span>Real-Time Execution Trace</span>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-border/80 space-y-2.5 overflow-x-auto">
                {reasoningLogs.map((log, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className={`leading-relaxed text-[11px] ${log.color}`}
                  >
                    {log.text}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-border mt-4 text-[11px] font-mono text-text-muted flex justify-between items-center">
              <span>Model: Procura-Reasoning-v2</span>
              <span className="text-success">Status: Verified</span>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default AIReasoningPanel;
