import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  ShieldAlert, 
  ShieldX, 
  ArrowRight, 
  Lock, 
  Bot, 
  UserCheck, 
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { PolicyCard } from '../components/firewall/PolicyCard';
import { useProcurement } from '../context/ProcurementContext';
import { WorkflowProgress } from '../components/common/WorkflowProgress';

export function AuthorizationFirewall() {
  const navigate = useNavigate();
  const { livePolicyChecks, mockPolicies, liveDecision, currentRequest, setActiveStep } = useProcurement();
  const [selectedOutcome, setSelectedOutcome] = useState('ESCALATE');
  const [evalProgress, setEvalProgress] = useState(0);

  const activeAuthStatus = liveDecision?.authorization_status || 'ESCALATE';

  useEffect(() => {
    setSelectedOutcome(activeAuthStatus);
    const timer = setInterval(() => {
      setEvalProgress((prev) => (prev < 4 ? prev + 1 : 4));
    }, 450);
    return () => clearInterval(timer);
  }, [activeAuthStatus]);

  const totalAmount = currentRequest?.totalBudget || 420000;
  const unitPrice = currentRequest?.unitBudget || 42000;

  const liveChecks = [
    { label: "Category Sourcing Rule (POL-004)", value: "IT Hardware Whitelisted", status: evalProgress >= 1 },
    { label: "Per-Unit Budget Cap (POL-003)", value: `₹${unitPrice.toLocaleString()} ≤ ₹50,000 Cap`, status: evalProgress >= 2 },
    { label: "Vendor Reliability Rule (POL-002)", value: "94% ≥ 85% Min Safety", status: evalProgress >= 3 },
    { 
      label: "3-Tier Purchase Authorization Cap (POL-001)", 
      value: totalAmount <= 200000 
        ? `₹${totalAmount.toLocaleString()} ≤ ₹2,00,000 (Auto-Approved)` 
        : totalAmount <= 500000 
        ? `₹${totalAmount.toLocaleString()} > ₹2,00,000 Limit (VP Sign-off Required)` 
        : `₹${totalAmount.toLocaleString()} > ₹5,00,000 (Blocked by Policy)`, 
      status: evalProgress >= 4, 
      isEscalation: totalAmount > 200000 && totalAmount <= 500000,
      isBlock: totalAmount > 500000
    }
  ];

  const handleNext = () => {
    setActiveStep(5);
    navigate('/human-approval');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <WorkflowProgress currentStep={4} />
      <PageHeader
        title="Authorization Firewall Policy Engine"
        subtitle="Feature 9 — Bounded Autonomy Framework. Every decision flows through live policy rules before purchase authorization is permitted."
        badge="STEP 4 OF 6 • Governance & Firewall"
        action={
          <PrimaryButton
            size="md"
            icon={ArrowRight}
            onClick={handleNext}
          >
            Open Decision Packet for Approval
          </PrimaryButton>
        }
      />

      {/* Feature 9 — Central Live Policy Evaluation Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-surface border border-border shadow-card space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-bold">
            <Lock className="w-3.5 h-3.5" />
            <span>FEATURE 9 — Live Policy Evaluation Sequence</span>
          </div>
          <h3 className="text-xl font-bold font-mono text-text-primary">Policy Enforcement Gate</h3>
        </div>

        {/* Live Evaluated Rules List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {liveChecks.map((check, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: check.status ? 1 : 0.4, y: 0 }}
              className={`p-4 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                check.status
                  ? check.isEscalation
                    ? 'bg-warning/15 border-warning/40 text-warning font-semibold'
                    : 'bg-success/15 border-success/40 text-success'
                  : 'bg-bg border-border text-text-muted'
              }`}
            >
              <div>
                <span className="text-[10px] block opacity-80">{check.label}</span>
                <span className="font-bold text-text-primary text-xs">{check.value}</span>
              </div>
              <div className="shrink-0">
                {check.status ? (
                  check.isEscalation ? (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-warning text-black font-extrabold">
                      ESCALATED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-success text-bg font-extrabold">
                      PASSED ✓
                    </span>
                  )
                ) : (
                  <span className="text-[10px] text-text-muted animate-pulse">Evaluating...</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* 3 Outcome Classification Selector */}
        <div className="pt-4 border-t border-border/60 space-y-3">
          <div className="text-xs font-mono text-text-muted text-center">
            Firewall Outcome Classifications:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Outcome 1: ALLOW */}
            <div
              onClick={() => setSelectedOutcome('ALLOW')}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                selectedOutcome === 'ALLOW'
                  ? 'bg-success/15 border-success text-success shadow-glow-success'
                  : 'bg-bg border-border text-text-secondary hover:border-success/40'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span className="font-mono font-bold text-sm">ALLOW (Green)</span>
              </div>
              <p className="text-[11px] opacity-80">
                Auto-executes purchase order immediately when all policy checks pass.
              </p>
            </div>

            {/* Outcome 2: ESCALATE */}
            <div
              onClick={() => setSelectedOutcome('ESCALATE')}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                selectedOutcome === 'ESCALATE'
                  ? 'bg-warning/15 border-warning text-warning shadow-glow-warning'
                  : 'bg-bg border-border text-text-secondary hover:border-warning/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  <span className="font-mono font-bold text-sm">ESCALATE (Amber)</span>
                </div>
                <span className="px-1.5 py-0.5 text-[9px] font-mono bg-warning text-black font-bold rounded">
                  ACTIVE
                </span>
              </div>
              <p className="text-[11px] opacity-80">
                Requires human executive Decision Packet review & sign-off.
              </p>
            </div>

            {/* Outcome 3: BLOCK */}
            <div
              onClick={() => setSelectedOutcome('BLOCK')}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                selectedOutcome === 'BLOCK'
                  ? 'bg-danger/15 border-danger text-danger shadow-glow-danger'
                  : 'bg-bg border-border text-text-secondary hover:border-danger/40'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <ShieldX className="w-4 h-4 text-danger" />
                <span className="font-mono font-bold text-sm">BLOCK (Red)</span>
              </div>
              <p className="text-[11px] opacity-80">
                Immediately blocks execution due to policy violation or unacceptably high risk.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enterprise Policy Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-mono text-text-primary">Active Enterprise Policy Rules</h3>
          <span className="text-xs font-mono text-text-muted">5 Rules Evaluated</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {mockPolicies.map((policy) => (
            <PolicyCard key={policy.id} policy={policy} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AuthorizationFirewall;
