import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Bot, Zap, ArrowRight, Laptop, Monitor, Armchair, Keyboard } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { SecondaryButton } from '../components/common/SecondaryButton';
import { LoadingModal } from '../components/modal/LoadingModal';
import { WorkflowProgress } from '../components/common/WorkflowProgress';
import { useProcurement } from '../context/ProcurementContext';

export function NewRequest() {
  const navigate = useNavigate();
  const { runAnalysis, updateRequestFromInput, setActiveStep } = useProcurement();
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    naturalPrompt: "Buy 10 laptops under ₹45,000 each with 16GB RAM and delivery within 7 days.",
    itemName: "10 × Dell Latitude 5440 Laptops",
    quantity: 10,
    unitBudget: 45000,
    totalBudget: 450000,
    deliveryDeadlineDays: 7,
    priority: "High",
    additionalRequirements: "Minimum 512GB NVMe SSD required. Prefer Dell or Lenovo enterprise series with onsite warranty."
  });

  const handleChange = (field, val) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: val };
      if (field === 'quantity' || field === 'unitBudget') {
        const qty = parseFloat(updated.quantity) || 0;
        const unit = parseFloat(updated.unitBudget) || 0;
        updated.totalBudget = qty * unit;
      }
      return updated;
    });
  };

  const handlePreFill = (presetType) => {
    if (presetType === 'laptops') {
      setFormData({
        naturalPrompt: "Buy 10 laptops under ₹45,000 each with 16GB RAM and delivery within 7 days.",
        itemName: "10 × Dell Latitude 5440 Laptops",
        quantity: 10,
        unitBudget: 45000,
        totalBudget: 450000,
        deliveryDeadlineDays: 7,
        priority: "High",
        additionalRequirements: "Minimum 512GB NVMe SSD required. Prefer Dell or Lenovo enterprise series with onsite warranty."
      });
    } else if (presetType === 'chairs') {
      setFormData({
        naturalPrompt: "Procure 8 ergonomic office chairs with lumbar support under ₹8,000 each with 5-day delivery.",
        itemName: "8 × ErgoPro Executive Mesh Chairs",
        quantity: 8,
        unitBudget: 8000,
        totalBudget: 64000,
        deliveryDeadlineDays: 5,
        priority: "Medium",
        additionalRequirements: "BIFMA Level 3 certified mesh back, 3D adjustable armrests, 3-year commercial warranty."
      });
    } else if (presetType === 'monitors') {
      setFormData({
        naturalPrompt: "Buy 8 27-inch 4K UHD color-calibrated displays under ₹28,000 each within 5 days for engineering team.",
        itemName: "8 × LG 27-inch 4K UHD Monitors",
        quantity: 8,
        unitBudget: 28000,
        totalBudget: 224000,
        deliveryDeadlineDays: 5,
        priority: "High",
        additionalRequirements: "USB-C Power Delivery (≥ 65W), 99% sRGB coverage, height-adjustable pivot stand."
      });
    } else if (presetType === 'servers') {
      setFormData({
        naturalPrompt: "Buy 2 enterprise 1U rack servers with 128GB ECC RAM under ₹3,00,000 each within 10 days.",
        itemName: "2 × Dell PowerEdge R660xs Rack Servers",
        quantity: 2,
        unitBudget: 300000,
        totalBudget: 600000,
        deliveryDeadlineDays: 10,
        priority: "High",
        additionalRequirements: "Dual Intel Xeon, 128GB DDR5 ECC RAM, RAID 1 NVMe Mirror + 4x SAS, 24x7 4hr Mission Critical Support."
      });
    } else if (presetType === 'stands') {
      setFormData({
        naturalPrompt: "Order 30 aluminum ergonomic laptop risers under ₹2,500 each within 3 days.",
        itemName: "30 × DeskPro Aluminum Laptop Stands",
        quantity: 30,
        unitBudget: 2500,
        totalBudget: 75000,
        deliveryDeadlineDays: 3,
        priority: "Low",
        additionalRequirements: "Aircraft-grade CNC aluminum, ventilated cooling cutouts, silicone non-slip pads."
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Execute live FastAPI analysis or demo mock in background while loading animation plays
    await runAnalysis(formData);
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setActiveStep(2);
    navigate('/constraint-analysis');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <WorkflowProgress currentStep={1} />
      <PageHeader
        title="New Procurement Request"
        subtitle="Express buying intent in plain English or structured parameters. ProcuraAI extracts hard/soft constraints autonomously."
        badge="STEP 1 OF 6 • Sourcing Intent"
      />

      {/* Preset Intent Quick Selector for Demo Mode */}
      <div className="p-5 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-card">
        <div className="flex items-center gap-2 text-xs font-mono text-text-secondary">
          <Zap className="w-4 h-4 text-warning" />
          <span>Demo Stage Shortcuts:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handlePreFill('laptops')}
            className="px-3 py-1.5 rounded-xl bg-primary/15 border border-primary/40 text-primary text-xs font-mono font-medium hover:bg-primary/25 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Laptop className="w-3.5 h-3.5" /> 10 Laptops (₹45k)
          </button>
          <button
            type="button"
            onClick={() => handlePreFill('chairs')}
            className="px-3 py-1.5 rounded-xl bg-bg border border-border text-text-secondary text-xs font-mono font-medium hover:text-text-primary transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Armchair className="w-3.5 h-3.5" /> 8 Chairs (₹8k)
          </button>
          <button
            type="button"
            onClick={() => handlePreFill('monitors')}
            className="px-3 py-1.5 rounded-xl bg-bg border border-border text-text-secondary text-xs font-mono font-medium hover:text-text-primary transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Monitor className="w-3.5 h-3.5" /> 8 Monitors (₹28k)
          </button>
          <button
            type="button"
            onClick={() => handlePreFill('servers')}
            className="px-3 py-1.5 rounded-xl bg-bg border border-border text-text-secondary text-xs font-mono font-medium hover:text-text-primary transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" /> 2 Rack Servers (₹3L)
          </button>
        </div>
      </div>

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-2xl bg-surface border border-border shadow-card space-y-6">
        {/* Natural Language Prompt Input */}
        <div className="space-y-2">
          <label className="flex items-center justify-between text-sm font-semibold font-mono text-text-primary">
            <span className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary" />
              <span>Natural-Language Buying Intent</span>
            </span>
            <span className="text-xs text-primary font-normal">AI Parsing Active</span>
          </label>
          <textarea
            rows={3}
            value={formData.naturalPrompt}
            onChange={(e) => handleChange('naturalPrompt', e.target.value)}
            placeholder="e.g. Need 15 decent laptops for interns. Budget under ₹45,000 each with 16GB RAM and delivery next week."
            className="w-full p-4 rounded-xl bg-bg border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors font-sans leading-relaxed"
          />
          <span className="text-[11px] text-text-muted font-mono block">
            💡 ProcuraAI Neural Engine will extract hard constraints vs soft preferences and resolve ambiguities.
          </span>
        </div>

        <div className="border-t border-border/60 pt-6">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted mb-4">
            Parsed Technical Parameters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Item Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-text-secondary">Item Name / Category</label>
              <input
                type="text"
                required
                value={formData.itemName}
                onChange={(e) => handleChange('itemName', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-bg border border-border text-sm text-text-primary focus:outline-none focus:border-primary font-mono"
              />
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-text-secondary">Request Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-bg border border-border text-sm text-text-primary focus:outline-none focus:border-primary font-mono"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
                <option value="Critical">Critical Emergency</option>
              </select>
            </div>

            {/* Quantity */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-text-secondary">Quantity Required</label>
              <input
                type="number"
                min={1}
                required
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-bg border border-border text-sm text-text-primary focus:outline-none focus:border-primary font-mono"
              />
            </div>

            {/* Budget per Unit */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-text-secondary">Budget per Unit (₹)</label>
              <input
                type="number"
                min={100}
                required
                value={formData.unitBudget}
                onChange={(e) => handleChange('unitBudget', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-bg border border-border text-sm text-text-primary focus:outline-none focus:border-primary font-mono"
              />
            </div>

            {/* Delivery Deadline */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-text-secondary">Max Delivery Window (Days)</label>
              <input
                type="number"
                min={1}
                max={60}
                required
                value={formData.deliveryDeadlineDays}
                onChange={(e) => handleChange('deliveryDeadlineDays', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-bg border border-border text-sm text-text-primary focus:outline-none focus:border-primary font-mono"
              />
            </div>

            {/* Total Budget Calculated */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-text-secondary">Calculated Total Budget</label>
              <div className="w-full px-4 py-2.5 rounded-xl bg-bg/60 border border-border text-sm text-success font-mono font-bold">
                ₹{(formData.totalBudget || 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Requirements */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-text-secondary">Additional Technical / Soft Requirements</label>
          <textarea
            rows={2}
            value={formData.additionalRequirements}
            onChange={(e) => handleChange('additionalRequirements', e.target.value)}
            className="w-full p-3 rounded-xl bg-bg border border-border text-xs text-text-primary focus:outline-none focus:border-primary"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
          <SecondaryButton onClick={() => navigate('/')}>
            Cancel
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            size="lg"
            icon={Sparkles}
          >
            Analyze with AI
          </PrimaryButton>
        </div>
      </form>

      {/* Feature 1 — Fullscreen Cinematic Loading Modal */}
      <LoadingModal
        isOpen={isLoading}
        onComplete={handleLoadingComplete}
      />
    </div>
  );
}

export default NewRequest;
