import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Terminal, Activity, ShieldCheck, Database, Cpu, CheckCircle2, AlertTriangle, ChevronDown } from 'lucide-react';
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
  const { demoMode, setDemoMode, toggleReasoningPanel, backendHealth, isBackendConnected, checkHealth } = useProcurement();
  const [showHealthMenu, setShowHealthMenu] = useState(false);

  const currentRoute = routeStepMap[location.pathname] || { step: 0, title: 'ProcuraAI Engine' };

  return (
    <header className="h-16 bg-surface/95 backdrop-blur border-b border-border px-6 flex items-center justify-between sticky top-0 z-30">
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

      {/* Center: Interactive AI Engine Status Chip with Diagnostics Modal */}
      <div className="relative">
        <button
          onClick={() => {
            checkHealth();
            setShowHealthMenu(!showHealthMenu);
          }}
          className="hidden md:flex flex-col items-center justify-center px-4 py-1.5 rounded-xl bg-bg border border-border hover:border-primary/40 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isBackendConnected ? 'bg-success' : 'bg-warning'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                isBackendConnected ? 'bg-success' : 'bg-warning'
              }`}></span>
            </span>
            <span className="text-xs font-mono font-bold text-text-primary tracking-tight flex items-center gap-1">
              {isBackendConnected ? "Live AI Engine Active" : "Demo Simulation Engine"}
              <ChevronDown className="w-3 h-3 text-text-muted" />
            </span>
          </div>
          <span className="text-[10px] font-mono text-text-muted">
            {isBackendConnected ? "FastAPI ✓ Database ✓ Policy ✓" : "Offline Sandbox Mode"}
          </span>
        </button>

        {/* Diagnostic Popover */}
        {showHealthMenu && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-72 p-4 rounded-2xl bg-surface border border-primary/40 shadow-glow-primary z-50 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-border">
              <span className="font-bold text-text-primary uppercase tracking-wider text-[11px]">ProcuraAI Engine Status</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isBackendConnected ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
              }`}>
                {backendHealth.status?.toUpperCase()}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-text-muted flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-primary" /> FastAPI Gateway
                </span>
                <span className="text-success font-semibold">{backendHealth.api}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-primary" /> Database ({backendHealth.database_type})
                </span>
                <span className={backendHealth.database === 'connected' ? 'text-success' : 'text-danger'}>
                  {backendHealth.database}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-primary" /> AI Constraint Engine
                </span>
                <span className="text-success truncate max-w-[110px]">{backendHealth.ai_engine}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Policy Firewall
                </span>
                <span className="text-success">5 Active Rules</span>
              </div>
            </div>

            <button
              onClick={() => setShowHealthMenu(false)}
              className="mt-3 w-full py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary text-[11px] font-semibold hover:bg-primary/20 transition-all cursor-pointer"
            >
              Close Diagnostics
            </button>
          </div>
        )}
      </div>

      {/* Right: Mode Switcher & Secret Reasoning Drawer Toggle */}
      <div className="flex items-center gap-3">
        {/* Secret Reasoning Button */}
        <button
          onClick={toggleReasoningPanel}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-hover border border-border text-xs font-mono text-primary hover:border-primary/40 transition-all cursor-pointer"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>AI Reasoning</span>
        </button>

        {/* Demo Mode / Live Mode Interactive Toggle */}
        <button
          onClick={() => setDemoMode(!demoMode)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
            demoMode
              ? 'bg-warning/15 border-warning/40 text-warning hover:bg-warning/20'
              : 'bg-primary/15 border-primary/40 text-primary shadow-glow-primary hover:bg-primary/20'
          }`}
          title="Click to toggle between Live FastAPI Execution and Offline Demo Mode"
        >
          <span className="text-text-secondary text-[11px]">Mode:</span>
          <span className={`px-1.5 py-0.5 rounded font-extrabold text-[10px] ${
            demoMode ? 'bg-warning text-bg' : 'bg-primary text-white'
          }`}>
            {demoMode ? 'DEMO MOCK' : 'LIVE FASTAPI'}
          </span>
        </button>

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
  );
}

export default TopNavbar;
