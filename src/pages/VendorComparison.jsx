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
  ChevronDown,
  Layers,
  TrendingDown,
  Scale,
  Package,
  Building2,
  Tag
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
  const { liveVendors, mockVendors, procurementResult, toggleReasoningPanel, setActiveStep } = useProcurement();

  const vendorsList = liveVendors && liveVendors.length > 0 ? liveVendors : mockVendors;
  
  const funnel = procurementResult?.ai_funnel || {
    total_products_considered: 120,
    total_vendors_considered: 25,
    matching_offers_discovered: 14,
    compliant_suppliers_count: 4,
    recommended_vendor_name: vendorsList.find(v => v.isRecommended)?.name || "CompSource",
    recommended_score: 93.5,
    source_a_count: 8,
    source_b_count: 6,
    funnel_text: "AI considered 120 Products → 25 Vendors → 14 Matching Offers → 4 Compliant Suppliers → 1 Recommended Vendor (93.5 Score)"
  };

  const handleNext = () => {
    setActiveStep(4);
    navigate('/authorization-firewall');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <WorkflowProgress currentStep={3} />
      <PageHeader
        title="Multi-Vendor Comparison Matrix"
        subtitle="Feature 4 — Deterministic Multi-Objective Scoring across price, delivery SLA, seller reliability, and risk with transparent 'Why-Not?' rejection intelligence."
        badge="STEP 3 OF 6 • Discovery & Scoring"
        action={
          <div className="flex items-center gap-3">
            <SecondaryButton
              icon={Terminal}
              onClick={toggleReasoningPanel}
            >
              AI Reasoning Narrative
            </SecondaryButton>
            <PrimaryButton
              size="md"
              icon={ArrowRight}
              onClick={handleNext}
            >
              Inspect Authorization Firewall
            </PrimaryButton>
          </div>
        }
      />

      {/* AI Procurement Intelligence Funnel & Storytelling Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-surface via-surface-hover to-surface border border-primary/40 shadow-glow-primary space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border/80 text-xs font-mono gap-2">
          <span className="text-primary font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> AI SOURCING INTELLIGENCE FUNNEL
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-primary/15 border border-primary/30 text-primary text-[11px] font-bold">
            ⚡ Discovered from 2 Procurement Sources ({funnel.source_a_count || 8} Enterprise Direct Tier-1, {funnel.source_b_count || 6} B2B Marketplace)
          </span>
        </div>

        {/* Storytelling Funnel Summary Bar */}
        <div className="p-3 rounded-xl bg-bg/80 border border-primary/25 text-center font-mono text-xs text-text-primary">
          <span className="text-text-muted">Procurement Reasoning Pipeline: </span>
          <span className="font-bold text-primary">{funnel.total_products_considered || 120} Products</span>
          <span className="text-text-muted"> → </span>
          <span className="font-bold text-primary">{funnel.total_vendors_considered || 25} Vendors</span>
          <span className="text-text-muted"> → </span>
          <span className="font-bold text-warning">{funnel.matching_offers_discovered || 14} Matching Offers</span>
          <span className="text-text-muted"> → </span>
          <span className="font-bold text-success">{funnel.compliant_suppliers_count || 4} Compliant Suppliers</span>
          <span className="text-text-muted"> → </span>
          <span className="font-extrabold text-success">1 Recommended Vendor ({funnel.recommended_score || 93.5} Score)</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center font-mono">
          {/* Funnel Step 1 */}
          <div className="p-3 rounded-xl bg-bg border border-border">
            <span className="text-text-muted text-[10px] uppercase font-bold block">1. PRODUCTS INDEXED</span>
            <span className="text-2xl font-extrabold text-text-primary">
              <AnimatedCounter value={funnel.total_products_considered || 120} />
            </span>
            <span className="text-[10px] text-text-secondary block mt-0.5">8 Categories</span>
          </div>

          {/* Funnel Step 2 */}
          <div className="p-3 rounded-xl bg-bg border border-border">
            <span className="text-text-muted text-[10px] uppercase font-bold block">2. VENDORS SCANNED</span>
            <span className="text-2xl font-extrabold text-text-primary">
              <AnimatedCounter value={funnel.total_vendors_considered || 25} />
            </span>
            <span className="text-[10px] text-text-secondary block mt-0.5">2 Sources Active</span>
          </div>

          {/* Funnel Step 3 */}
          <div className="p-3 rounded-xl bg-bg border border-warning/40">
            <span className="text-warning text-[10px] uppercase font-bold block">3. MATCHING OFFERS</span>
            <span className="text-2xl font-extrabold text-warning">
              <AnimatedCounter value={funnel.matching_offers_discovered || 14} />
            </span>
            <span className="text-[10px] text-warning/80 block mt-0.5">Dual-source pool</span>
          </div>

          {/* Funnel Step 4 */}
          <div className="p-3 rounded-xl bg-bg border border-primary/40">
            <span className="text-primary text-[10px] uppercase font-bold block">4. COMPLIANT SUPPLIERS</span>
            <span className="text-2xl font-extrabold text-primary">
              <AnimatedCounter value={funnel.compliant_suppliers_count || 4} />
            </span>
            <span className="text-[10px] text-primary/80 block mt-0.5">Passed SLA &amp; Specs</span>
          </div>

          {/* Funnel Step 5 */}
          <div className="p-3 rounded-xl bg-bg border-2 border-success shadow-glow-success col-span-2 md:col-span-1">
            <span className="text-success text-[10px] uppercase font-bold block">5. RECOMMENDED</span>
            <span className="text-base md:text-lg font-extrabold text-success truncate block">
              {funnel.recommended_vendor_name || "Top Supplier"}
            </span>
            <span className="text-[10px] text-success block mt-0.5 font-bold">{funnel.recommended_score || 93.5} / 100 Score</span>
          </div>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="rounded-2xl bg-surface border border-border overflow-hidden shadow-card">
        <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-lg font-bold font-mono text-text-primary">Multi-Source Vendor Scoring Matrix</h3>
              <p className="text-xs text-text-muted">Normalized hardware specifications and real-time reliability ratings</p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-text-muted">Model:</span>
            <span className="px-2.5 py-1 rounded-lg bg-bg border border-border text-primary font-semibold">
              Risk-Adjusted Optimization
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-bg/80 text-text-muted uppercase text-[11px] border-b border-border">
              <tr>
                <th className="px-5 py-4">Vendor Name</th>
                <th className="px-5 py-4">Source Channel</th>
                <th className="px-5 py-4">Unit Price</th>
                <th className="px-5 py-4">Total Cost</th>
                <th className="px-5 py-4">Delivery SLA</th>
                <th className="px-5 py-4">Reliability</th>
                <th className="px-5 py-4">Risk Level</th>
                <th className="px-5 py-4 text-right">Composite Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {vendorsList.map((vendor, index) => (
                <tr 
                  key={vendor.id || index}
                  className={`transition-colors ${
                    vendor.isRecommended 
                      ? 'bg-primary/5 hover:bg-primary/10' 
                      : 'hover:bg-surface-hover'
                  }`}
                >
                  <td className="px-5 py-4">
                    <div className="font-bold text-text-primary flex items-center gap-2">
                      {vendor.name}
                      {vendor.isRecommended && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-primary/20 text-primary border border-primary/40 font-extrabold">
                          RANK #1
                        </span>
                      )}
                      {!vendor.isRecommended && vendor.overallRisk === 'High' && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-danger/20 text-danger border border-danger/30 font-extrabold">
                          DISQUALIFIED
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-text-muted">{vendor.warranty || "Standard 2-Yr Warranty"}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      (vendor.source_channel || '').includes('Enterprise Direct')
                        ? 'bg-primary/10 text-primary border-primary/25'
                        : 'bg-warning/10 text-warning border-warning/25'
                    }`}>
                      {(vendor.source_channel || '').includes('Enterprise Direct') ? 'Source A: Direct OEM' : 'Source B: B2B Marketplace'}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold text-text-primary">{vendor.unitPriceDisplay}</td>
                  <td className="px-5 py-4 font-bold text-text-primary">{vendor.totalPriceDisplay}</td>
                  <td className="px-5 py-4">{vendor.deliveryDisplay}</td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-success">{vendor.reliabilityScore}%</span>
                  </td>
                  <td className="px-5 py-4">
                    <RiskBadge risk={vendor.overallRisk} score={vendor.riskScoreNum} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex items-center gap-1 font-bold text-sm">
                      {vendor.isRecommended ? (
                        <span className="text-primary font-extrabold">93.5 / 100</span>
                      ) : (
                        <span className="text-text-muted">{(93.5 - index * 6.2).toFixed(1)} / 100</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature 4 — Detailed Vendor Cards with "Why-Not" Explainability Engine */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold font-mono text-text-primary tracking-tight">Detailed Supplier Evaluations &amp; Why-Not? Reasoning</h3>
            <p className="text-xs text-text-muted">Decomposed 5-dimension risk breakdowns and automated rejection explanations</p>
          </div>
          <span className="text-xs font-mono text-text-muted">{vendorsList.length} Vendors Evaluated</span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {vendorsList.map((vendor, index) => (
            <VendorCard key={vendor.id || index} vendor={vendor} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default VendorComparison;
