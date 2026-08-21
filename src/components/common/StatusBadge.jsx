import React from 'react';

export function StatusBadge({ status, className = '' }) {
  const getBadgeStyle = (statusText) => {
    const text = (statusText || '').toLowerCase();
    if (text.includes('approved') || text.includes('allow') || text.includes('passed') || text.includes('completed')) {
      return 'bg-success/15 text-success border-success/30';
    }
    if (text.includes('escalat') || text.includes('pending') || text.includes('review') || text.includes('action')) {
      return 'bg-warning/15 text-warning border-warning/30';
    }
    if (text.includes('block') || text.includes('reject') || text.includes('forbidden') || text.includes('high risk')) {
      return 'bg-danger/15 text-danger border-danger/30';
    }
    if (text.includes('active') || text.includes('analys') || text.includes('recommend')) {
      return 'bg-primary/15 text-primary border-primary/30';
    }
    return 'bg-border/40 text-text-secondary border-border';
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${getBadgeStyle(status)} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 animate-pulse"></span>
      {status}
    </span>
  );
}

export default StatusBadge;
