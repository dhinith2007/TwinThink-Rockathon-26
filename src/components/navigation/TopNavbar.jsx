import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  Activity, 
  ShieldCheck, 
  Database, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronDown,
  Copy,
  Check,
  Zap,
  Info
} from 'lucide-react';
import { useProcurement } from '../../context/ProcurementContext';

const routeStepMap = {
  '/': { step: 0, title: 'Executive Overview' },
  '/new-request': { step: 1, title: 'New Request' },
  '/constraint-analysis': { step: 2, title: 'Constraint Analysis' },
  '/vendor-comparison': { step: 3, title: 'Vendor Comparison' },
  '/authorization-firewall': { step: 4, title: 'Authorization Firewall' },
  '/human-approval': { step: 5, title: 'Human Approval' },
  '/audit-timeline': { step: 6, title: 'Audit Timeline' },
};

export function TopNavbar() {
  const location = useLocation();
  const { 
    demoMode, 
    setDemoMode, 
    toggleReasoningPanel, 
    backendHealth, 
    isBackendConnected, 
    checkHealth, 
    demoSessionId 
  } = useProcurement();

  const [showHealthMenu, setShowHealthMenu] = useState(false);
  const [copiedSession, setCopiedSession] = useState(false);

  const currentRoute = routeStepMap[location.pathname] || { step: 0, title: 'ProcuraAI Engine' };

  const handleCopySession = () => {
    navigator.clipboard?.writeText(demoSessionId);
    setCopiedSession(true);
    setTimeout(() => setCopiedSession(false), 2000);
  };

  return (
    <>
      {/* Feature 7 — Demo Mode Announcement Banner */}
      {demoMode && (
        <div className="bg-warning/20 border-b border-warning/30 px-4 py-1.5 text-center text-xs font-mono text-warning flex items-center justify-center gap-2">
          <Info className="w-3.5 h-3.5" />
          <span>Demo Mode active: Using deterministic procurement simulation for zero-latency offline reliability.</span>
        </div>
      )}

      <header className="h-16 bg-surface/95 backdrop-blur border-b border-border px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        {/* Left: Step Progress Indicator */}
        <div className="flex items-center gap-4">
          {currentRoute.step > 0 ? (
            <div className="flex items-center gap-3">
              <div className="px-2.5 py-1 rounded-lg bg-primary/15 border border-primary/30 text-primary font-mono text-xs font-bold shrink-0">
                STEP {currentRoute.step} OF 6
              </div>
              <div className="hidden sm:block">
                <h2 className="text-sm font-bold font-mono text-text-primary tracking-tight">
                  {currentRoute.title}
                </h2>
                <div className="w-32 h-1 bg-bg rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-success transition-all duration-300"
                    style={{ width: `${(currentRoute.step / 6) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold font-mono text-text-primary tracking-tight">
                Executive Procurement Dashboard
              </h2>
            </div>
          )}
        </div>

        {/* Center: Session Chip & AI Engine Status Popover */}
        <div className="flex items-center gap-3">
          {/* Feature 10 — Session Chip */}
          <button
            onClick={handleCopySession}
            title="Click to copy session ID"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bg border border-border hover:border-primary/40 font-mono text-xs text-text-secondary transition-all cursor-pointer group"
          >
            <span className="w-2 h-2 rounded-full bg-success animate-pulse shrink-0" />
            <span>Session:</span>
            <span className="text-text-primary font-bold">{demoSessionId}</span>
            {copiedSession ? (
              <Check className="w-3 h-3 text-success ml-1" />
            ) : (
              <Copy className="w-3 h-3 text-text-muted group-hover:text-primary ml-1 transition-colors" />
            )}
          </button>

          {/* Interactive AI Diagnostics Trigger */}
          <div className="relative">
            <button
              onClick={() => {
                if (checkHealth) checkHealth();
                setShowHealthMenu(!showHealthMenu);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-bg border border-border hover:border-primary/40 transition-all cursor-pointer"
            >
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isBackendConnected ? 'bg-success' : 'bg-warning'
                }`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  isBackendConnected ? 'bg-success' : 'bg-warning'
                }`}></span>
              </span>
              <span className="text-xs font-mono font-bold text-text-primary hidden lg:inline">
                {isBackendConnected ? "Live AI Active" : "Sandbox Engine"}
              </span>
              <ChevronDown className="w-3 h-3 text-text-muted" />
            </button>

            {/* Diagnostic Popover */}
            <AnimatePresence>
              {showHealthMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-12 right-0 w-80 p-5 rounded-2xl bg-surface border border-primary/40 shadow-glow-primary z-50 font-mono text-xs space-y-4"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <span className="font-bold text-text-primary uppercase tracking-wider text-[11px]">ProcuraAI Engine Status</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isBackendConnected ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                    }`}>
                      {backendHealth.status?.toUpperCase() || "CONNECTED"}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-bg border border-border">
                      <span className="text-text-muted flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-primary" /> FastAPI Gateway
                      </span>
                      <span className="text-success font-semibold">{backendHealth.api || "Healthy"}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-bg border border-border">
                      <span className="text-text-muted flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-primary" /> Database ({backendHealth.database_type || "PostgreSQL"})
                      </span>
                      <span className="text-success font-semibold">{backendHealth.database || "Connected"}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-bg border border-border">
                      <span className="text-text-muted flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-primary" /> AI Sourcing
                      </span>
                      <span className="text-success truncate max-w-[120px]">{backendHealth.ai_engine || "Claude 3.5 Ready"}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-bg border border-border">
                      <span className="text-text-muted flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Policy Firewall
                      </span>
                      <span className="text-success font-semibold">5 Rules Bound</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowHealthMenu(false)}
                    className="w-full py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary text-xs font-semibold hover:bg-primary/20 transition-all cursor-pointer"
                  >
                    Close Diagnostics
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Mode Switcher & Reasoning Drawer */}
        <div className="flex items-center gap-3">
          {/* Secret Reasoning Button */}
          <button
            onClick={toggleReasoningPanel}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-hover border border-border text-xs font-mono text-primary hover:border-primary/40 transition-all cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>AI Reasoning</span>
          </button>

          {/* Feature 7 — Sliding Pill Mode Switcher */}
          <div 
            onClick={() => setDemoMode(!demoMode)}
            className="flex items-center bg-bg border border-border rounded-xl p-1 cursor-pointer select-none transition-all shadow-inner"
            title="Toggle between Live FastAPI Backend and Offline Sandbox Demo"
          >
            <div
              className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold transition-all duration-200 ${
                !demoMode
                  ? 'bg-primary text-text-primary shadow-glow-primary'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              LIVE FASTAPI
            </div>
            <div
              className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold transition-all duration-200 ${
                demoMode
                  ? 'bg-warning text-bg shadow-glow-warning'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              DEMO MOCK
            </div>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-border"></div>

          {/* User Profile */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-success flex items-center justify-center text-text-primary font-bold text-xs shadow-md">
              RK
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-medium text-text-primary">Ravi Kumar</div>
              <div className="text-[10px] text-text-muted font-mono">VP Sourcing</div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default TopNavbar;
