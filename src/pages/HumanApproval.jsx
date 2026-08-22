import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  ShieldAlert, 
  ArrowRight, 
  Sparkles, 
  Check, 
  Loader2, 
  FileCheck,
  Building2,
  Calendar,
  DollarSign,
  ShieldCheck,
  Lock,
  Layers,
  Award,
  Hash,
  Copy,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { SecondaryButton } from '../components/common/SecondaryButton';
import { RiskBadge } from '../components/common/RiskBadge';
import { WorkflowProgress } from '../components/common/WorkflowProgress';
import { ProcurementIntelligenceCard } from '../components/analytics/ProcurementIntelligenceCard';
import { useProcurement } from '../context/ProcurementContext';

export function HumanApproval() {
  const navigate = useNavigate();
  const { 
    demoSessionId, 
    currentRequest, 
    poStatus, 
    issuePurchaseOrder, 
    generatedPoNumber,
    livePurchaseOrder,
    setActiveStep 
  } = useProcurement();

  const [decisionAction, setDecisionAction] = useState(poStatus === 'issued' ? 'approved' : null);
  const [isIssuing, setIsIssuing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [showCelebration, setShowCelebration] = useState(poStatus === 'issued');

  const handleApprove = async () => {
    setDecisionAction('approved');
    setIsIssuing(true);
    await issuePurchaseOrder("Ravi Kumar (VP Engineering)");
    setIsIssuing(false);
    setShowCelebration(true);
    setToastMessage(`Purchase Order #${generatedPoNumber} Issued & Dispatched to CompSource Enterprise Ltd.`);
  };

  const handleAction = (type) => {
    setDecisionAction(type);
    if (type === 'rejected') {
      setToastMessage('❌ Requisition rejected. Notification sent to requester with reasoning.');
    } else if (type === 'modified') {
      setToastMessage('✏️ Modification requested. Parameters returned to Constraint Engine.');
    }
  };

  const handleNext = () => {
    setActiveStep(6);
    navigate('/audit-timeline');
  };

  const copyHash = (text) => {
    navigator.clipboard?.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <WorkflowProgress currentStep={5} />
      <PageHeader
        title="Executive Oversight — Decision Packet"
        subtitle="Feature 10 — Human Approval as an Executive Decision Packet with clear trade-offs, confidence decomposition, and purchase order authorization."
        badge="STEP 5 OF 6 • Executive Action"
        action={
          <SecondaryButton
            icon={ArrowRight}
            onClick={handleNext}
          >
            Inspect Cryptographic Audit Ledger
          </SecondaryButton>
        }
      />

      {/* Feature 8 — Purchase Order Celebration Card (when approved) */}
      <AnimatePresence>
        {(showCelebration || poStatus === 'issued') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-success/20 via-surface to-success/15 border-2 border-success shadow-glow-success relative overflow-hidden"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-success/20 border-2 border-success flex items-center justify-center text-success shrink-0 shadow-lg">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-success text-bg">
                      ORDER ISSUED & DISPATCHED
                    </span>
                    <span className="text-xs font-mono text-success font-semibold">
                      SHA-256 Ledger Chained
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold font-mono text-text-primary tracking-tight">
                    Purchase Order #{generatedPoNumber}
                  </h2>
                  <p className="text-xs text-text-secondary font-mono">
                    Authorized for <strong className="text-text-primary">CompSource Enterprise Ltd.</strong> • Total: <strong className="text-success font-bold">₹4,20,000</strong> (10 Units @ ₹42,000)
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl bg-success text-bg font-mono font-bold text-xs hover:bg-success/90 transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Inspect Audit Ledger</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick PO Details Strip */}
            <div className="mt-5 pt-4 border-t border-success/30 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-bg/70 border border-success/30">
                <span className="text-[10px] text-text-muted block">DELIVERY TERMS</span>
                <span className="text-text-primary font-bold">5 Business Days Onsite</span>
              </div>
              <div className="p-2.5 rounded-lg bg-bg/70 border border-success/30">
                <span className="text-[10px] text-text-muted block">PAYMENT TERMS</span>
                <span className="text-text-primary font-bold">Net 30 Days</span>
              </div>
              <div className="p-2.5 rounded-lg bg-bg/70 border border-success/30">
                <span className="text-[10px] text-text-muted block">DISPATCH METHOD</span>
                <span className="text-text-primary font-bold">Structured PO API Payload</span>
              </div>
              <div className="p-2.5 rounded-lg bg-bg/70 border border-success/30">
                <span className="text-[10px] text-text-muted block">AUTHORIZED BY</span>
                <span className="text-success font-bold">Ravi Kumar (VP Sourcing)</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feature 2 — Executive Decision Summary Header Card */}
      <div className="rounded-2xl bg-surface border border-warning/40 shadow-glow-warning overflow-hidden">
        {/* Header Alert Strip */}
        <div className="p-4 bg-warning/15 border-b border-warning/30 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2 text-warning font-bold">
            <ShieldAlert className="w-4 h-4" />
            <span>EXECUTIVE DECISION PACKET — Session ID: {demoSessionId}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-warning/20 text-warning border border-warning/30 font-bold text-[10px]">
              VP APPROVAL REQUIRED
            </span>
            <span className="text-text-muted">Requisition #REQ-2026-8942</span>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {/* Top Key Attributes Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-bg border border-border font-mono text-xs">
            <div className="space-y-1">
              <span className="text-[10px] text-text-muted uppercase tracking-wider block">RECOMMENDED VENDOR</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-text-primary text-sm truncate">CompSource Enterprise</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-primary text-white shrink-0">
                  AI Pick
                </span>
              </div>
              <span className="text-[11px] text-text-secondary">Vendor Code: VEND-001</span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-text-muted uppercase tracking-wider block">QUANTITY & VALUE</span>
              <div className="font-bold text-text-primary text-sm">
                10 Units • <span className="text-success font-extrabold">₹4,20,000</span>
              </div>
              <span className="text-[11px] text-success font-semibold">Saved ₹30,000 under budget</span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-text-muted uppercase tracking-wider block">DELIVERY & RISK</span>
              <div className="font-bold text-text-primary text-sm">
                5 Days SLA • <span className="text-success">Low (14/100)</span>
              </div>
              <span className="text-[11px] text-text-secondary">3-Yr ProSupport Onsite</span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-text-muted uppercase tracking-wider block">APPROVAL ROUTE</span>
              <div className="font-bold text-warning text-sm flex items-center gap-1">
                <UserCheck className="w-4 h-4" /> VP Approval
              </div>
              <span className="text-[11px] text-text-muted">POL-001 Triggered (&gt; ₹2.00L)</span>
            </div>
          </div>

          {/* Variance & Escalation Rationale Box */}
          <div className="p-4 rounded-xl bg-bg border border-warning/30 space-y-1.5 font-mono text-xs">
            <div className="text-warning font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> Why Exception Occurred:
            </div>
            <p className="text-text-secondary leading-relaxed">
              Total order amount (<strong className="text-text-primary">₹4,20,000</strong>) exceeds single-level auto-approval limit (<strong className="text-text-primary">₹2,00,000</strong>). Policy POL-001 requires VP level sign-off before purchase order issuance.
            </p>
          </div>

          {/* Agent Recommendation Highlight */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-primary/15 via-surface to-bg border border-primary/40 space-y-2">
            <div className="flex items-center gap-2 text-primary font-mono text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>ProcuraAI Autonomous Recommendation</span>
            </div>
            <p className="text-sm font-semibold text-text-primary font-mono leading-relaxed">
              "RECOMMEND APPROVAL: Sourced top-rated CompSource Enterprise Ltd. with ₹30,000 savings under budget, 5-day delivery SLA, and upgraded 3-Year Onsite ProSupport warranty with 0 policy breaches."
            </p>
          </div>

          {/* Feature 2 — Sourced Trade-Off Comparison Summary */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase text-text-muted tracking-wider">
                Supplier Trade-Off Summary & Decision Rationales
              </h3>
              <span className="text-[10px] font-mono text-text-muted">3 Suppliers Evaluated</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              {/* Option 1: CompSource */}
              <div className="p-4 rounded-xl bg-primary/10 border-2 border-primary/60 space-y-2 relative shadow-glow-primary">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-primary text-sm">CompSource Enterprise</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-success text-bg">
                    RECOMMENDED
                  </span>
                </div>
                <div className="text-text-primary font-bold text-sm">₹4.20L Total (₹42k/unit)</div>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  <strong className="text-success">Why:</strong> Best reliability (94%), ₹30k budget savings, upgraded 3-Yr Onsite ProSupport, 5-day SLA.
                </p>
              </div>

              {/* Option 2: TechnoWorld */}
              <div className="p-4 rounded-xl bg-bg border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-primary text-sm">TechnoWorld Wholesale</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-border text-text-secondary">
                    ALTERNATIVE
                  </span>
                </div>
                <div className="text-text-primary font-bold text-sm">₹4.40L Total (₹44k/unit)</div>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  <strong className="text-primary">Why:</strong> Faster delivery (4 days vs 5 days), but costs ₹20,000 more with standard 2-Yr OEM warranty.
                </p>
              </div>

              {/* Option 3: QuickShip Direct */}
              <div className="p-4 rounded-xl bg-bg border border-danger/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-primary text-sm">QuickShip Direct</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-danger/20 text-danger">
                    REJECTED
                  </span>
                </div>
                <div className="text-text-primary font-bold text-sm">₹3.90L Total (₹39k/unit)</div>
                <p className="text-[11px] text-danger leading-relaxed">
                  <strong className="text-danger">Why:</strong> Lowest upfront tag, but failed reliability policy (63% vs 85% min) with 67/100 high return risk.
                </p>
              </div>
            </div>
          </div>

          {/* Milestone 6 — Autonomous Supplier Negotiation & Confirmation Dialogue */}
          <div className="p-5 rounded-2xl bg-bg border border-primary/30 space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="font-bold text-text-primary text-xs uppercase tracking-wider">
                  Autonomous Supplier Negotiation &amp; Confirmation Transcript
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-success/20 text-success border border-success/30">
                TERMS BINDING &amp; CONFIRMED
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Message 1: Vendor */}
              <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1">
                <div className="flex justify-between items-center text-[10px] text-text-muted">
                  <span className="font-bold text-text-primary flex items-center gap-1">
                    🏢 CompSource Enterprise Ltd. (Sales Desk)
                  </span>
                  <span>10:14:02 AM</span>
                </div>
                <p className="text-text-secondary text-[11px] leading-relaxed">
                  "Initial quote received for 10 × Dell Latitude 5440 laptops. We can commit to 5 business days delivery at ₹42,000/unit (Total: ₹4,20,000)."
                </p>
              </div>

              {/* Message 2: ProcuraAI */}
              <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/40 space-y-1 ml-4">
                <div className="flex justify-between items-center text-[10px] text-primary">
                  <span className="font-bold flex items-center gap-1">
                    🤖 ProcuraAI (Autonomous Procurement Agent)
                  </span>
                  <span>10:14:03 AM</span>
                </div>
                <p className="text-text-primary text-[11px] leading-relaxed">
                  "Our corporate procurement policy POL-005 permits immediate issuance if you can confirm 3 Years Onsite ProSupport with zero-penalty DOA replacement and lock the price at ₹42,000/unit with Net 30 payment terms."
                </p>
              </div>

              {/* Message 3: Vendor Confirmation */}
              <div className="p-3.5 rounded-xl bg-surface border border-success/40 space-y-1">
                <div className="flex justify-between items-center text-[10px] text-success">
                  <span className="font-bold flex items-center gap-1">
                    🏢 CompSource Enterprise Ltd. (Commercial Officer)
                  </span>
                  <span>10:14:05 AM</span>
                </div>
                <p className="text-text-secondary text-[11px] leading-relaxed">
                  "Confirmed. We have locked ₹42,000/unit with 3 Years Onsite ProSupport and Net 30 payment terms. Quote valid for 30 days. Ready for official PO issuance."
                </p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-success/10 border border-success/30 flex items-center justify-between text-[11px] text-success font-semibold">
              <span>Negotiation Outcome: Locked ₹30,000 savings under budget cap + 3-Yr Onsite ProSupport upgrade.</span>
              <span className="text-[10px] bg-success text-bg px-2 py-0.5 rounded font-bold">100% SLA LOCK</span>
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-mono text-text-muted">
              {decisionAction === 'approved' ? (
                <span className="text-success font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Order Authorized & PO #{generatedPoNumber} Issued
                </span>
              ) : (
                'Select executive action to authorize:'
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Reject */}
              <button
                onClick={() => handleAction('rejected')}
                disabled={isIssuing || decisionAction === 'approved'}
                className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-danger/15 border border-danger/30 text-danger font-mono font-bold text-xs hover:bg-danger/25 transition-colors inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>

              {/* Modify */}
              <button
                onClick={() => handleAction('modified')}
                disabled={isIssuing || decisionAction === 'approved'}
                className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-warning/15 border border-warning/30 text-warning font-mono font-bold text-xs hover:bg-warning/25 transition-colors inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Edit3 className="w-4 h-4" />
                Modify
              </button>

              {/* Feature 10 & 8 — Approve & Issue PO Button with Spinner */}
              <button
                onClick={handleApprove}
                disabled={isIssuing || decisionAction === 'approved'}
                className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-success text-bg font-mono font-extrabold text-sm hover:bg-success/90 transition-colors shadow-glow-success inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isIssuing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Issuing & Dispatched...</span>
                  </>
                ) : decisionAction === 'approved' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>PO Authorized & Dispatched!</span>
                  </>
                ) : (
                  <>
                    <FileCheck className="w-5 h-5" />
                    <span>Approve & Issue Purchase Order</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Flagship Feature 1 — Embedded Procurement Intelligence Card */}
      <ProcurementIntelligenceCard score={93.5} vendorName="CompSource Enterprise Ltd." />

      {/* Action Notification Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-surface border border-success/40 text-text-primary font-mono text-xs flex items-center justify-between gap-4 shadow-card"
          >
            <span>{toastMessage}</span>
            <button
              onClick={handleNext}
              className="px-3 py-1.5 rounded bg-success text-bg text-[11px] font-extrabold shrink-0 cursor-pointer"
            >
              Inspect Cryptographic Audit Ledger →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HumanApproval;
