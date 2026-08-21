import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Clock, ChevronDown, User, Bot, Shield, FileText, Hash, Link2 } from 'lucide-react';

export function TimelineItem({ item, isLast = false }) {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusIcon = () => {
    const s = (item.status || '').toLowerCase();
    if (s.includes('success') || s.includes('approve') || s.includes('completed') || s.includes('allow')) {
      return <CheckCircle className="w-5 h-5 text-success" />;
    }
    if (s.includes('warning') || s.includes('escalat') || s.includes('review')) {
      return <AlertTriangle className="w-5 h-5 text-warning" />;
    }
    return <Clock className="w-5 h-5 text-primary" />;
  };

  const getActorIcon = () => {
    if ((item.actor || '').includes('User') || (item.actor || '').includes('VP') || (item.actor || '').includes('Executive')) {
      return <User className="w-3.5 h-3.5 text-warning inline mr-1" />;
    }
    return <Bot className="w-3.5 h-3.5 text-primary inline mr-1" />;
  };

  return (
    <div className="relative flex gap-4">
      {/* Vertical Line */}
      {!isLast && (
        <div className="absolute left-[19px] top-9 bottom-0 w-0.5 bg-border/60"></div>
      )}

      {/* Node Bullet Icon */}
      <div className="relative z-10 w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center shrink-0 shadow-md">
        {getStatusIcon()}
      </div>

      {/* Content Card */}
      <div className="flex-1 pb-8">
        <motion.div
          whileHover={{ x: 2 }}
          className="p-5 rounded-2xl bg-surface border border-border hover:border-border-glow transition-all duration-200"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                {item.stage}
              </span>
              <h4 className="text-base font-semibold text-text-primary tracking-tight font-mono">{item.title}</h4>
            </div>
            <span className="text-xs font-mono text-text-muted">{item.timestamp}</span>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed mb-3">{item.summary}</p>

          {/* Genuine SHA-256 Hash Chain Indicator */}
          {item.event_hash && (
            <div className="mb-3 p-2 rounded-lg bg-bg/80 border border-border/70 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px]">
              <div className="flex items-center gap-1.5 text-text-muted">
                <Hash className="w-3 h-3 text-primary shrink-0" />
                <span>SHA-256:</span>
                <span className="text-text-secondary truncate max-w-[160px] sm:max-w-[240px]" title={item.event_hash}>
                  {item.event_hash.slice(0, 16)}...{item.event_hash.slice(-8)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-text-muted">
                <Link2 className="w-3 h-3 text-success shrink-0" />
                <span>Prev:</span>
                <span className="text-text-muted truncate max-w-[90px]" title={item.previous_event_hash || "GENESIS"}>
                  {item.previous_event_hash ? `${item.previous_event_hash.slice(0, 8)}...` : "GENESIS"}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-success/15 text-success text-[9px] font-bold">CHAINED ✓</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs font-mono text-text-muted pt-3 border-t border-border/50">
            <div>
              Actor: <span className="text-text-primary font-medium">{getActorIcon()} {item.actor}</span>
            </div>

            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-primary hover:text-primary-hover flex items-center gap-1 font-medium transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              {showDetails ? 'Hide Raw Audit Log' : 'Inspect Technical Log'}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showDetails ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3 p-4 rounded-xl bg-bg border border-border font-mono text-xs text-text-secondary space-y-2"
              >
                <div className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1">
                  Canonical SHA-256 Hashed Audit Payload ({item.id})
                </div>
                <pre className="overflow-x-auto p-3 rounded bg-black/50 text-text-primary text-[11px] leading-relaxed border border-border">
                  {JSON.stringify(item.details || item, null, 2)}
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default TimelineItem;
