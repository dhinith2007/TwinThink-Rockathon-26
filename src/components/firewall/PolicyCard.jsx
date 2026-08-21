import React from 'react';
import { ShieldCheck, AlertCircle, AlertTriangle, Lock } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export function PolicyCard({ policy }) {
  const getIcon = () => {
    switch (policy.statusColor) {
      case 'success':
        return <ShieldCheck className="w-5 h-5 text-success shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning shrink-0" />;
      case 'danger':
        return <AlertCircle className="w-5 h-5 text-danger shrink-0" />;
      default:
        return <Lock className="w-5 h-5 text-primary shrink-0" />;
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-surface border border-border hover:border-border-glow transition-all duration-200">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-bg border border-border">
            {getIcon()}
          </div>
          <div>
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-text-muted">
              {policy.category} • {policy.id}
            </span>
            <h4 className="text-base font-semibold text-text-primary tracking-tight font-mono">{policy.title}</h4>
          </div>
        </div>
        <StatusBadge status={policy.status} />
      </div>

      <p className="text-xs text-text-secondary mb-3 leading-relaxed">{policy.rule}</p>

      <div className="p-3 rounded-xl bg-bg border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="font-mono text-text-muted">
          Rule Threshold: <span className="text-text-primary font-semibold">{policy.threshold}</span>
        </div>
        <div className="text-text-secondary font-mono text-[11px]">
          {policy.impact}
        </div>
      </div>
    </div>
  );
}

export default PolicyCard;
