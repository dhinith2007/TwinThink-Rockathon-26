import React, { useState, useEffect } from 'react';
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
  Zap,
  Layers,
  Database,
  Cpu,
  Package,
  Building2,
  Tag,
  Shield,
  Search
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { StatusBadge } from '../components/common/StatusBadge';
import { AnimatedCounter } from '../components/common/AnimatedCounter';
import { useProcurement } from '../context/ProcurementContext';

export function Dashboard() {
  const navigate = useNavigate();
  const { demoSessionId, activityFeed, backendHealth } = useProcurement();

  const [insights, setInsights] = useState({
    total_products: 120,
    total_vendors: 25,
    total_offers: 360,
    total_categories: 8,
    procurement_sources_count: 2,
    governance_policies_count: 5,
    live_status: "ONLINE & SYNCHRONIZED"
  });

  useEffect(() => {
    // Fetch live knowledge insights from backend if available
    fetch('http://localhost:8000/api/vendors/knowledge-insights')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.total_products) {
          setInsights(data);
        }
      })
      .catch(() => {
        // Fallback to default verified metrics
      });
  }, []);

  const pipelineStages = [
    { name: "New Requests", count: 6, color: "text-primary", bg: "bg-primary/10 border-primary/30", icon: PlusCircle, desc: "Awaiting NLP ingestion" },
    { name: "Constraint Analysis", count: 3, color: "text-warning", bg: "bg-warning/10 border-warning/30", icon: Cpu, desc: "Constraint intelligence & sourcing" },
    { name: "Executive Approval", count: 2, color: "text-warning", bg: "bg-warning/15 border-warning/40", icon: Clock, desc: "Decision packets pending VP sign-off" },
    { name: "Completed POs", count: 9, color: "text-success", bg: "bg-success/10 border-success/30", icon: CheckCircle2, desc: "Cryptographically chained orders" }
  ];

  const dashboardRequests = [
    {
      id: "REQ-2026-8942",
      title: "10 × Dell Latitude 5440 Laptops",
      category: "Laptops",
      quantity: 10,
      totalBudget: 450000,
      unitBudget: 45000,
      status: "Escalated to Human",
      requester: "Ravi Kumar (Engineering)"
    },
    {
      id: "REQ-2026-8941",
      title: "25 × ErgoPro Executive Mesh Chairs",
      category: "Office Furniture",
      quantity: 25,
      totalBudget: 300000,
      unitBudget: 12000,
      status: "Approved",
      requester: "Priya Sharma (Ops)"
    },
    {
      id: "REQ-2026-8940",
      title: "15 × LG 27-inch 4K UHD Monitors",
      category: "Monitors",
      quantity: 15,
      totalBudget: 420000,
      unitBudget: 28000,
      status: "Approved",
      requester: "Arun Varma (Design)"
    },
    {
      id: "REQ-2026-8939",
      title: "40 × Logitech MX Keys Wireless Keyboard",
      category: "Keyboards",
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

          <div className="shrink-0 flex items-center gap-3">
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

      {/* Procurement Knowledge Insights — Scale & Ecosystem Transparency */}
      <div className="p-6 rounded-2xl bg-surface border border-primary/30 shadow-glow-primary space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/80 pb-3 gap-2">
          <div className="flex items-center gap-2 font-mono text-sm font-bold text-text-primary">
            <Database className="w-4 h-4 text-primary" />
            <span>Procurement Knowledge Insights</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-primary/15 text-primary border border-primary/30 uppercase font-extrabold">
              2 Sourcing Channels
            </span>
          </div>
          <span className="text-xs font-mono text-success flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            {insights.total_products} Enterprise Products Indexed
          </span>
        </div>

        {/* 6 Metric Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
          <div className="p-3.5 rounded-xl bg-bg border border-border hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between text-text-muted mb-1">
              <span className="text-[10px] uppercase font-bold">Products</span>
              <Package className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="text-2xl font-extrabold text-text-primary">
              <AnimatedCounter value={insights.total_products} />
            </div>
            <span className="text-[10px] text-text-muted">Curated catalog</span>
          </div>

          <div className="p-3.5 rounded-xl bg-bg border border-border hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between text-text-muted mb-1">
              <span className="text-[10px] uppercase font-bold">Vendors</span>
              <Building2 className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="text-2xl font-extrabold text-text-primary">
              <AnimatedCounter value={insights.total_vendors} />
            </div>
            <span className="text-[10px] text-text-muted">Enterprise network</span>
          </div>

          <div className="p-3.5 rounded-xl bg-bg border border-border hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between text-text-muted mb-1">
              <span className="text-[10px] uppercase font-bold">Live Offers</span>
              <Tag className="w-3.5 h-3.5 text-success" />
            </div>
            <div className="text-2xl font-extrabold text-success">
              <AnimatedCounter value={insights.total_offers} />
            </div>
            <span className="text-[10px] text-text-muted">Competing quotes</span>
          </div>

          <div className="p-3.5 rounded-xl bg-bg border border-border hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between text-text-muted mb-1">
              <span className="text-[10px] uppercase font-bold">Categories</span>
              <Layers className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="text-2xl font-extrabold text-text-primary">
              <AnimatedCounter value={insights.total_categories} />
            </div>
            <span className="text-[10px] text-text-muted">Domain taxonomies</span>
          </div>

          <div className="p-3.5 rounded-xl bg-bg border border-border hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between text-text-muted mb-1">
              <span className="text-[10px] uppercase font-bold">Sources</span>
              <Server className="w-3.5 h-3.5 text-warning" />
            </div>
            <div className="text-2xl font-extrabold text-warning">
              <AnimatedCounter value={insights.procurement_sources_count} />
            </div>
            <span className="text-[10px] text-text-muted">Direct &amp; B2B Mart</span>
          </div>

          <div className="p-3.5 rounded-xl bg-bg border border-border hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between text-text-muted mb-1">
              <span className="text-[10px] uppercase font-bold">Policies</span>
              <Shield className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="text-2xl font-extrabold text-primary">
              <AnimatedCounter value={insights.governance_policies_count} />
            </div>
            <span className="text-[10px] text-text-muted">Governance rules</span>
          </div>
        </div>

        {/* Source Channels Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-bg/70 border border-border flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <div>
                <div className="font-bold text-text-primary">Source A — Enterprise Direct Tier-1 Catalog</div>
                <div className="text-[10px] text-text-muted">DellDirect, LenovoHub, HPDirect, LG Partner, Steelcase Direct (High SLA &amp; 3-Yr Onsite)</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 shrink-0">
              13 Preferred Suppliers
            </span>
          </div>

          <div className="p-3 rounded-xl bg-bg/70 border border-border flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-warning" />
              <div>
                <div className="font-bold text-text-primary">Source B — B2B Marketplace &amp; OEM Aggregator</div>
                <div className="text-[10px] text-text-muted">TechnoWorld, ITMart, QuickShip, DisplayHub, PrimeHardware (Competitive Pricing)</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-warning/10 text-warning border border-warning/20 shrink-0">
              12 Competitive Wholesalers
            </span>
          </div>
        </div>
      </div>

      {/* Procurement Pipeline Widget */}
      <div className="p-6 rounded-2xl bg-surface border border-border shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-border/80 pb-3">
          <div className="flex items-center gap-2 font-mono text-sm font-bold text-text-primary">
            <Layers className="w-4 h-4 text-primary" />
            <span>Procurement Pipeline Overview</span>
          </div>
          <span className="text-xs font-mono text-text-muted">20 Active Lifecycle Items</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
          {pipelineStages.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <motion.div
                key={stage.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-4 rounded-xl border ${stage.bg} transition-all hover:scale-[1.02]`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-text-muted font-bold uppercase">{stage.name}</span>
                  <Icon className={`w-4 h-4 ${stage.color}`} />
                </div>
                <div className={`text-2xl md:text-3xl font-extrabold ${stage.color}`}>
                  <AnimatedCounter value={stage.count} />
                </div>
                <p className="text-[10px] text-text-muted mt-1 truncate">{stage.desc}</p>
              </motion.div>
            );
          })}
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

        {/* Right Side Column: AI Health Card & Live AI Activity Feed */}
        <div className="space-y-6">
          {/* Enhanced AI Health Card */}
          <div className="p-5 rounded-2xl bg-surface border border-border space-y-4 shadow-card">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold font-mono text-text-primary">ProcuraAI Engine Status</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-success/15 text-success border border-success/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                ONLINE
              </span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-bg border border-border">
                <span className="text-text-muted flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-primary" /> Cloud Connected
                </span>
                <span className="text-success font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" /> {backendHealth.mode === 'live' ? 'Live Cloud' : 'Offline Resilient'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-bg border border-border">
                <span className="text-text-muted flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-primary" /> Active Database
                </span>
                <span className="text-success font-bold flex items-center gap-1 truncate max-w-[140px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" /> {backendHealth.database_type || "PostgreSQL / SQLite"}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-bg border border-border">
                <span className="text-text-muted flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-primary" /> AI Sourcing Engine
                </span>
                <span className="text-success font-bold flex items-center gap-1 truncate max-w-[140px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" /> {backendHealth.ai_engine || "OpenRouter AI"}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-bg border border-border">
                <span className="text-text-muted flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Multi-Source Network
                </span>
                <span className="text-success font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" /> 25 Vendors (2 Sources)
                </span>
              </div>
            </div>
          </div>

          {/* Live AI Activity Feed with smooth slide-in transitions */}
          <div className="p-5 rounded-2xl bg-surface border border-border space-y-4 shadow-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-warning" />
                <h3 className="text-sm font-bold font-mono text-text-primary">Live Activity Stream</h3>
              </div>
              <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            </div>

            <div className="space-y-2.5 font-mono text-xs max-h-72 overflow-y-auto pr-1">
              {activityFeed.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-3 rounded-xl bg-bg border border-border space-y-1 hover:border-primary/40 transition-colors"
                >
                  <div className="flex justify-between items-center text-[10px] text-text-muted">
                    <span>{item.time}</span>
                    <span className="text-primary font-bold">AGENT EVENT</span>
                  </div>
                  <p className="text-text-secondary leading-snug text-[11px]">
                    {item.action}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
