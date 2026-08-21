import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Cpu, 
  GitCompare, 
  ShieldCheck, 
  UserCheck, 
  History,
  Bot,
  Sparkles
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard, step: null },
  { name: 'New Request', path: '/new-request', icon: PlusCircle, step: '1' },
  { name: 'Constraint Analysis', path: '/constraint-analysis', icon: Cpu, step: '2' },
  { name: 'Vendor Comparison', path: '/vendor-comparison', icon: GitCompare, step: '3' },
  { name: 'Authorization Firewall', path: '/authorization-firewall', icon: ShieldCheck, step: '4' },
  { name: 'Human Approval', path: '/human-approval', icon: UserCheck, step: '5', badge: '1 Action' },
  { name: 'Audit Timeline', path: '/audit-timeline', icon: History, step: '6' },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-surface border-r border-border flex flex-col h-screen sticky top-0 z-30 shrink-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary/20 to-primary/40 border border-primary/40 flex items-center justify-center text-primary shadow-glow-primary">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-lg text-text-primary tracking-tight font-mono">Procura<span className="text-primary">AI</span></span>
            <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-primary/20 text-primary border border-primary/30 rounded">v2.0</span>
          </div>
          <p className="text-[11px] text-text-muted font-medium truncate">Autonomous Sourcing</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-text-muted">
          Autonomous Procurement Workflow
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary/15 text-primary border border-primary/30 font-semibold shadow-glow-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover hover:border-border/50 border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Left Indicator Bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-primary rounded-r-md"></span>
                  )}
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                    <span className="truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.step && (
                      <span className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${isActive ? 'bg-primary text-text-primary font-bold' : 'bg-bg text-text-muted'}`}>
                        S{item.step}
                      </span>
                    )}
                    {item.badge && (
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-warning/20 text-warning border border-warning/30 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Enterprise Status Banner Footer */}
      <div className="p-4 m-3 rounded-xl bg-bg border border-border space-y-1.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-success" />
          <span className="text-xs font-mono font-semibold text-text-primary">Policy Firewall</span>
        </div>
        <p className="text-[11px] text-text-muted leading-relaxed font-mono">
          Engine: <span className="text-success font-medium">Active (99.8%)</span>
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
