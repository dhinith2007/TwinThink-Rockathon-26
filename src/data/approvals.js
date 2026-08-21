export const mockDecisionPacket = {
  id: "DP-2026-8942",
  requestId: "REQ-2026-8942",
  requestTitle: "10 × High-Performance Enterprise Laptops",
  requestedBy: "Ravi Kumar (Engineering Lead)",
  department: "Product Engineering",
  dateSubmitted: "2026-08-19 09:30 AM",
  selectedVendor: "Vendor A — CompSource Enterprise",
  unitCost: 42000,
  totalCost: 420000,
  targetBudget: 450000,
  savingsAmount: 30000,
  deliveryWindow: "5 Business Days (Expected Aug 24, 2026)",
  overallRiskLevel: "Low Risk (14/100)",
  agentConfidence: 96,
  escalationReason: "Total purchase amount (₹4,20,000) exceeds single-level auto-approval limit (₹2,00,000). Policy POL-001 requires VP level sign-off.",
  agentRecommendation: "APPROVE. Sourced top-rated Vendor A with ₹30,000 under budget, 5-day delivery SLA, and 3-Year Onsite ProSupport.",
  alternativesSummary: [
    { name: "Vendor A (Recommended)", cost: "₹4.20L", delivery: "5 days", risk: "Low (14/100)", status: "Selected" },
    { name: "Vendor B (QuickShip)", cost: "₹3.90L", delivery: "7 days", risk: "High (67/100)", status: "Rejected (Seller score 63%)" },
    { name: "Vendor C (TechnoWorld)", cost: "₹4.40L", delivery: "4 days", risk: "Low (22/100)", status: "Alternative (+₹20k price)" }
  ],
  tradeoffAnalysis: "Choosing Vendor A saves ₹20,000 over Vendor C while securing a superior 3-Year Onsite warranty. Rejecting Vendor B avoids a 67/100 risk score and potential fulfillment delays."
};
