import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  HelpCircle, 
  Sliders, 
  ArrowRight, 
  Cpu, 
  Terminal, 
  Sparkles,
  Zap,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { SecondaryButton } from '../components/common/SecondaryButton';
import { useProcurement } from '../context/ProcurementContext';
import { WorkflowProgress } from '../components/common/WorkflowProgress';

export function ConstraintAnalysis() {
  const navigate = useNavigate();
  const { 
    currentRequest, 
    liveConstraints,
    relaxationDeliveryDays, 
    setRelaxationDeliveryDays, 
    simulateDeliveryRelaxation,
    relaxationResults,
    toggleReasoningPanel,
    setActiveStep
  } = useProcurement();

  // Dynamic calculations based on relaxation slider
  const getSimulatedMetrics = (days) => {
    if (relaxationResults && relaxationResults.delivery_days === days) {
      return {
        vendors: relaxationResults.compliant_vendors_count,
        compliance: 100,
        flexibilityScore: relaxationResults.flexibility_score,
        note: relaxationResults.sla_assessment
      };
    }
    if (days < 5) return { vendors: 2, compliance: 65, flexibilityScore: 42, note: "⚠️ Strict SLA — Limited supplier availability" };
    if (days <= 7) return { vendors: 5, compliance: 100, flexibilityScore: 84, note: "✅ Optimal SLA — Target vendor network engaged" };
    if (days <= 10) return { vendors: 8, compliance: 100, flexibilityScore: 92, note: "🎉 Extended SLA — 3 additional bulk suppliers compliant" };
    return { vendors: 12, compliance: 100, flexibilityScore: 98, note: "🚀 Maximum SLA — Sourcing global logistics options" };
  };

  const currentSim = getSimulatedMetrics(relaxationDeliveryDays);

  const handleSliderChange = (newDays) => {
    setRelaxationDeliveryDays(newDays);
    simulateDeliveryRelaxation(newDays);
  };

  const handleNext = () => {
    setActiveStep(3);
    navigate('/vendor-comparison');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <WorkflowProgress currentStep={2} />
      <PageHeader
        title="Constraint Intelligence Engine"
        subtitle="Autonomous parsing of natural-language buying intent into Hard Constraints, Soft Preferences, and Ambiguity Resolutions."
        badge="STEP 2 OF 6 • Constraint Reasoning"
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
              Vendor Discovery & Matrix
            </PrimaryButton>
          </div>
        }
      />

      {/* Feature 2: Original Buying Intent Quote Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-surface via-surface to-bg border border-primary/30 shadow-glow-primary relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-primary/15 border border-primary/30 text-primary shrink-0">
            <Cpu className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
                Parsed Natural-Language Intent
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-primary/10 text-primary font-bold">
                100% Parsed
              </span>
            </div>
            <p className="text-base md:text-lg font-medium text-text-primary font-mono leading-relaxed">
              "{currentRequest.originalPrompt}"
            </p>
            <div className="text-xs text-text-muted pt-1 font-mono">
              Requisition: <span className="text-text-primary font-bold">{currentRequest.title}</span> • Target Budget: <span className="text-success font-bold">₹{(currentRequest.totalBudget).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Constraint Intelligence Section Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Hard Constraints */}
        <div className="p-6 rounded-2xl bg-surface border border-success/30 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <h3 className="text-base font-bold font-mono text-text-primary">Hard Constraints</h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-success/20 text-success border border-success/30">
              MANDATORY (100%)
            </span>
          </div>

          <p className="text-xs text-text-muted leading-relaxed">
            Strict non-negotiable filters. Non-compliant vendors are eliminated in Stage 1.
          </p>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="p-3 rounded-xl bg-bg border border-border flex items-center justify-between">
              <span className="text-text-secondary">Budget per Unit</span>
              <span className="text-success font-semibold">≤ ₹{(currentRequest.unitBudget).toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-xl bg-bg border border-border flex items-center justify-between">
              <span className="text-text-secondary">Quantity</span>
              <span className="text-success font-semibold">{currentRequest.quantity} Units</span>
            </div>
            <div className="p-3 rounded-xl bg-bg border border-border flex items-center justify-between">
              <span className="text-text-secondary">RAM Specification</span>
              <span className="text-success font-semibold">≥ 16GB DDR5</span>
            </div>
            <div className="p-3 rounded-xl bg-bg border border-border flex items-center justify-between">
              <span className="text-text-secondary">Max Delivery SLA</span>
              <span className="text-success font-semibold">≤ {relaxationDeliveryDays} Days</span>
            </div>
          </div>
        </div>

        {/* Card 2: Soft Preferences */}
        <div className="p-6 rounded-2xl bg-surface border border-primary/30 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <h3 className="text-base font-bold font-mono text-text-primary">Soft Preferences</h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-primary/20 text-primary border border-primary/30">
              OPTIMIZATION
            </span>
          </div>

          <p className="text-xs text-text-muted leading-relaxed">
            Scored in Stage 2 Multi-Objective Optimization to rank surviving vendors.
          </p>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="p-3 rounded-xl bg-bg border border-border flex items-center justify-between">
              <span className="text-text-secondary">Brand Preference</span>
              <span className="text-primary font-medium">Dell / Lenovo Enterprise</span>
            </div>
            <div className="p-3 rounded-xl bg-bg border border-border flex items-center justify-between">
              <span className="text-text-secondary">Warranty SLA</span>
              <span className="text-primary font-medium">≥ 2 Yrs Onsite</span>
            </div>
            <div className="p-3 rounded-xl bg-bg border border-border flex items-center justify-between">
              <span className="text-text-secondary">Seller Score</span>
              <span className="text-primary font-medium">≥ 85% Reliability</span>
            </div>
          </div>
        </div>

        {/* Card 3: Ambiguity Resolution (Amber Warning Style) */}
        <div className="p-6 rounded-2xl bg-surface border border-warning/40 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warning"></div>
              <h3 className="text-base font-bold font-mono text-text-primary">Ambiguity Resolution</h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-warning/20 text-warning border border-warning/30">
              POLICY DEFAULTS
            </span>
          </div>

          <p className="text-xs text-text-muted leading-relaxed">
            Unstated specifications identified & automatically resolved via policy.
          </p>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="p-3 rounded-xl bg-bg border border-warning/30 space-y-1">
              <div className="text-warning font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Operating System
              </div>
              <div className="text-[11px] text-text-secondary">
                OS not specified — defaulted to corporate Windows 11 Pro policy.
              </div>
            </div>
            <div className="p-3 rounded-xl bg-bg border border-border space-y-1">
              <div className="text-text-primary font-semibold">Accessories SKU</div>
              <div className="text-[11px] text-text-muted">
                Chargers/sleeves included in standard enterprise OEM bundle.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature 4 Highlight — Interactive Constraint Relaxation Simulator */}
      <div className="p-6 md:p-8 rounded-2xl bg-surface border border-border space-y-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2 text-primary font-mono text-xs font-bold mb-1">
              <Sliders className="w-4 h-4" />
              <span>FEATURE 4 — Constraint Relaxation Simulator</span>
            </div>
            <h3 className="text-xl font-bold font-mono text-text-primary">Simulate Sourcing Flexibility</h3>
            <p className="text-xs text-text-muted">
              Slide parameters below to visualize how relaxing constraints expands the compliant vendor network.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-bg border border-border font-mono text-right text-xs">
              <span className="text-text-muted block text-[10px]">Compliant Vendors</span>
              <span className="text-lg font-bold text-success">{currentSim.vendors} Vendors</span>
            </div>
            <div className="p-3 rounded-xl bg-bg border border-border font-mono text-right text-xs">
              <span className="text-text-muted block text-[10px]">Flexibility Score</span>
              <span className="text-lg font-bold text-primary">{currentSim.flexibilityScore}/100</span>
            </div>
          </div>
        </div>

        {/* Primary Control Slider: Delivery Days */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-text-secondary font-semibold text-sm">Delivery SLA Constraint</span>
            <span className="text-primary font-bold text-base px-3 py-1 rounded-lg bg-primary/10 border border-primary/20">
              {relaxationDeliveryDays} Business Days
            </span>
          </div>

          <input
            type="range"
            min={4}
            max={14}
            step={1}
            value={relaxationDeliveryDays}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            className="w-full accent-primary bg-bg h-2 rounded-lg cursor-pointer"
          />

          <div className="flex justify-between items-center font-mono text-xs pt-1">
            <span className="text-text-muted">Strict (4 Days)</span>
            <span className="text-primary font-semibold">{currentSim.note}</span>
            <span className="text-text-muted">Relaxed (14 Days)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConstraintAnalysis;
