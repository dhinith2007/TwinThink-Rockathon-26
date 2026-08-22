import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  ShieldAlert, 
  ShieldX, 
  ArrowRight, 
  Lock, 
  Bot, 
  UserCheck, 
  AlertTriangle,
  CheckCircle2,
  Check,
  ChevronDown,
  Layers,
  Sparkles,
  Scale
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

  // Cinematic 250ms interval sequential evaluation
  useEffect(() => {
    setSelectedOutcome(activeAuthStatus);
    setEvalProgress(0);
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      setEvalProgress(step);
      if (step >= 5) {
        clearInterval(interval);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [activeAuthStatus]);

  const totalAmount = currentRequest?.totalBudget || 420000;
  const unitPrice = currentRequest?.unitBudget || 42000;

  const liveChecks = [
    { 
      code: "POL-004",
      label: "Category Sourcing Rule", 
      rule: "IT Hardware / Laptops Whitelist", 
      result: "Passed (IT Hardware Whitelisted)", 
      status: evalProgress >= 1,
      isEscalation: false
    },
    { 
      code: "POL-003",
      label: "Per-Unit Budget Ceiling Cap", 
      rule: "Per-Unit Cost ≤ ₹50,000 max limit", 
      result: `Passed (₹${unitPrice.toLocaleString()} ≤ ₹50,000)`, 
      status: evalProgress >= 2,
      isEscalation: false
    },
    { 
      code: "POL-002",
      label: "Vendor Reliability & Safety Rule", 
      rule: "Seller Reliability Rating ≥ 85%", 
      result: "Passed (94% ≥ 85% Threshold)", 
      status: evalProgress >= 3,
      isEscalation: false
    },
    { 
      code: "POL-005",
      label: "Autonomous Counter-Offer Guardrail", 
      rule: "Variance ≤ 8% allows auto-counter", 
      result: "Passed (6.6% Variance within 8% limit)", 
      status: evalProgress >= 4,
      isEscalation: false
    },
    { 
      code: "POL-001",
      label: "Tiered Purchase Authorization Threshold", 
      rule: "Orders > ₹2,00,000 require VP Executive Sign-off", 
      result: `₹${totalAmount.toLocaleString()} > ₹2,00,000 → ESCALATE TO VP APPROVAL`, 
      status: evalProgress >= 5, 
      isEscalation: true
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
        subtitle="Feature 9 — Bounded Autonomy Framework. Deterministic policy rules evaluate every dimension of the purchase order before authorization is granted."
        badge="STEP 4 OF 6 • Governance & Firewall"
        action={
          <PrimaryButton
            size="md"
            icon={ArrowRight}
            onClick={handleNext}
          >
            Open Executive Decision Packet
          </PrimaryButton>
        }
      />

      {/* Feature 5 — Central Live Policy Evaluation Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-surface border border-warning/40 shadow-glow-warning space-y-6 relative overflow-hidden">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-mono font-bold">
            <Lock className="w-3.5 h-3.5" />
            <span>CINEMATIC POLICY EVALUATION SEQUENCE (250ms Stagger)</span>
          </div>
          <h3 className="text-2xl font-bold font-mono text-text-primary">
            Autonomous Policy Gate
          </h3>
          <p className="text-xs text-text-muted font-mono">
            Guarantees bounded autonomy — the AI can never execute out-of-policy purchases without explicit human sign-off.
          </p>
        </div>

        {/* Live Evaluated Rules List */}
        <div className="space-y-3 font-mono text-xs">
          {liveChecks.map((check, idx) => (
            <motion.div
              key={check.code}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: check.status ? 1 : 0.35, x: check.status ? 0 : -5 }}
              transition={{ duration: 0.25 }}
              className={`p-4 rounded-xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                check.status
                  ? check.isEscalation
                    ? 'bg-warning/15 border-2 border-warning shadow-glow-warning text-warning font-semibold'
                    : 'bg-success/15 border border-success/40 text-success'
                  : 'bg-bg border-border text-text-muted'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.2 rounded bg-bg/80 border border-border text-[10px] text-text-primary font-bold">
                    {check.code}
                  </span>
                  <span className="text-text-primary font-bold text-xs">{check.label}</span>
                </div>
                <div className="text-[11px] text-text-secondary opacity-90">{check.rule}</div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-bold font-mono">
                  {check.status ? check.result : "Evaluating Rule..."}
                </span>
                {check.status ? (
                  check.isEscalation ? (
                    <span className="px-2.5 py-1 rounded-lg text-xs bg-warning text-bg font-extrabold shadow-sm animate-pulse">
                      ESCALATED ⚠️
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg text-xs bg-success text-bg font-extrabold shadow-sm">
                      PASSED ✓
                    </span>
                  )
                ) : (
                  <span className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* 3 Outcome Classification Selector */}
        <div className="pt-5 border-t border-border/80 space-y-3">
          <div className="text-xs font-mono text-text-muted text-center">
            Firewall Outcome Verdict:
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
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedOutcome === 'ESCALATE'
                  ? 'bg-warning/20 border-warning text-warning shadow-glow-warning ring-1 ring-warning'
                  : 'bg-bg border-border text-text-secondary hover:border-warning/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  <span className="font-mono font-bold text-sm">ESCALATE (Amber)</span>
                </div>
                <span className="px-2 py-0.5 text-[9px] font-mono bg-warning text-black font-extrabold rounded">
                  TRIGGERED
                </span>
              </div>
              <p className="text-[11px] opacity-90">
                Requires human executive Decision Packet review &amp; VP sign-off (&gt; ₹2.00L).
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
          <h3 className="text-lg font-bold font-mono text-text-primary">Enterprise Governance Rulebook</h3>
          <span className="text-xs font-mono text-text-muted">5 Active Governance Policies</span>
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
