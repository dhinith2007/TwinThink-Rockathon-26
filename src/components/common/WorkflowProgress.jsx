import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle } from 'lucide-react';

const STEPS = [
  { step: 1, label: 'New Request', path: '/new-request' },
  { step: 2, label: 'Constraints', path: '/constraint-analysis' },
  { step: 3, label: 'Vendors', path: '/vendor-comparison' },
  { step: 4, label: 'Firewall', path: '/authorization-firewall' },
  { step: 5, label: 'Approval', path: '/human-approval' },
  { step: 6, label: 'Audit', path: '/audit-timeline' },
];

export function WorkflowProgress({ currentStep }) {
  const navigate = useNavigate();

  return (
    <div className="w-full rounded-2xl bg-surface border border-border px-5 py-3 mb-6 shadow-card">
      <div className="flex items-center gap-1 overflow-x-auto">
        {STEPS.map((s, idx) => {
          const done = s.step < currentStep;
          const active = s.step === currentStep;
          return (
            <React.Fragment key={s.step}>
              {/* Step node */}
              <button
                onClick={() => navigate(s.path)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-primary/20 border border-primary/50 text-primary shadow-glow-primary'
                    : done
                    ? 'text-success hover:bg-success/10'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {done ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                ) : (
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] border ${
                    active ? 'border-primary text-primary bg-primary/10' : 'border-border text-text-muted'
                  }`}>
                    {s.step}
                  </span>
                )}
                <span className="hidden sm:block">{s.label}</span>
                <span className="sm:hidden">{s.step}</span>
              </button>

              {/* Connector */}
              {idx < STEPS.length - 1 && (
                <div className={`flex-1 min-w-[12px] h-px transition-colors duration-300 ${
                  s.step < currentStep ? 'bg-success/50' : 'bg-border'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default WorkflowProgress;
