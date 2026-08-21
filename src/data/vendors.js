export const mockVendors = [
  {
    id: "VEN-001",
    name: "Vendor A — CompSource Enterprise",
    shortName: "Vendor A",
    badge: "RECOMMENDED",
    isRecommended: true,
    unitPrice: 42000,
    unitPriceDisplay: "₹42,000",
    totalPrice: 420000,
    totalPriceDisplay: "₹4,20,000",
    deliveryDays: 5,
    deliveryDisplay: "5 Business Days",
    reliabilityScore: 94,
    overallRisk: "Low",
    riskScoreNum: 14,
    warranty: "3 Years Onsite ProSupport",
    stockAvailable: 24,
    sellerRating: "4.8 / 5.0 (3,400+ Verified Buyers)",
    normalizedSpecs: {
      ram: "16 GB DDR5 4800MHz",
      storage: "512 GB M.2 NVMe SSD",
      processor: "Intel Core i5-1345U vPro",
      os: "Windows 11 Pro Pre-installed"
    },
    riskBreakdown: {
      priceRisk: { level: "Low", score: 10, note: "Within target budget (saving ₹30,000 total)" },
      deliveryRisk: { level: "Low", score: 12, note: "Guaranteed 5-day SLA with tracked courier" },
      sellerRisk: { level: "Low", score: 8, note: "Tier-1 authorized OEM partner with 99.2% fulfillment" },
      returnRisk: { level: "Medium", score: 25, note: "Standard 15-day return window with 5% restocking fee" },
      availabilityRisk: { level: "Low", score: 15, note: "24 units verified in local regional warehouse" }
    },
    whySelected: [
      "Meets 100% of mandatory hard constraints (RAM, SSD, Budget, Delivery)",
      "Fastest compliant delivery SLA (5 days vs 7-day threshold)",
      "Lowest overall risk index (14/100) among all verified sellers",
      "Includes upgraded 3-Year Onsite ProSupport warranty"
    ]
  },
  {
    id: "VEN-002",
    name: "Vendor B — QuickShip Direct",
    shortName: "Vendor B",
    badge: "HIGH RISK",
    isRecommended: false,
    unitPrice: 39000,
    unitPriceDisplay: "₹39,000",
    totalPrice: 390000,
    totalPriceDisplay: "₹3,90,000",
    deliveryDays: 7,
    deliveryDisplay: "7 Business Days",
    reliabilityScore: 63,
    overallRisk: "High",
    riskScoreNum: 67,
    warranty: "1 Year Seller Warranty",
    stockAvailable: 11,
    sellerRating: "3.4 / 5.0 (120 Reviews)",
    normalizedSpecs: {
      ram: "16 GB DDR4 (Single Slot)",
      storage: "512 GB SATA SSD",
      processor: "Intel Core i5-1235U",
      os: "DOS / No OS"
    },
    riskBreakdown: {
      priceRisk: { level: "Very Low", score: 5, note: "Cheapest upfront tag (₹3,000 cheaper/unit)" },
      deliveryRisk: { level: "High", score: 75, note: "Frequent dispatch delays reported (4.2 days avg delay)" },
      sellerRisk: { level: "High", score: 82, note: "Unverified marketplace seller with 18% dispute rate" },
      returnRisk: { level: "Medium", score: 45, note: "Buyer pays return logistics" },
      availabilityRisk: { level: "High", score: 70, note: "Only 11 units left (borderline stock buffer)" }
    },
    whyNotRejected: [
      "DISQUALIFIED / REJECTED by Decision Engine",
      "❌ Seller reliability (63%) falls below minimum safety threshold (85%)",
      "❌ High delivery delay risk (historical 75% delay rate exceeds 7-day limit)",
      "❌ High availability risk — stock buffer is only 1 unit above requested quantity",
      "❌ Warranty is limited seller-only warranty, failing enterprise compliance"
    ]
  },
  {
    id: "VEN-003",
    name: "Vendor C — TechnoWorld Wholesale",
    shortName: "Vendor C",
    badge: "COMPLIANT",
    isRecommended: false,
    unitPrice: 44000,
    unitPriceDisplay: "₹44,000",
    totalPrice: 440000,
    totalPriceDisplay: "₹4,40,000",
    deliveryDays: 4,
    deliveryDisplay: "4 Business Days",
    reliabilityScore: 91,
    overallRisk: "Low",
    riskScoreNum: 22,
    warranty: "2 Years OEM Warranty",
    stockAvailable: 50,
    sellerRating: "4.6 / 5.0 (1,800+ Verified Buyers)",
    normalizedSpecs: {
      ram: "16 GB DDR5 4800MHz",
      storage: "512 GB NVMe SSD",
      processor: "AMD Ryzen 5 PRO 7530U",
      os: "Windows 11 Pro"
    },
    riskBreakdown: {
      priceRisk: { level: "Medium", score: 30, note: "Close to maximum budget ceiling (₹44K vs ₹45K limit)" },
      deliveryRisk: { level: "Very Low", score: 8, note: "Ultra-fast 4-day delivery SLA" },
      sellerRisk: { level: "Low", score: 15, note: "Established enterprise vendor with 95% rating" },
      returnRisk: { level: "Low", score: 18, note: "Hassle-free 30-day corporate return policy" },
      availabilityRisk: { level: "Low", score: 10, note: "Large buffer (50+ units in stock)" }
    },
    whyNotRejected: [
      "RANKED SECOND (#2)",
      "✅ Fully compliant with hard constraints",
      "ℹ️ Priced ₹2,000/unit higher than Vendor A (₹20,000 total variance for order)",
      "ℹ️ Warranty is 2 years OEM vs Vendor A's 3 years Onsite ProSupport"
    ]
  }
];
