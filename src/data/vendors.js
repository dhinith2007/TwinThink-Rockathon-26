export const mockVendors = [
  {
    id: "VEN-001",
    name: "CompSource Enterprise Solutions",
    shortName: "CompSource",
    badge: "RECOMMENDED",
    isRecommended: true,
    source_channel: "Enterprise Direct Tier-1 Catalog",
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
    stockAvailable: 45,
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
      availabilityRisk: { level: "Low", score: 15, note: "45 units verified in local regional warehouse" }
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
    name: "Dell Direct Enterprise OEM",
    shortName: "DellDirect",
    badge: "TIER-1 OEM",
    isRecommended: false,
    source_channel: "Enterprise Direct Tier-1 Catalog",
    unitPrice: 43500,
    unitPriceDisplay: "₹43,500",
    totalPrice: 435000,
    totalPriceDisplay: "₹4,35,000",
    deliveryDays: 5,
    deliveryDisplay: "5 Business Days",
    reliabilityScore: 96,
    overallRisk: "Low",
    riskScoreNum: 12,
    warranty: "3 Years Dell ProSupport Plus",
    stockAvailable: 60,
    sellerRating: "4.9 / 5.0 (5,200+ Enterprise Buyers)",
    normalizedSpecs: {
      ram: "16 GB DDR5 4800MHz",
      storage: "512 GB NVMe PCIe SSD",
      processor: "Intel Core i5-1345U vPro",
      os: "Windows 11 Pro"
    },
    riskBreakdown: {
      priceRisk: { level: "Medium", score: 25, note: "Priced slightly above CompSource (₹43.5K vs ₹42.0K)" },
      deliveryRisk: { level: "Low", score: 10, note: "Direct OEM factory fulfillment" },
      sellerRisk: { level: "Very Low", score: 5, note: "Direct manufacturer relationship" },
      returnRisk: { level: "Low", score: 12, note: "Direct corporate return SLA" },
      availabilityRisk: { level: "Low", score: 8, note: "60+ units available at Bangalore depot" }
    },
    whyNotRejected: [
      "RANKED SECOND (#2) — TIER-1 DIRECT OEM",
      "✅ Direct manufacturer backing with highest reliability (96%)",
      "ℹ️ ₹1,500/unit higher price tag than CompSource (₹15,000 total variance for order)"
    ]
  },
  {
    id: "VEN-003",
    name: "TechnoWorld Wholesale Corp.",
    shortName: "TechnoWorld",
    badge: "COMPETITIVE B2B",
    isRecommended: false,
    source_channel: "B2B Marketplace & OEM Aggregator",
    unitPrice: 40890,
    unitPriceDisplay: "₹40,890",
    totalPrice: 408900,
    totalPriceDisplay: "₹4,08,900",
    deliveryDays: 4,
    deliveryDisplay: "4 Business Days",
    reliabilityScore: 91,
    overallRisk: "Low",
    riskScoreNum: 22,
    warranty: "2 Years Standard OEM Warranty",
    stockAvailable: 80,
    sellerRating: "4.6 / 5.0 (1,800+ Verified Buyers)",
    normalizedSpecs: {
      ram: "16 GB DDR5 4800MHz",
      storage: "512 GB NVMe SSD",
      processor: "AMD Ryzen 5 PRO 7530U",
      os: "Windows 11 Pro"
    },
    riskBreakdown: {
      priceRisk: { level: "Very Low", score: 8, note: "Lowest upfront price tag across marketplace" },
      deliveryRisk: { level: "Low", score: 15, note: "4-day marketplace dispatch" },
      sellerRisk: { level: "Medium", score: 30, note: "Third-party reseller aggregator" },
      returnRisk: { level: "Medium", score: 28, note: "15-day return window" },
      availabilityRisk: { level: "Low", score: 10, note: "80 units in stock buffer" }
    },
    whyNotRejected: [
      "RANKED THIRD (#3) — BEST VALUE B2B MARKETPLACE",
      "✅ Lowest upfront price in the marketplace (₹40,890/unit)",
      "ℹ️ Warranty is 2-year standard OEM vs 3-year ProSupport from CompSource"
    ]
  },
  {
    id: "VEN-004",
    name: "QuickShip Logistics & Hardware",
    shortName: "QuickShip",
    badge: "DISQUALIFIED",
    isRecommended: false,
    source_channel: "B2B Marketplace & OEM Aggregator",
    unitPrice: 39000,
    unitPriceDisplay: "₹39,000",
    totalPrice: 390000,
    totalPriceDisplay: "₹3,90,000",
    deliveryDays: 8,
    deliveryDisplay: "8 Business Days",
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
      "❌ Delivery SLA (8 days) exceeds maximum 7-day delivery requirement",
      "❌ High availability risk — stock buffer is only 1 unit above requested quantity",
      "❌ Warranty is limited 1-year seller-only warranty, failing enterprise governance"
    ]
  }
];
