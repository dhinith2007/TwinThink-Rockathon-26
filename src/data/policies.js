export const mockPolicies = [
  {
    id: "POL-001",
    title: "Maximum Purchase Authorization",
    category: "Budget & Finance",
    rule: "Auto-approve purchases ≤ ₹2,00,000. Require VP approval for ₹2,00,001 – ₹5,00,000. Block > ₹5,00,000.",
    threshold: "₹2,00,000 Auto / ₹5,00,000 Max",
    status: "ESCALATED",
    statusColor: "warning",
    impact: "Total request ₹4,20,000 exceeds ₹2,00,000 auto-approval cap. Triggers Escalation to Human VP."
  },
  {
    id: "POL-002",
    title: "Vendor Reliability & Safety Threshold",
    category: "Risk Control",
    rule: "Disqualify any vendor with a historical reliability score below 85% or seller dispute rate > 10%.",
    threshold: "Min 85% Score",
    status: "PASSED",
    statusColor: "success",
    impact: "Vendor A rating is 94% (PASSED). Vendor B (63%) successfully blocked by Firewall."
  },
  {
    id: "POL-003",
    title: "Per-Item Budget Cap",
    category: "Item Policy",
    rule: "Standard IT laptops must not exceed ₹50,000 per unit without prior CTO waiver.",
    threshold: "≤ ₹50,000 / unit",
    status: "PASSED",
    statusColor: "success",
    impact: "Vendor A price is ₹42,000 / unit (₹8,000 under cap)."
  },
  {
    id: "POL-004",
    title: "Approved IT Asset Categories",
    category: "Compliance",
    rule: "Automated purchasing allowed only for pre-cleared categories: Electronics, IT Hardware, Office Ergonomics.",
    threshold: "Pre-cleared List",
    status: "PASSED",
    statusColor: "success",
    impact: "Category 'IT Hardware' is whitelisted for autonomous agent sourcing."
  },
  {
    id: "POL-005",
    title: "Autonomous Negotiation Boundary",
    category: "Agent Governance",
    rule: "Agent may autonomously counter-offer vendors up to 8% price variance. Exceeding variance requires Human sign-off.",
    threshold: "Max 8% Variance",
    status: "ACTIVE",
    statusColor: "primary",
    impact: "Agent negotiated Vendor A price down from ₹44,000 to ₹42,000 (4.5% savings, within tolerance)."
  }
];

export const firewallOutcomes = [
  {
    type: "ALLOW",
    title: "Autonomous Execution Allowed",
    description: "Purchase ≤ ₹2,00,000, 100% policy compliance, low risk, high agent confidence.",
    badge: "Auto-Approve",
    color: "success"
  },
  {
    type: "ESCALATE",
    title: "Human Approval Escalation",
    description: "Purchase ₹2,00,001 – ₹5,00,000 or custom policy variance detected. Requires Decision Packet review.",
    badge: "Action Required",
    color: "warning",
    activeForCurrent: true
  },
  {
    type: "BLOCK",
    title: "Firewall Block & Halt",
    description: "Violates non-negotiable policy (e.g. Budget > ₹5L, Unsafe Vendor, Unlisted Category).",
    badge: "Forbidden",
    color: "danger"
  }
];
