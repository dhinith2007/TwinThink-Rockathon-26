import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot, Sparkles, CheckCircle2, ShieldCheck, Cpu, Terminal, Layers, Check, Clock } from 'lucide-react';
import { useProcurement } from '../../context/ProcurementContext';

const structuredStages = [
  {
    stage: "UNDERSTANDING",
    badgeColor: "bg-primary/20 text-primary border-primary/30",
    steps: [
      { text: "Ingested natural language buying intent prompt in 120ms.", detail: "Target item: 10 × Dell Latitude 5440 Laptops, Budget ≤ ₹45,000/unit." }
    ]
  },
  {
    stage: "ANALYZING",
    badgeColor: "bg-success/20 text-success border-success/30",
    steps: [
      { text: "Extracted 4 Hard Constraints (RAM ≥ 16GB, SSD ≥ 512GB, Delivery ≤ 7d, Budget ≤ ₹45k).", detail: "All mandatory hard constraints marked as strict filters." },
      { text: "Identified 3 Soft Preferences (Dell ProSupport, Fast Delivery, High Reliability).", detail: "Soft weighting set to 35% in multi-objective function." },
      { text: "Resolved Ambiguity: OS unstated → Auto-assigned 'Windows 11 Pro Enterprise' from policy.", detail: "Default corporate OS profile applied." }
    ]
  },
  {
    stage: "COMPARING",
    badgeColor: "bg-primary/20 text-primary border-primary/30",
    steps: [
      { text: "Scanned active enterprise supplier catalog (12 candidate vendors indexed).", detail: "Queried real-time vendor APIs & inventory records." },
      { text: "Eliminated 7 non-compliant vendors failing mandatory RAM & delivery lead time.", detail: "Disqualification reasons recorded for transparency." },
      { text: "Normalized hardware specifications across top 3 candidates (Dell Latitude 5440).", detail: "Specs standardized across OEMs to ensure 1:1 parity." }
    ]
  },
  {
    stage: "VALIDATING",
    badgeColor: "bg-warning/20 text-warning border-warning/30",
    steps: [
      { text: "Executed 5-dimension risk decomposition (Price, Delivery, Reliability, Return, Contract).", detail: "CompSource risk score: 14/100 (Low Risk)." },
      { text: "Multi-objective optimization evaluated CompSource with highest score (93.5/100).", detail: "Saved ₹30,000 against maximum budget allocation." }
    ]
  },
  {
    stage: "FINALIZING",
    badgeColor: "bg-success/20 text-success border-success/30",
    steps: [
      { text: "Evaluated 5 Policy Firewall governance rules → Outcome: ESCALATE (Amount > ₹2.00L).", detail: "Policy POL-001 routed to VP Executive sign-off." },
      { text: "Appended tamper-evident SHA-256 hash chained record to procurement ledger.", detail: "Cryptographic genesis hash chained." }
    ]
  }
];

export function AIReasoningPanel() {
  const { isReasoningOpen, toggleReasoningPanel, aiConfidence, currentRequest } = useProcurement();
  const [visibleStepCount, setVisibleStepCount] = useState(0);

  // Sequential reveal every 250ms when panel is open
  useEffect(() => {
    if (isReasoningOpen) {
      setVisibleStepCount(0);
      const totalSteps = structuredStages.reduce((acc, stage) => acc + stage.steps.length, 0);
      
      let count = 0;
      const interval = setInterval(() => {
        count += 1;
        setVisibleStepCount(count);
        if (count >= totalSteps) {
          clearInterval(interval);
        }
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isReasoningOpen]);

  let globalStepCounter = 0;

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
            className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-surface border-l border-primary/40 z-50 p-6 flex flex-col shadow-glow-primary overflow-y-auto"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold font-mono text-text-primary">AI Reasoning Narrative</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-primary/20 text-primary border border-primary/30 animate-pulse">
                      SEQUENTIAL TRACE
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted font-mono">Autonomous Execution Pipeline</p>
                </div>
              </div>

              <button
                onClick={toggleReasoningPanel}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Confidence Score Gauge */}
            <div className="p-4 rounded-2xl bg-bg border border-border mb-5 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-text-muted">Procurement Intelligence Score</span>
                <span className="text-success font-bold">{aiConfidence}% Confidence</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${aiConfidence}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-primary via-success to-primary"
                ></motion.div>
              </div>
              <div className="text-[10px] text-text-muted font-mono flex justify-between">
                <span>Hard Constraints: 100% Satisfied</span>
                <span>Risk Index: 14/100 (Low)</span>
              </div>
            </div>

            {/* Structured Stages Narrative */}
            <div className="flex-1 space-y-5 font-mono text-xs">
              <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-primary" />
                <span>Multi-Stage Reasoning Trace</span>
              </div>

              <div className="space-y-4">
                {structuredStages.map((stageGroup, sIdx) => (
                  <div key={stageGroup.stage} className="p-4 rounded-xl bg-black/40 border border-border/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${stageGroup.badgeColor}`}>
                        STAGE {sIdx + 1}: {stageGroup.stage}
                      </span>
                      <span className="text-[10px] text-text-muted">
                        {stageGroup.steps.length} Steps
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {stageGroup.steps.map((step, idx) => {
                        globalStepCounter += 1;
                        const isVisible = visibleStepCount >= globalStepCounter;

                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: isVisible ? 1 : 0.25, x: isVisible ? 0 : 5 }}
                            transition={{ duration: 0.25 }}
                            className={`p-2.5 rounded-lg border transition-all ${
                              isVisible 
                                ? 'bg-surface/80 border-border text-text-primary' 
                                : 'bg-bg/40 border-border/40 text-text-muted'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {isVisible ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                              ) : (
                                <Clock className="w-3.5 h-3.5 text-text-muted shrink-0 mt-0.5 animate-spin" />
                              )}
                              <div>
                                <p className="text-[11px] font-semibold leading-snug">
                                  {step.text}
                                </p>
                                {isVisible && (
                                  <p className="text-[10px] text-text-muted mt-1 leading-normal">
                                    {step.detail}
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-border mt-4 text-[11px] font-mono text-text-muted flex justify-between items-center">
              <span>Engine: Procura-Reasoning-v2</span>
              <span className="text-success font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" /> Fully Verified
              </span>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default AIReasoningPanel;
