import logging
from sqlalchemy.orm import Session
from app.db.database import engine, Base, SessionLocal
from app.models.vendor import Vendor
from app.models.policy import PolicyRule

logger = logging.getLogger(__name__)

def seed_db():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    try:
        # Seed Vendors if empty
        if db.query(Vendor).count() == 0:
            vendors = [
                Vendor(
                    vendor_code="VEN-001",
                    name="CompSource Enterprise Ltd.",
                    short_name="CompSource",
                    category="IT Hardware",
                    price=42000.0,
                    delivery_days=5,
                    reliability_score=94.0,
                    seller_rating="⭐ 4.9 (1,420 Enterprise Orders)",
                    warranty_years=3,
                    warranty_text="3 Years Onsite ProSupport",
                    risk_level="Low",
                    risk_score=14.0,
                    stock_available=45,
                    is_active=True,
                    normalized_specs={
                        "ram": "16GB DDR5 4800MHz",
                        "storage": "512GB NVMe Gen4 SSD",
                        "cpu": "Intel Core i5-1345U (10 Cores, 12MB Cache)",
                        "os": "Windows 11 Pro Pre-installed"
                    },
                    risk_breakdown={
                        "priceRisk": {"level": "Low", "score": 8, "note": "Fair market pricing; within historical 3% variance band"},
                        "deliveryRisk": {"level": "Low", "score": 12, "note": "Local warehouse dispatch with 99.2% on-time SLA"},
                        "sellerRisk": {"level": "Very Low", "score": 5, "note": "Tier-1 Certified OEM Gold Partner"},
                        "returnRisk": {"level": "Low", "score": 10, "note": "30-day DOA zero-penalty replacement clause"},
                        "availabilityRisk": {"level": "Low", "score": 15, "note": "45 units confirmed in regional hub inventory"}
                    }
                ),
                Vendor(
                    vendor_code="VEN-002",
                    name="QuickShip Direct Logistics",
                    short_name="QuickShip",
                    category="IT Hardware",
                    price=39000.0,
                    delivery_days=7,
                    reliability_score=63.0,
                    seller_rating="⭐ 3.8 (210 Reviews, 18% Dispute Rate)",
                    warranty_years=1,
                    warranty_text="1 Year Depot Warranty (Excludes Battery)",
                    risk_level="High",
                    risk_score=67.0,
                    stock_available=12,
                    is_active=True,
                    normalized_specs={
                        "ram": "16GB DDR4 3200MHz (Previous Gen)",
                        "storage": "256GB SATA SSD (Below Target)",
                        "cpu": "Intel Core i5-1235U",
                        "os": "DOS / No OS Installed (Policy Non-compliant)"
                    },
                    risk_breakdown={
                        "priceRisk": {"level": "Medium", "score": 38, "note": "Unusually low pricing suggests grey-market component swapping"},
                        "deliveryRisk": {"level": "High", "score": 74, "note": "Frequently misses standard SLA window (average 9.4 days)"},
                        "sellerRisk": {"level": "High", "score": 79, "note": "Unregistered 3rd-party supplier; flagged in 3 recent audit inquiries"},
                        "returnRisk": {"level": "Critical", "score": 92, "note": "15% restocking fee on returns with 45-day RMA processing delay"},
                        "availabilityRisk": {"level": "High", "score": 68, "note": "Only 12 units available; cannot guarantee full batch dispatch"}
                    }
                ),
                Vendor(
                    vendor_code="VEN-003",
                    name="TechnoWorld Wholesale Corp.",
                    short_name="TechnoWorld",
                    category="IT Hardware",
                    price=44000.0,
                    delivery_days=4,
                    reliability_score=91.0,
                    seller_rating="⭐ 4.7 (890 Enterprise Orders)",
                    warranty_years=2,
                    warranty_text="2 Years Standard OEM Warranty",
                    risk_level="Low",
                    risk_score=22.0,
                    stock_available=80,
                    is_active=True,
                    normalized_specs={
                        "ram": "16GB DDR5 4800MHz",
                        "storage": "512GB NVMe SSD",
                        "cpu": "Intel Core i5-1345U",
                        "os": "Windows 11 Pro Pre-installed"
                    },
                    risk_breakdown={
                        "priceRisk": {"level": "Low", "score": 18, "note": "Slightly higher unit cost (+₹2,000/unit) than best offer"},
                        "deliveryRisk": {"level": "Very Low", "score": 6, "note": "Express priority courier partner with 4-day guaranteed ETA"},
                        "sellerRisk": {"level": "Low", "score": 15, "note": "Registered Platinum Supplier in good standing"},
                        "returnRisk": {"level": "Low", "score": 14, "note": "Standard 14-day return policy"},
                        "availabilityRisk": {"level": "Very Low", "score": 4, "note": "80 units available in central warehouse"}
                    }
                )
            ]
            db.add_all(vendors)
            db.commit()
            logger.info("Vendors seeded successfully.")

        # Seed Policies if empty
        if db.query(PolicyRule).count() == 0:
            policies = [
                PolicyRule(
                    policy_code="POL-001",
                    title="Maximum Purchase Authorization Tiering",
                    category="Financial Governance",
                    rule_description="Purchases up to ₹2,00,000 are auto-approved. ₹2,00,001 to ₹5,00,000 require VP sign-off (ESCALATE). Above ₹5,00,000 are strictly blocked (BLOCK).",
                    policy_type="BUDGET_THRESHOLD",
                    threshold_value="200000.0,500000.0",
                    operator="TIERED_BUDGET",
                    impact="Auto-executes ≤₹2L; Requires VP Approval for ₹2L-₹5L; Blocks >₹5L",
                    is_active=True
                ),
                PolicyRule(
                    policy_code="POL-002",
                    title="Vendor Reliability Threshold",
                    category="Quality Assurance",
                    rule_description="Sourced vendor must maintain a historical reliability score of at least 85%. Lower scored vendors are disqualified by Risk Engine.",
                    policy_type="VENDOR_RELIABILITY",
                    threshold_value="85.0",
                    operator="GTE",
                    impact="Disqualifies vendors scoring below 85% to mitigate fulfillment risk",
                    is_active=True
                ),
                PolicyRule(
                    policy_code="POL-003",
                    title="Per-Item Unit Budget Ceiling",
                    category="Cost Control",
                    rule_description="Individual laptop unit cost must not exceed ₹50,000 ceiling without executive waiver.",
                    policy_type="ITEM_BUDGET_CAP",
                    threshold_value="50000.0",
                    operator="LTE",
                    impact="Prevents unit price inflation beyond market baseline",
                    is_active=True
                ),
                PolicyRule(
                    policy_code="POL-004",
                    title="Approved IT Asset Categories",
                    category="Compliance",
                    rule_description="Procurement requests must match whitelisted corporate IT asset catalog categories.",
                    policy_type="APPROVED_CATEGORY",
                    threshold_value="IT Hardware,Enterprise Peripherals,Office Equipment,Network Infrastructure",
                    operator="IN_LIST",
                    impact="Restricts unauthorized procurement categories",
                    is_active=True
                ),
                PolicyRule(
                    policy_code="POL-005",
                    title="Autonomous Negotiation Boundary",
                    category="Pricing Boundary",
                    rule_description="AI Negotiation Agent cannot accept vendor counter-offers that exceed +8% above initial target baseline.",
                    policy_type="NEGOTIATION_TOLERANCE",
                    threshold_value="8.0",
                    operator="LTE",
                    impact="Limits autonomous price concessions to 8% max",
                    is_active=True
                )
            ]
            db.add_all(policies)
            db.commit()
            logger.info("Policies seeded successfully.")

    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
