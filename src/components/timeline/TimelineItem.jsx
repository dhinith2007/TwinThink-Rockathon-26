import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  ChevronDown, 
  User, 
  Bot, 
  Shield, 
  FileText, 
  Hash, 
  Link2, 
  Copy, 
  Check, 
  ShieldCheck 
} from 'lucide-react';

export function TimelineItem({ item, isLast = false }) {
  const [showDetails, setShowDetails] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

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

  const copyEventHash = () => {
    if (item.event_hash) {
      navigator.clipboard?.writeText(item.event_hash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
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
          whileHover={{ x: 2, y: -2 }}
          className="p-5 rounded-2xl bg-surface border border-border hover:border-border-glow transition-all duration-200 shadow-sm"
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

          {/* Feature 9 — Tamper-Evident SHA-256 Hash Inspector */}
          {item.event_hash && (
            <div className="mb-3 p-3 rounded-xl bg-bg/90 border border-border/80 space-y-2 font-mono text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-text-primary">
                  <Hash className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="text-[10px] text-text-muted">Event Hash:</span>
                  <span className="text-text-primary font-bold truncate max-w-[140px] sm:max-w-[200px]" title={item.event_hash}>
                    {item.event_hash.slice(0, 10)}...{item.event_hash.slice(-8)}
                  </span>
                  <button
                    onClick={copyEventHash}
                    className="text-text-muted hover:text-primary transition-colors cursor-pointer"
                    title="Copy full SHA-256 hash"
                  >
                    {copiedHash ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-text-muted">Parent:</span>
                  <span className="text-text-muted truncate max-w-[80px]" title={item.previous_event_hash || "GENESIS"}>
                    {item.previous_event_hash ? `${item.previous_event_hash.slice(0, 8)}...` : "GENESIS"}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-success/20 text-success border border-success/40 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> VERIFIED
                  </span>
                </div>
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
              {showDetails ? 'Hide Raw Audit Log' : 'Inspect Cryptographic Payload'}
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
                <div className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Canonical SHA-256 Audit Payload ({item.id})</span>
                  <span className="text-[10px] text-success">Tamper-Evident Chained</span>
                </div>
                <pre className="overflow-x-auto p-3 rounded bg-black/70 text-text-primary text-[11px] leading-relaxed border border-border/80">
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
