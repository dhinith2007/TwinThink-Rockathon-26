export const mockAuditTrail = [
  {
    id: "EVT-101",
    timestamp: "2026-08-19 09:30:12 AM",
    title: "Buying Request Submitted",
    stage: "Request Sourcing",
    status: "success",
    actor: "Ravi Kumar (User)",
    summary: "Natural-language request received: 'Buy 10 laptops under ₹45,000 each with 16GB RAM and delivery within 7 days.'",
    details: {
      rawPrompt: "Buy 10 laptops under ₹45,000 each with 16GB RAM and delivery within 7 days.",
      sourceChannel: "ProcuraAI Web Dashboard",
      ipAddress: "192.168.1.14"
    }
  },
  {
    id: "EVT-102",
    timestamp: "2026-08-19 09:30:15 AM",
    title: "Constraint Extraction & Normalization",
    stage: "Intelligence Engine",
    status: "success",
    actor: "ProcuraAI Constraint Engine",
    summary: "Extracted 5 Hard Constraints (Budget ≤ ₹45k, Qty=10, RAM ≥ 16GB, SSD ≥ 512GB, Delivery ≤ 7d) & 1 Ambiguity (OS unspecified).",
    details: {
      hardConstraintsCount: 5,
      softPreferencesCount: 3,
      ambiguitiesDetected: ["Operating System OS missing - assigned Windows 11 Pro policy"],
      processingTimeMs: 340
    }
  },
  {
    id: "EVT-103",
    timestamp: "2026-08-19 09:30:48 AM",
    title: "Multi-Vendor Market Sourcing & Scoring",
    stage: "Vendor Discovery",
    status: "success",
    actor: "ProcuraAI Market Sourcing Agent",
    summary: "Evaluated 3 vendors across 5 risk dimensions. Vendor A selected (94% reliability, ₹42k/unit). Vendor B rejected for high seller risk (63%).",
    details: {
      totalVendorsScanned: 14,
      compliantVendorsFound: 2,
      rejectedVendors: [{ vendor: "Vendor B", reason: "Reliability 63% < 85% safety threshold" }],
      selectedVendor: "Vendor A — CompSource Enterprise"
    }
  },
  {
    id: "EVT-104",
    timestamp: "2026-08-19 09:31:05 AM",
    title: "Autonomous Negotiation Succeeded",
    stage: "Negotiation Engine",
    status: "success",
    actor: "ProcuraAI Negotiation Agent",
    summary: "Automated counter-offer issued to CompSource Enterprise for bulk order (10 units). Price reduced from ₹44,000 to ₹42,000/unit (₹20k total saving).",
    details: {
      initialQuote: "₹44,000 / unit",
      counterOffer: "₹41,500 / unit",
      finalAgreed: "₹42,000 / unit",
      totalSavings: "₹20,000"
    }
  },
  {
    id: "EVT-105",
    timestamp: "2026-08-19 09:31:22 AM",
    title: "Authorization Firewall Evaluation",
    stage: "Policy Firewall",
    status: "warning",
    actor: "ProcuraAI Policy Engine",
    summary: "Policy POL-001 triggered: Total cost ₹4,20,000 exceeds ₹2,00,000 auto-approval threshold. Escalated to Human Approval.",
    details: {
      evaluatedRules: 5,
      passedRules: 4,
      triggeredRule: "POL-001 (Budget Limit)",
      actionTaken: "ESCALATE_TO_HUMAN"
    }
  },
  {
    id: "EVT-106",
    timestamp: "2026-08-19 09:34:00 AM",
    title: "Decision Packet Approved by VP",
    stage: "Human Oversight",
    status: "success",
    actor: "VP of Technology (Executive)",
    summary: "Decision Packet DP-2026-8942 reviewed and authorized by human executive.",
    details: {
      decision: "APPROVED",
      authorizedAmount: "₹4,20,000",
      comments: "Approved. Great pricing and warranty term."
    }
  },
  {
    id: "EVT-107",
    timestamp: "2026-08-19 09:34:10 AM",
    title: "Purchase Order Issued",
    stage: "Fulfillment Ledger",
    status: "success",
    actor: "ProcuraAI Order Dispatcher",
    summary: "Purchase Order #PO-8942 generated & dispatched to CompSource Enterprise. Fulfillment tracking activated.",
    details: {
      poNumber: "PO-2026-8942",
      vendorEmail: "orders@compsource-enterprise.com",
      expectedDelivery: "2026-08-24"
    }
  }
];
