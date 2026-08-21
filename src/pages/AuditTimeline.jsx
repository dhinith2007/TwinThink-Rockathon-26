import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  History, 
  ShieldCheck, 
  ArrowLeft,
  Download,
  Terminal,
  FileCheck
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { SecondaryButton } from '../components/common/SecondaryButton';
import { WorkflowProgress } from '../components/common/WorkflowProgress';
import { TimelineItem } from '../components/timeline/TimelineItem';
import { useProcurement } from '../context/ProcurementContext';

export function AuditTimeline() {
  const navigate = useNavigate();
  const { demoSessionId, liveAuditEvents, mockAuditTrail, generatedPoNumber, setActiveStep } = useProcurement();

  const auditEventsList = liveAuditEvents && liveAuditEvents.length > 0 ? liveAuditEvents : mockAuditTrail;

  const handleReturn = () => {
    setActiveStep(1);
    navigate('/');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <WorkflowProgress currentStep={6} />
      <PageHeader
        title="Explainable Procurement Ledger"
        subtitle="Feature 11 — Dynamic Audit Timeline. Tamper-evident audit trail using SHA-256 hash chaining documenting every search, constraint extraction, vendor rejection, firewall check, and human approval."
        badge="STEP 6 OF 6 • Audit & Ledger"
        action={
          <SecondaryButton
            icon={Download}
            onClick={() => alert(`Audit Ledger #${demoSessionId} Exported as Cryptographically Signed Audit Package.`)}
          >
            Export Signed Audit Package
          </SecondaryButton>
        }
      />

      {/* Top Ledger Summary Card */}
      <div className="p-6 rounded-2xl bg-surface border border-border shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/15 border border-success/30 flex items-center justify-center text-success">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold font-mono text-text-primary">Procurement Order #{generatedPoNumber}</h3>
              <p className="text-xs text-text-muted">10 × Dell Enterprise Laptops • CompSource Enterprise • Session: <span className="text-primary font-mono font-bold">{demoSessionId}</span></p>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-bg border border-border">
              <span className="text-text-muted block text-[10px]">TOTAL SOURCING TIME</span>
              <span className="text-success font-bold">3m 58s Total</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-bg border border-border">
              <span className="text-text-muted block text-[10px]">LEDGER INTEGRITY</span>
              <span className="text-primary font-bold">Cryptographically Signed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vertical Timeline Container */}
      <div className="p-6 md:p-8 rounded-2xl bg-surface border border-border shadow-card space-y-2">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold font-mono text-text-primary">Chronological Execution Steps</h3>
          </div>
          <span className="text-xs font-mono text-text-muted">7 Verified Audit Events</span>
        </div>

        <div className="relative">
          {auditEventsList.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.12 }}
            >
              <TimelineItem
                item={item}
                isLast={idx === auditEventsList.length - 1}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Navigation Return CTA */}
      <div className="flex justify-between items-center pt-4">
        <SecondaryButton
          icon={ArrowLeft}
          onClick={handleReturn}
        >
          Return to Executive Dashboard
        </SecondaryButton>
      </div>
    </div>
  );
}

export default AuditTimeline;
