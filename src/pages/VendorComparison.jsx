import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  GitCompare, 
  ShieldCheck, 
  ArrowRight, 
  HelpCircle, 
  CheckCircle2, 
  XCircle,
  Sparkles,
  Terminal,
  Award,
  ChevronDown
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { SecondaryButton } from '../components/common/SecondaryButton';
import { RiskBadge } from '../components/common/RiskBadge';
import { VendorCard } from '../components/vendors/VendorCard';
import { AnimatedCounter } from '../components/common/AnimatedCounter';
import { useProcurement } from '../context/ProcurementContext';
import { WorkflowProgress } from '../components/common/WorkflowProgress';

export function VendorComparison() {
  const navigate = useNavigate();
  const { liveVendors, mockVendors, toggleReasoningPanel, setActiveStep } = useProcurement();

  const vendorsList = liveVendors && liveVendors.length > 0 ? liveVendors : mockVendors;

  const handleNext = () => {
    setActiveStep(4);
    navigate('/authorization-firewall');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <WorkflowProgress currentStep={3} />
      <PageHeader
        title="Multi-Vendor Comparison Matrix"
        subtitle="Multi-objective optimization scoring across price, delivery SLA, seller reliability, and risk. Feature: 'Why Not?' Rejection Engine."
        badge="STEP 3 OF 6 • Discovery & Scoring"
        action={
          <div className="flex items-center gap-3">
            <SecondaryButton
              icon={Terminal}
              onClick={toggleReasoningPanel}
            >
              AI Reasoning Panel
            </SecondaryButton>
            <PrimaryButton
              size="md"
              icon={ArrowRight}
              onClick={handleNext}
            >
              Authorization Firewall Policy
            </PrimaryButton>
          </div>
        }
      />

      {/* Feature 5 Banner — Animated Vendor Summary Statistics */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-surface via-surface-hover to-surface border border-primary/30 shadow-card">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-mono">
          <div className="p-3 rounded-xl bg-bg border border-border">
            <span className="text-text-muted text-[11px] block">VENDORS SCANNED</span>
            <span className="text-xl md:text-2xl font-bold text-text-primary">
              <AnimatedCounter value={12} /> Vendors
            </span>
          </div>
          <div className="p-3 rounded-xl bg-bg border border-border">
            <span className="text-text-muted text-[11px] block">ELIMINATED BY FILTERS</span>
            <span className="text-xl md:text-2xl font-bold text-danger">
              <AnimatedCounter value={7} /> Disqualified
            </span>
          </div>
          <div className="p-3 rounded-xl bg-bg border border-border">
            <span className="text-text-muted text-[11px] block">COMPARED & SCORED</span>
            <span className="text-xl md:text-2xl font-bold text-primary">
              <AnimatedCounter value={5} /> Compliant
            </span>
          </div>
          <div className="p-3 rounded-xl bg-bg border border-primary/40 shadow-glow-primary">
            <span className="text-primary text-[11px] font-bold block">RECOMMENDED CHOICE</span>
            <span className="text-lg font-bold text-success truncate block">Vendor A (CompSource)</span>
          </div>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="rounded-2xl bg-surface border border-border overflow-hidden shadow-card">
        <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold font-mono text-text-primary">Multi-Source Vendor Scoring Matrix</h3>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-text-muted">Algorithm:</span>
            <span className="px-2.5 py-1 rounded-lg bg-bg border border-border text-primary font-semibold">
              Risk-Adjusted Multi-Objective Optimization
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-bg/60 text-text-muted uppercase text-[11px] border-b border-border">
              <tr>
                <th className="px-5 py-4">Vendor Name</th>
                <th className="px-5 py-4">Unit Price</th>
                <th className="px-5 py-4">Total Cost</th>
                <th className="px-5 py-4">Delivery SLA</th>
                <th className="px-5 py-4">Reliability</th>
                <th className="px-5 py-4">Risk Profile</th>
                <th className="px-5 py-4 text-right">Optimization Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {vendorsList.map((vendor, idx) => (
                <motion.tr
                  key={vendor.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  className={`transition-colors ${
                    vendor.isRecommended
                      ? 'bg-primary/10 hover:bg-primary/15'
                      : 'hover:bg-surface-hover/80'
                  }`}
                >
                  <td className="px-5 py-4 font-bold text-text-primary">
                    <div className="flex items-center gap-2">
                      <span>{vendor.shortName}</span>
                      {vendor.isRecommended && (
                        <span className="px-2 py-0.5 text-[10px] bg-primary text-text-primary font-bold rounded">
                          RECOMMENDED
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-text-muted font-normal mt-0.5">{vendor.name}</div>
                  </td>
                  <td className="px-5 py-4 text-text-primary font-semibold">{vendor.unitPriceDisplay}</td>
                  <td className="px-5 py-4 text-text-primary font-bold">{vendor.totalPriceDisplay}</td>
                  <td className="px-5 py-4 text-text-primary">{vendor.deliveryDisplay}</td>
                  <td className="px-5 py-4">
                    <span className={vendor.reliabilityScore >= 85 ? 'text-success font-bold' : 'text-danger font-bold'}>
                      <AnimatedCounter value={vendor.reliabilityScore} suffix="%" />
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <RiskBadge risk={vendor.overallRisk} score={vendor.riskScoreNum} />
                  </td>
                  <td className="px-5 py-4 text-right font-bold">
                    {vendor.isRecommended ? (
                      <span className="text-success inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> SELECTED (94%)
                      </span>
                    ) : (
                      <span className="text-danger inline-flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> REJECTED
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature 7 Highlight — "Why Not?" Transparent Rejection Engine */}
      <div className="p-6 md:p-8 rounded-2xl bg-surface border border-primary/30 shadow-glow-primary space-y-6">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold uppercase text-primary tracking-wider">
              FEATURE 7 — Transparent Rejection Engine
            </div>
            <h3 className="text-xl font-bold font-mono text-text-primary">"Why Not?" Disqualification Reasoning</h3>
            <p className="text-xs text-text-muted">
              Most procurement bots only justify why they chose Vendor A. ProcuraAI explicitly explains why alternative vendors were rejected.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vendor B Rejection Box */}
          <div className="p-5 rounded-xl bg-bg border border-danger/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-sm text-text-primary">Vendor B (QuickShip Direct)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-danger/20 text-danger border border-danger/30">
                DISQUALIFIED
              </span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Cheapest upfront tag (₹39,000/unit), but rejected by Risk Engine:
            </p>
            <ul className="space-y-1.5 text-xs font-mono text-danger">
              <li className="flex items-start gap-1.5">
                <span>❌</span>
                <span>Seller reliability (63%) falls below minimum policy threshold (85%).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span>❌</span>
                <span>18% seller dispute rate creates unacceptably high return risk (67/100).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span>❌</span>
                <span>DOS / No OS installed — fails corporate software deployment policy.</span>
              </li>
            </ul>
          </div>

          {/* Vendor C Rejection Box */}
          <div className="p-5 rounded-xl bg-bg border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-sm text-text-primary">Vendor C (TechnoWorld Wholesale)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-border/40 text-text-secondary border border-border">
                RANKED #2
              </span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Fully compliant, but ranked second behind Vendor A:
            </p>
            <ul className="space-y-1.5 text-xs font-mono text-text-secondary">
              <li className="flex items-start gap-1.5">
                <span>ℹ️</span>
                <span>Priced ₹2,000/unit higher than Vendor A (₹20,000 variance total).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span>ℹ️</span>
                <span>Warranty is 2 years OEM vs Vendor A's upgraded 3-Year Onsite ProSupport.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Feature 6 & Feature 8 — Staggered Discovery Vendor Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold font-mono text-text-primary">Staggered Discovery Vendor Intelligence</h3>
        <div className="space-y-5">
          {vendorsList.map((vendor, idx) => (
            <motion.div
              key={vendor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.25 }}
            >
              <VendorCard vendor={vendor} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VendorComparison;
