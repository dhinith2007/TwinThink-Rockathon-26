import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, PlusCircle, Sparkles, Layers, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from './PrimaryButton';

export function EmptyState({
  title = "No Procurement Requests Active",
  description = "Create your first AI-powered procurement request. Ingest natural-language intent into policy-compliant enterprise decisions.",
  actionText = "Create New Request",
  actionLink = "/new-request",
  icon: Icon = ShoppingBag
}) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-10 rounded-2xl bg-surface border border-border/80 text-center flex flex-col items-center justify-center space-y-4 max-w-md mx-auto my-8 shadow-card"
    >
      {/* Icon Composition */}
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-glow-primary">
          <Icon className="w-8 h-8" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-success/20 border border-success/40 flex items-center justify-center text-success">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-bold font-mono text-text-primary tracking-tight">{title}</h3>
        <p className="text-xs text-text-secondary leading-relaxed font-mono">{description}</p>
      </div>

      <PrimaryButton
        size="md"
        icon={PlusCircle}
        onClick={() => navigate(actionLink)}
      >
        {actionText}
      </PrimaryButton>
    </motion.div>
  );
}

export default EmptyState;
