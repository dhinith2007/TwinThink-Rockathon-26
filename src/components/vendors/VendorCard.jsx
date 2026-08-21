import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Truck, Award, AlertTriangle, ChevronDown, CheckCircle2, XCircle } from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';
import { AnimatedCounter } from '../common/AnimatedCounter';

export function VendorCard({ vendor }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const riskColorMap = {
    'Low': 'text-success',
    'Very Low': 'text-success',
    'Medium': 'text-warning',
    'High': 'text-danger',
    'Critical': 'text-danger',
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
      className={`rounded-2xl bg-surface border transition-all duration-200 overflow-hidden ${
        vendor.isRecommended
          ? 'border-primary/60 shadow-glow-primary'
          : 'border-border hover:border-border-glow'
      }`}
    >
      {/* Recommended top stripe */}
      {vendor.isRecommended && (
        <div className="h-0.5 bg-gradient-to-r from-primary via-success to-primary" />
      )}

      {/* Header */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-text-primary tracking-tight font-mono">{vendor.name}</h3>
            {vendor.isRecommended && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary text-white shadow-glow-primary">
                ⭐ BEST OUTCOME
              </span>
            )}
            {!vendor.isRecommended && vendor.overallRisk === 'High' && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-danger/20 text-danger border border-danger/30">
                REJECTED
              </span>
            )}
          </div>
          <p className="text-xs text-text-secondary">{vendor.sellerRating}</p>

          {/* AI Confidence bar for recommended vendor */}
          {vendor.isRecommended && (
            <div className="pt-2 space-y-1">
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-text-muted">AI Decision Confidence</span>
                <span className="text-primary font-bold">94%</span>
              </div>
              <div className="w-40 h-1.5 rounded-full bg-bg overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-success"
                  initial={{ width: 0 }}
                  animate={{ width: '94%' }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-start gap-3 sm:text-right shrink-0">
          <div>
            <div className="text-xl font-bold font-mono text-text-primary">
              {vendor.totalPriceDisplay}
            </div>
            <div className="text-xs text-text-muted">{vendor.unitPriceDisplay} / unit</div>
          </div>
          <RiskBadge risk={vendor.overallRisk} score={vendor.riskScoreNum} />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-5 pb-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-bg border border-border">
          <Truck className="w-4 h-4 text-primary shrink-0" />
          <div>
            <div className="text-[10px] text-text-muted font-mono">Delivery</div>
            <div className="text-xs font-semibold font-mono text-text-primary">{vendor.deliveryDisplay}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-bg border border-border">
          <ShieldCheck className="w-4 h-4 text-success shrink-0" />
          <div>
            <div className="text-[10px] text-text-muted font-mono">Reliability</div>
            <div className={`text-xs font-bold font-mono ${vendor.reliabilityScore >= 85 ? 'text-success' : 'text-danger'}`}>
              <AnimatedCounter value={vendor.reliabilityScore} suffix="%" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-bg border border-border">
          <Award className="w-4 h-4 text-warning shrink-0" />
          <div>
            <div className="text-[10px] text-text-muted font-mono">Warranty</div>
            <div className="text-xs font-semibold text-text-primary truncate">{vendor.warranty}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-bg border border-border">
          <AlertTriangle className="w-4 h-4 text-text-secondary shrink-0" />
          <div>
            <div className="text-[10px] text-text-muted font-mono">Stock</div>
            <div className="text-xs font-semibold font-mono text-text-primary">{vendor.stockAvailable} Units</div>
          </div>
        </div>
      </div>

      {/* Expand / Collapse Footer */}
      <div className="px-5 py-3 border-t border-border/40 flex items-center justify-between">
        <div className="text-xs font-mono">
          {vendor.isRecommended ? (
            <span className="text-success flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Multi-Objective Optimisation
            </span>
          ) : vendor.overallRisk === 'High' ? (
            <span className="text-danger flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" /> Eliminated by Risk Engine
            </span>
          ) : (
            <span className="text-text-muted">Compliant — ranked lower</span>
          )}
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-mono font-medium text-primary hover:text-primary-hover flex items-center gap-1 transition-colors cursor-pointer"
        >
          {isExpanded ? 'Hide Details' : 'Inspect Risk Matrix'}
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Expandable Risk & Spec Breakdown */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-5 border-t border-border bg-bg/70 space-y-5">
              {/* Normalized Specs */}
              <div>
                <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted mb-2">
                  Normalized Hardware Specs (Post Data-Normalization Engine)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-mono text-xs">
                  {Object.entries(vendor.normalizedSpecs).map(([key, val]) => (
                    <div key={key} className="p-2 rounded-lg bg-surface border border-border">
                      <span className="text-text-muted text-[10px] block uppercase">{key}</span>
                      <span className="text-text-primary font-medium text-[11px]">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5 Risk Dimensions */}
              <div>
                <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted mb-2">
                  5-Dimension Risk Decomposition
                </h4>
                <div className="space-y-2">
                  {Object.entries(vendor.riskBreakdown).map(([dim, data]) => (
                    <div key={dim} className="flex items-start gap-3 p-2.5 rounded-lg bg-surface border border-border text-xs font-mono">
                      <div className="w-20 shrink-0 text-text-muted text-[10px] pt-0.5 capitalize">
                        {dim.replace('Risk', ' Risk').trim()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`font-bold ${riskColorMap[data.level] || 'text-text-primary'}`}>
                          {data.level}
                        </span>
                        <span className="text-text-muted ml-2">({data.score}/100)</span>
                        <p className="text-[10px] text-text-muted mt-0.5 leading-relaxed">{data.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Selected / Why Rejected */}
              {vendor.whySelected && (
                <div>
                  <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-success mb-2">
                    Why Selected — Decision Rationale
                  </h4>
                  <ul className="space-y-1.5">
                    {vendor.whySelected.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-text-secondary font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {vendor.whyNotRejected && (
                <div>
                  <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-danger mb-2">
                    "Why Not?" Engine — Rejection Trace
                  </h4>
                  <div className="space-y-1.5">
                    {vendor.whyNotRejected.map((r, i) => (
                      <div key={i} className="p-2 rounded-lg bg-surface border border-border text-[11px] font-mono text-text-secondary">
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default VendorCard;
