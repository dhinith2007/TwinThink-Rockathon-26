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
  FileCheck
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { SecondaryButton } from '../components/common/SecondaryButton';
import { RiskBadge } from '../components/common/RiskBadge';
import { WorkflowProgress } from '../components/common/WorkflowProgress';
import { useProcurement } from '../context/ProcurementContext';

export function HumanApproval() {
  const navigate = useNavigate();
  const { 
    demoSessionId, 
    currentRequest, 
    poStatus, 
    issuePurchaseOrder, 
    generatedPoNumber,
    setActiveStep 
  } = useProcurement();

  const [decisionAction, setDecisionAction] = useState(null); // 'approved', 'rejected', 'modified'
  const [isIssuing, setIsIssuing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const handleApprove = async () => {
    setDecisionAction('approved');
    setIsIssuing(true);
    await issuePurchaseOrder("Ravi Kumar (VP Engineering)");
    setIsIssuing(false);
    setToastMessage(`🎉 Purchase Order #${generatedPoNumber} Issued & Dispatched to CompSource Enterprise.`);
  };

  const handleAction = (type) => {
    setDecisionAction(type);
    if (type === 'rejected') {
      setToastMessage('❌ Requisition rejected. Notification sent to requester.');
    } else if (type === 'modified') {
      setToastMessage('✏️ Modification requested. Parameters returned to Constraint Engine.');
    }
  };

  const handleNext = () => {
    setActiveStep(6);
    navigate('/audit-timeline');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <WorkflowProgress currentStep={5} />
      <PageHeader
        title="Human Oversight — Decision Packet"
        subtitle="Feature 10 — Human Approval as a Decision Packet. Meaningful human oversight with risk, variance, and trade-off evidence."
        badge="STEP 5 OF 6 • Executive Action"
        action={
          <SecondaryButton
            icon={ArrowRight}
            onClick={handleNext}
          >
            Inspect Audit Ledger
          </SecondaryButton>
        }
      />

      {/* Decision Packet Card */}
      <div className="rounded-2xl bg-surface border border-warning/40 shadow-glow-warning overflow-hidden">
        {/* Header Alert Strip */}
        <div className="p-4 bg-warning/15 border-b border-warning/30 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2 text-warning font-bold">
            <ShieldAlert className="w-4 h-4" />
            <span>EXECUTIVE DECISION PACKET — Session ID: {demoSessionId}</span>
          </div>
          <span className="text-text-muted">Requisition #REQ-2026-8942</span>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {/* Request & Requester Info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
            <div>
              <span className="text-xs font-mono text-text-muted">REQUISITION ITEM</span>
              <h2 className="text-2xl font-bold font-mono text-text-primary tracking-tight">
                {currentRequest.title}
              </h2>
              <div className="text-xs text-text-secondary mt-1">
                Requested by: <span className="text-text-primary font-medium">Ravi Kumar</span> (Product Engineering)
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-2xl font-bold font-mono text-success">
                  ₹4,20,000 Total
                </div>
                <div className="text-xs text-text-muted font-mono">
                  Saved ₹30,000 under target budget
                </div>
              </div>
              <RiskBadge risk="Low Risk" score={14} />
            </div>
          </div>

          {/* Variance & Escalation Rationale Box */}
          <div className="p-4 rounded-xl bg-bg border border-warning/30 space-y-1.5 font-mono text-xs">
            <div className="text-warning font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> Why Exception Occurred:
            </div>
            <p className="text-text-secondary leading-relaxed">
              Total order amount (₹4,20,000) exceeds single-level auto-approval limit (₹2,00,000). Policy POL-001 requires VP level sign-off.
            </p>
          </div>

          {/* Agent Recommendation Highlight */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-primary/15 via-surface to-bg border border-primary/40 space-y-2">
            <div className="flex items-center gap-2 text-primary font-mono text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>ProcuraAI Autonomous Recommendation</span>
            </div>
            <p className="text-sm font-semibold text-text-primary font-mono leading-relaxed">
              "APPROVE. Sourced top-rated Vendor A (CompSource Enterprise) with ₹30,000 savings under budget, 5-day delivery SLA, and upgraded 3-Year Onsite ProSupport."
            </p>
          </div>

          {/* Alternatives Evaluated Matrix */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase text-text-muted">Sourced Alternatives Matrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-bg text-text-muted uppercase text-[10px] border-b border-border">
                  <tr>
                    <th className="p-3">Option / Vendor</th>
                    <th className="p-3">Total Cost</th>
                    <th className="p-3">Delivery SLA</th>
                    <th className="p-3">Risk Profile</th>
                    <th className="p-3 text-right">Optimization Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr className="bg-primary/10 font-bold">
                    <td className="p-3 text-text-primary">Vendor A (CompSource Enterprise)</td>
                    <td className="p-3 text-text-primary">₹4.20L</td>
                    <td className="p-3 text-text-secondary">5 Days</td>
                    <td className="p-3 text-success">Low (14/100)</td>
                    <td className="p-3 text-right text-success">⭐ Selected Choice</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-text-primary">Vendor B (QuickShip Direct)</td>
                    <td className="p-3 text-text-primary">₹3.90L</td>
                    <td className="p-3 text-text-secondary">7 Days</td>
                    <td className="p-3 text-danger">High (67/100)</td>
                    <td className="p-3 text-right text-danger">Rejected (Score 63%)</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-text-primary">Vendor C (TechnoWorld Wholesale)</td>
                    <td className="p-3 text-text-primary">₹4.40L</td>
                    <td className="p-3 text-text-secondary">4 Days</td>
                    <td className="p-3 text-text-secondary">Low (22/100)</td>
                    <td className="p-3 text-right text-text-muted">Alternative (+₹20k)</td>
                  </tr>
                </tbody>
              </table>
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
                disabled={isIssuing}
                className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-danger/15 border border-danger/30 text-danger font-mono font-bold text-xs hover:bg-danger/25 transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>

              {/* Modify */}
              <button
                onClick={() => handleAction('modified')}
                disabled={isIssuing}
                className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-warning/15 border border-warning/30 text-warning font-mono font-bold text-xs hover:bg-warning/25 transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                Modify
              </button>

              {/* Feature 10 — Approve & Issue PO Button with Spinner */}
              <button
                onClick={handleApprove}
                disabled={isIssuing || decisionAction === 'approved'}
                className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-success text-bg font-mono font-extrabold text-sm hover:bg-success/90 transition-colors shadow-glow-success inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isIssuing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Issuing PO...</span>
                  </>
                ) : decisionAction === 'approved' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>PO Issued!</span>
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
              View Audit Ledger →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HumanApproval;
