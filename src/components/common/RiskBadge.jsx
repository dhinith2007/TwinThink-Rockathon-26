import React from 'react';

export function RiskBadge({ risk, score, className = '' }) {
  const getRiskStyle = (riskText) => {
    const text = (riskText || '').toLowerCase();
    if (text.includes('low') || text.includes('very low')) {
      return 'bg-success/15 text-success border-success/30';
    }
    if (text.includes('medium') || text.includes('moderate')) {
      return 'bg-warning/15 text-warning border-warning/30';
    }
    if (text.includes('high') || text.includes('critical')) {
      return 'bg-danger/15 text-danger border-danger/30';
    }
    return 'bg-border/40 text-text-secondary border-border';
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border ${getRiskStyle(risk)} ${className}`}>
      <span>Risk: {risk}</span>
      {score !== undefined && (
        <span className="px-1.5 py-0.2 rounded bg-black/20 text-[10px]">
          {score}/100
        </span>
      )}
    </span>
  );
}

export default RiskBadge;
