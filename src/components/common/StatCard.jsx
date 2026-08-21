import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from './AnimatedCounter';

export function StatCard({ title, value, change, changeType = 'positive', icon: Icon, description }) {
  const getChangeBadge = () => {
    if (!change) return null;
    const isPositive = changeType === 'positive';
    return (
      <span className={`inline-flex items-center text-xs font-mono px-2 py-0.5 rounded-full font-medium ${
        isPositive ? 'bg-success/15 text-success border border-success/30' : 'bg-danger/15 text-danger border border-danger/30'
      }`}>
        {isPositive ? '↑' : '↓'} {change}
      </span>
    );
  };

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.45)' }}
      className="p-5 rounded-2xl bg-surface border border-border transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-text-secondary text-sm font-medium">{title}</span>
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-2xl md:text-3xl font-bold font-mono text-text-primary tracking-tight">
          <AnimatedCounter value={value} />
        </h3>
        {getChangeBadge()}
      </div>

      {description && (
        <p className="text-xs text-text-muted mt-2 truncate">{description}</p>
      )}
    </motion.div>
  );
}

export default StatCard;
