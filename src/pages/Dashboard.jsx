import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  PlusCircle, 
  FileText, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  Bot,
  Sparkles,
  Activity,
  Server,
  Zap
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { StatusBadge } from '../components/common/StatusBadge';
import { useProcurement } from '../context/ProcurementContext';

export function Dashboard() {
  const navigate = useNavigate();
  const { demoSessionId, activityFeed } = useProcurement();

  const dashboardRequests = [
    {
      id: "REQ-2026-8942",
      title: "10 × Dell Latitude 5440 Laptops",
      category: "IT Hardware",
      quantity: 10,
      totalBudget: 450000,
      unitBudget: 45000,
      status: "Escalated to Human",
      requester: "Ravi Kumar (Engineering)"
    },
    {
      id: "REQ-2026-8941",
      title: "25 × ErgoPro Executive Mesh Chairs",
      category: "Office Equipment",
      quantity: 25,
      totalBudget: 300000,
      unitBudget: 12000,
      status: "Approved",
      requester: "Priya Sharma (Ops)"
    },
    {
      id: "REQ-2026-8940",
      title: "15 × LG 27-inch 4K UHD Monitors",
      category: "IT Hardware",
      quantity: 15,
      totalBudget: 420000,
      unitBudget: 28000,
      status: "Approved",
      requester: "Arun Varma (Design)"
    },
    {
      id: "REQ-2026-8939",
      title: "40 × Logitech MX Keys Wireless Keyboard",
      category: "Peripherals",
      quantity: 40,
      totalBudget: 180000,
      unitBudget: 4500,
      status: "Active Sourcing",
      requester: "Kavita Reddy (IT)"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Header Card */}
      <div className="relative p-6 md:p-8 rounded-2xl bg-gradient-to-r from-surface via-surface to-surface-hover border border-border shadow-card overflow-hidden">
        {/* Glow backdrop accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-mono font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Autonomous Procurement Intelligence</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-bg border border-border text-text-muted text-xs font-mono font-bold">
                Session: <span className="text-text-primary">{demoSessionId}</span>
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight font-mono">
              Welcome to <span className="text-primary">ProcuraAI</span>
            </h1>
            <p className="text-text-secondary text-base max-w-2xl leading-relaxed">
              From buying intent to authorized action. Autonomous procurement intelligence platform converting natural-language intent into policy-compliant enterprise decisions.
            </p>
          </div>

          <div className="shrink-0">
            <PrimaryButton
              size="lg"
              icon={PlusCircle}
              onClick={() => navigate('/new-request')}
            >
              New Procurement Request
            </PrimaryButton>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid with Animated Upward Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Active Requests"
          value={14}
          change="+3 this week"
          changeType="positive"
          icon={FileText}
          description="Sourcing & vendor scoring active"
        />
        <StatCard
          title="Pending Approval"
          value={3}
          change="1 high priority"
          changeType="negative"
          icon={Clock}
          description="Decision packets awaiting VP sign-off"
        />
        <StatCard
          title="Approved Orders"
          value={128}
          change="+12% vs last month"
          changeType="positive"
          icon={CheckCircle2}
          description="Fully authorized POs issued"
        />
        <StatCard
          title="Total Spend Managed"
          value="₹42.8L"
          change="Saved ₹6.2L via AI"
          changeType="positive"
          icon={TrendingUp}
          description="Autonomous negotiation savings"
        />
      </div>

      {/* Main Content Grid: Recent Requests & AI Activity Feed / Health Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Procurement Requests Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-mono text-text-primary tracking-tight">Recent Procurement Requests</h2>
              <p className="text-xs text-text-muted">Real-time status of intent requests & autonomous pipeline</p>
            </div>
            <Link
              to="/constraint-analysis"
              className="text-xs font-mono text-primary hover:text-primary-hover font-medium flex items-center gap-1 transition-colors"
            >
              View Active Demo Request <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Table Container */}
          <div className="rounded-2xl bg-surface border border-border overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-bg/60 font-mono text-text-muted uppercase text-[11px] border-b border-border">
                  <tr>
                    <th className="px-5 py-3.5">Request Details</th>
                    <th className="px-5 py-3.5">Quantity & Budget</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {dashboardRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-surface-hover/80 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-text-primary font-mono text-sm mb-0.5">{req.title}</div>
                        <div className="text-text-muted text-[11px]">
                          {req.id} • {req.requester}
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono">
                        <div className="text-text-primary font-semibold">₹{(req.totalBudget).toLocaleString()}</div>
                        <div className="text-text-muted text-[11px]">{req.quantity} Units @ ₹{(req.unitBudget).toLocaleString()}</div>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => navigate('/constraint-analysis')}
                          className="px-3 py-1.5 rounded-lg bg-bg border border-border text-primary hover:border-primary/40 font-mono text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Inspect Workflow
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side Column: AI Activity Feed & AI Health Widget */}
        <div className="space-y-6">
          {/* AI Health Widget */}
          <div className="p-5 rounded-2xl bg-surface border border-border space-y-4 shadow-card">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold font-mono text-text-primary">AI System Health</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-success/15 text-success border border-success/30">
                HEALTHY
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-bg border border-border">
                <span className="text-text-muted text-[10px] block">CONNECTED VENDORS</span>
                <span className="text-text-primary font-bold text-base">12 Network</span>
              </div>
              <div className="p-3 rounded-xl bg-bg border border-border">
                <span className="text-text-muted text-[10px] block">DECISIONS TODAY</span>
                <span className="text-primary font-bold text-base">37 Automated</span>
              </div>
            </div>
          </div>

          {/* Live AI Activity Feed */}
          <div className="p-5 rounded-2xl bg-surface border border-border space-y-4 shadow-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-warning" />
                <h3 className="text-sm font-bold font-mono text-text-primary">Live AI Activity Feed</h3>
              </div>
              <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            </div>

            <div className="space-y-3 font-mono text-xs max-h-72 overflow-y-auto pr-1">
              {activityFeed.map((item) => (
                <div key={item.id} className="p-3 rounded-xl bg-bg border border-border space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-text-muted">
                    <span>{item.time}</span>
                    <span className="text-primary font-bold">AGENT LOG</span>
                  </div>
                  <p className="text-text-secondary leading-snug text-[11px]">
                    {item.action}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
