export const mockRequests = [
  {
    id: "REQ-2026-8942",
    title: "High-Performance Developer Laptops",
    itemName: "Enterprise Laptops (16GB RAM, 512GB SSD)",
    category: "IT Hardware",
    quantity: 10,
    unitBudget: 45000,
    totalBudget: 450000,
    deliveryDeadlineDays: 7,
    priority: "High",
    status: "Escalated to Human",
    date: "2026-08-19",
    requester: "Ravi Kumar (Engineering)",
    originalPrompt: "Buy 10 laptops under ₹45,000 each with 16GB RAM and delivery within 7 days.",
    hardConstraints: [
      { name: "Budget per Unit", value: "≤ ₹45,000", status: "met" },
      { name: "Quantity", value: "10 Units", status: "met" },
      { name: "RAM Specification", value: "≥ 16GB DDR5", status: "met" },
      { name: "Storage Specification", value: "≥ 512GB NVMe SSD", status: "met" },
      { name: "Delivery Window", value: "≤ 7 Business Days", status: "met" }
    ],
    softPreferences: [
      { name: "Preferred Brand", value: "Dell / Lenovo Enterprise", importance: "High" },
      { name: "Warranty Duration", value: "≥ 2 Years Onsite", importance: "Medium" },
      { name: "Seller Rating", value: "≥ 88% Reliability", importance: "High" }
    ],
    ambiguities: [
      { field: "Operating System", notes: "Preferred OS not specified — defaulting to Windows 11 Pro policy." },
      { field: "Accessories", notes: "Laptop sleeves/chargers unspecified — assumed included in standard SKU." }
    ]
  },
  {
    id: "REQ-2026-8941",
    title: "Ergonomic Mesh Office Chairs",
    itemName: "Ergonomic High-Back Chairs",
    category: "Office Equipment",
    quantity: 25,
    unitBudget: 12000,
    totalBudget: 300000,
    deliveryDeadlineDays: 10,
    priority: "Medium",
    status: "Approved",
    date: "2026-08-18",
    requester: "Priya Sharma (Operations)",
    originalPrompt: "Order 25 ergonomic chairs with lumbar support for floor 3 expand, under ₹12,000 each within 10 days."
  },
  {
    id: "REQ-2026-8940",
    title: "4K UHD 27-inch Dual Monitors",
    itemName: "27-inch 4K IPS Color-Calibrated Displays",
    category: "IT Hardware",
    quantity: 15,
    unitBudget: 28000,
    totalBudget: 420000,
    deliveryDeadlineDays: 5,
    priority: "High",
    status: "Approved",
    date: "2026-08-17",
    requester: "Arun Varma (Design Lead)",
    originalPrompt: "Procure 15 color-accurate 27-inch 4K monitors for the UI design team by Friday."
  },
  {
    id: "REQ-2026-8939",
    title: "Mechanical Wireless Keyboards",
    itemName: "Tactile Silent Wireless Keyboards",
    category: "Peripherals",
    quantity: 40,
    unitBudget: 4500,
    totalBudget: 180000,
    deliveryDeadlineDays: 14,
    priority: "Low",
    status: "Active Analysis",
    date: "2026-08-16",
    requester: "Kavita Reddy (IT Ops)",
    originalPrompt: "40 quiet mechanical wireless keyboards for open-plan workspace."
  },
  {
    id: "REQ-2026-8938",
    title: "Enterprise Server Rack UPS",
    itemName: "3kVA Smart Rackmount UPS Unit",
    category: "Infrastructure",
    quantity: 2,
    unitBudget: 85000,
    totalBudget: 170000,
    deliveryDeadlineDays: 3,
    priority: "Critical",
    status: "Blocked by Policy",
    date: "2026-08-15",
    requester: "DevOps Infrastructure Team",
    originalPrompt: "Urgent 3kVA UPS replacement for Data Center Rack 4 before maintenance window."
  }
];

export const activeRequestDetail = mockRequests[0];
