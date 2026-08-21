import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Cpu, GitCompare, ShieldCheck, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';

const loadingSteps = [
  {
    icon: Bot,
    text: "Detecting procurement intent...",
    detail: "Natural-language NLP parsing active"
  },
  {
    icon: Cpu,
    text: "Extracting hard constraints...",
    detail: "Budget, Qty, RAM, Delivery SLA detected"
  },
  {
    icon: GitCompare,
    text: "Searching vendor network...",
    detail: "12 registered vendors evaluated"
  },
  {
    icon: ShieldCheck,
    text: "Calculating procurement risk...",
    detail: "Multi-objective scoring complete"
  },
  {
    icon: CheckCircle2,
    text: "Preparing recommendation...",
    detail: "Decision packet & audit ledger ready"
  },
];

const STEP_DURATION_MS = 500;
const COMPLETE_DELAY_MS = 400;

export function LoadingModal({ isOpen, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setIsDone(false);
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        }
        clearInterval(intervalRef.current);
        setIsDone(true);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, COMPLETE_DELAY_MS);
        return prev;
      });
    }, STEP_DURATION_MS);

    return () => clearInterval(intervalRef.current);
  }, [isOpen]);

  if (!isOpen) return null;

  const progress = ((currentStep + 1) / loadingSteps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full max-w-md rounded-2xl bg-surface border border-primary/50 shadow-glow-primary overflow-hidden"
      >
        {/* Animated gradient top bar */}
        <div className="h-1 bg-gradient-to-r from-primary via-success to-primary animate-pulse" />

        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0">
              {isDone
                ? <CheckCircle2 className="w-7 h-7 text-success" />
                : <Loader2 className="w-7 h-7 animate-spin" />
              }
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-success border-2 border-surface animate-ping" />
            </div>
            <div>
              <h3 className="text-base font-bold font-mono text-text-primary tracking-tight">
                {isDone ? "Analysis Complete" : "Analyzing Procurement Request..."}
              </h3>
              <p className="text-[11px] text-text-muted font-mono">
                ProcuraAI Constraint & Authorization Engine
              </p>
            </div>
          </div>

          {/* Step list */}
          <div className="space-y-2 font-mono">
            {loadingSteps.map((step, idx) => {
              const StepIcon = step.icon;
              const stepDone = idx < currentStep || (idx === currentStep && isDone);
              const stepActive = idx === currentStep && !isDone;
              const stepPending = idx > currentStep;

              return (
                <motion.div
                  key={idx}
                  initial={false}
                  animate={{
                    opacity: stepPending ? 0.35 : 1,
                    x: stepActive ? [0, 2, 0] : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-xs transition-all duration-300 ${
                    stepDone
                      ? 'bg-success/10 border-success/30 text-success'
                      : stepActive
                      ? 'bg-primary/15 border-primary/40 text-primary font-semibold'
                      : 'bg-bg/30 border-border/40 text-text-muted'
                  }`}
                >
                  {/* Status indicator */}
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border text-[10px] font-bold ${
                    stepDone ? 'border-success bg-success/20' : stepActive ? 'border-primary bg-primary/20' : 'border-border'
                  }`}>
                    {stepDone ? '✓' : stepActive
                      ? <span className="w-2 h-2 rounded-full bg-primary animate-pulse block" />
                      : <span className="text-text-muted">{idx + 1}</span>
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="truncate">{step.text}</div>
                    {(stepDone || stepActive) && (
                      <div className="text-[10px] opacity-70 truncate mt-0.5">{step.detail}</div>
                    )}
                  </div>

                  {stepActive && <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />}
                  {stepDone && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                </motion.div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-mono text-text-muted">
              <span>Processing...</span>
              <span className="text-primary font-bold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-bg overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-success"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default LoadingModal;
