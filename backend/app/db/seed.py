import logging
import uuid
from typing import List
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.db.database import engine, Base, SessionLocal
from app.models.vendor import Vendor, VendorEvaluation
from app.models.policy import PolicyRule
from app.models.knowledge_base import Product, VendorOffer

logger = logging.getLogger(__name__)

# =====================================================================
# 1. 25 ENTERPRISE VENDORS (Source A: 13 Direct Tier-1, Source B: 12 B2B Marketplace)
# =====================================================================

VENDORS_DATA = [
    # --- SOURCE A: ENTERPRISE DIRECT TIER-1 CATALOG (Preferred, Higher SLA, Onsite Support) ---
    {
        "id": "ven-001-dell-direct",
        "vendor_code": "VEN-001",
        "name": "Dell Direct Enterprise OEM",
        "short_name": "DellDirect",
        "category": "Laptops",
        "price": 43500.0,
        "delivery_days": 4,
        "reliability_score": 96.0,
        "seller_rating": "⭐ 4.9 (2,840 Enterprise Contracts)",
        "warranty_years": 3,
        "warranty_text": "3 Years Onsite ProSupport Plus 24x7",
        "risk_level": "Very Low",
        "risk_score": 8.0,
        "stock_available": 120,
        "region": "India (South - Bengaluru OEM Hub)",
        "source_channel": "Enterprise Direct Tier-1 Catalog",
        "preferred_supplier": True,
        "is_active": True,
        "normalized_specs": {"tier": "Tier-1 Direct OEM", "sla": "24h Onsite Dispatch", "iso_certified": True},
        "risk_breakdown": {
            "priceRisk": {"level": "Low", "score": 8, "note": "Direct OEM benchmark pricing"},
            "deliveryRisk": {"level": "Very Low", "score": 6, "note": "Dedicated enterprise buffer inventory"},
            "sellerRisk": {"level": "Very Low", "score": 4, "note": "Direct OEM manufacturer warranty"},
            "returnRisk": {"level": "Very Low", "score": 5, "note": "30-day DOA immediate replacement clause"},
            "availabilityRisk": {"level": "Very Low", "score": 8, "note": "Priority factory allocation"}
        }
    },
    {
        "id": "ven-002-lenovo-hub",
        "vendor_code": "VEN-002",
        "name": "Lenovo Enterprise Direct Hub",
        "short_name": "LenovoHub",
        "category": "Laptops",
        "price": 44200.0,
        "delivery_days": 5,
        "reliability_score": 95.0,
        "seller_rating": "⭐ 4.8 (1,950 Corporate Deployments)",
        "warranty_years": 3,
        "warranty_text": "3 Years Premier Support Next Business Day",
        "risk_level": "Very Low",
        "risk_score": 10.0,
        "stock_available": 95,
        "region": "India (North - Gurgaon Hub)",
        "source_channel": "Enterprise Direct Tier-1 Catalog",
        "preferred_supplier": True,
        "is_active": True,
        "normalized_specs": {"tier": "Tier-1 Direct OEM", "sla": "Premier Onsite SLA", "iso_certified": True},
        "risk_breakdown": {
            "priceRisk": {"level": "Low", "score": 10, "note": "Standard enterprise contract rates"},
            "deliveryRisk": {"level": "Low", "score": 9, "note": "5-day guaranteed dispatch"},
            "sellerRisk": {"level": "Very Low", "score": 5, "note": "OEM certified direct account"},
            "returnRisk": {"level": "Very Low", "score": 6, "note": "Zero-penalty DOA replacement"},
            "availabilityRisk": {"level": "Low", "score": 10, "note": "Continuous pipeline replenishment"}
        }
    },
    {
        "id": "ven-003-hp-direct",
        "vendor_code": "VEN-003",
        "name": "HP Commercial Direct Sourcing",
        "short_name": "HPDirect",
        "category": "Laptops",
        "price": 44800.0,
        "delivery_days": 4,
        "reliability_score": 94.0,
        "seller_rating": "⭐ 4.8 (1,620 Enterprise Accounts)",
        "warranty_years": 3,
        "warranty_text": "3 Years Care Pack Next Business Day Onsite",
        "risk_level": "Low",
        "risk_score": 12.0,
        "stock_available": 85,
        "region": "India (West - Mumbai Hub)",
        "source_channel": "Enterprise Direct Tier-1 Catalog",
        "preferred_supplier": True,
        "is_active": True,
        "normalized_specs": {"tier": "Tier-1 Direct OEM", "sla": "Care Pack Next-Day", "iso_certified": True},
        "risk_breakdown": {
            "priceRisk": {"level": "Low", "score": 12, "note": "Commercial standard pricing"},
            "deliveryRisk": {"level": "Low", "score": 8, "note": "Air courier priority routing"},
            "sellerRisk": {"level": "Very Low", "score": 6, "note": "HP Enterprise Authorized"},
            "returnRisk": {"level": "Low", "score": 8, "note": "30-day exchange guarantee"},
            "availabilityRisk": {"level": "Low", "score": 11, "note": "Ready stock in Mumbai warehouse"}
        }
    },
    {
        "id": "ven-004-lg-partner",
        "vendor_code": "VEN-004",
        "name": "LG Commercial Display Partner",
        "short_name": "LG Partner",
        "category": "Monitors",
        "price": 18900.0,
        "delivery_days": 3,
        "reliability_score": 96.0,
        "seller_rating": "⭐ 4.9 (2,100 Installations)",
        "warranty_years": 3,
        "warranty_text": "3 Years Commercial Onsite Zero-Bright-Dot",
        "risk_level": "Very Low",
        "risk_score": 7.0,
        "stock_available": 150,
        "region": "India (National Hub - Pune)",
        "source_channel": "Enterprise Direct Tier-1 Catalog",
        "preferred_supplier": True,
        "is_active": True,
        "normalized_specs": {"tier": "Tier-1 Display OEM", "sla": "Onsite Panel Replacement"},
        "risk_breakdown": {
            "priceRisk": {"level": "Low", "score": 7, "note": "Tier-1 display volume pricing"},
            "deliveryRisk": {"level": "Very Low", "score": 5, "note": "Fast 3-day regional delivery"},
            "sellerRisk": {"level": "Very Low", "score": 4, "note": "LG Commercial Direct Partner"},
            "returnRisk": {"level": "Very Low", "score": 5, "note": "Zero bright-pixel guarantee"},
            "availabilityRisk": {"level": "Very Low", "score": 6, "note": "150 units in central stock"}
        }
    },
    {
        "id": "ven-005-compsource",
        "vendor_code": "VEN-005",
        "name": "CompSource Enterprise Solutions",
        "short_name": "CompSource",
        "category": "Laptops",
        "price": 42000.0,
        "delivery_days": 5,
        "reliability_score": 94.0,
        "seller_rating": "⭐ 4.9 (1,420 Enterprise Orders)",
        "warranty_years": 3,
        "warranty_text": "3 Years Onsite ProSupport",
        "risk_level": "Low",
        "risk_score": 14.0,
        "stock_available": 45,
        "region": "India (South - Bengaluru Hub)",
        "source_channel": "Enterprise Direct Tier-1 Catalog",
        "preferred_supplier": True,
        "is_active": True,
        "normalized_specs": {"tier": "Tier-1 System Integrator", "sla": "3-Year ProSupport"},
        "risk_breakdown": {
            "priceRisk": {"level": "Low", "score": 8, "note": "Fair market pricing band"},
            "deliveryRisk": {"level": "Low", "score": 12, "note": "Local warehouse dispatch"},
            "sellerRisk": {"level": "Very Low", "score": 5, "note": "Tier-1 Certified OEM Gold Partner"},
            "returnRisk": {"level": "Low", "score": 10, "note": "30-day DOA replacement clause"},
            "availabilityRisk": {"level": "Low", "score": 15, "note": "45 units confirmed in stock"}
        }
    },
    {
        "id": "ven-006-steelcase-direct",
        "vendor_code": "VEN-006",
        "name": "Steelcase Corporate Direct",
        "short_name": "Steelcase Direct",
        "category": "Office Furniture",
        "price": 32000.0,
        "delivery_days": 6,
        "reliability_score": 97.0,
        "seller_rating": "⭐ 5.0 (3,400 Corporate Fitouts)",
        "warranty_years": 5,
        "warranty_text": "5 Years Structural & Mechanism Lifetime Warranty",
        "risk_level": "Very Low",
        "risk_score": 5.0,
        "stock_available": 70,
        "region": "India (West - Pune Factory Direct)",
        "source_channel": "Enterprise Direct Tier-1 Catalog",
        "preferred_supplier": True,
        "is_active": True,
        "normalized_specs": {"tier": "Tier-1 Ergonomic OEM", "sla": "Onsite Tech Assembly Included"},
        "risk_breakdown": {
            "priceRisk": {"level": "Low", "score": 9, "note": "Premium corporate tier pricing"},
            "deliveryRisk": {"level": "Low", "score": 8, "note": "Palletized protective transport"},
            "sellerRisk": {"level": "Very Low", "score": 3, "note": "Global leader in workspace acoustics & ergonomics"},
            "returnRisk": {"level": "Very Low", "score": 4, "note": "Comprehensive zero-fault policy"},
            "availabilityRisk": {"level": "Low", "score": 8, "note": "70 units ready in warehouse"}
        }
    },
    {
        "id": "ven-007-logitech-commercial",
        "vendor_code": "VEN-007",
        "name": "Logitech Commercial Direct",
        "short_name": "Logitech Direct",
        "category": "Keyboards",
        "price": 3200.0,
        "delivery_days": 3,
        "reliability_score": 96.0,
        "seller_rating": "⭐ 4.9 (4,200 Peripherals Deployed)",
        "warranty_years": 2,
        "warranty_text": "2 Years Commercial Advance Hardware Replacement",
        "risk_level": "Very Low",
        "risk_score": 7.0,
        "stock_available": 300,
        "region": "India (North - Delhi Hub)",
        "source_channel": "Enterprise Direct Tier-1 Catalog",
        "preferred_supplier": True,
        "is_active": True,
        "normalized_specs": {"tier": "Tier-1 Peripheral OEM", "sla": "Advance Replacement"},
        "risk_breakdown": {
            "priceRisk": {"level": "Low", "score": 6, "note": "OEM volume price break"},
            "deliveryRisk": {"level": "Very Low", "score": 4, "note": "3-day guaranteed express"},
            "sellerRisk": {"level": "Very Low", "score": 3, "note": "Global peripheral standard"},
            "returnRisk": {"level": "Very Low", "score": 5, "note": "Advance replacement warranty"},
            "availabilityRisk": {"level": "Very Low", "score": 4, "note": "300+ units in central hub"}
        }
    },
    {
        "id": "ven-008-apple-auth",
        "vendor_code": "VEN-008",
        "name": "Apple Authorized Enterprise Channel",
        "short_name": "Apple Authorized",
        "category": "Laptops",
        "price": 124900.0,
        "delivery_days": 4,
        "reliability_score": 98.0,
        "seller_rating": "⭐ 5.0 (1,800 Mac Deployments)",
        "warranty_years": 3,
        "warranty_text": "3 Years AppleCare+ for Enterprise with Onsite Support",
        "risk_level": "Very Low",
        "risk_score": 6.0,
        "stock_available": 40,
        "region": "India (South - Chennai Hub)",
        "source_channel": "Enterprise Direct Tier-1 Catalog",
        "preferred_supplier": True,
        "is_active": True,
        "normalized_specs": {"tier": "Authorized Direct Partner", "sla": "AppleCare+ 24x7"},
        "risk_breakdown": {
            "priceRisk": {"level": "Low", "score": 10, "note": "Standard Apple Business pricing"},
            "deliveryRisk": {"level": "Very Low", "score": 5, "note": "Dedicated courier fleet"},
            "sellerRisk": {"level": "Very Low", "score": 2, "note": "Direct Apple Enterprise agreement"},
            "returnRisk": {"level": "Very Low", "score": 4, "note": "Apple worldwide warranty"},
            "availabilityRisk": {"level": "Low", "score": 12, "note": "40 units in high-security depot"}
        }
    },
    {
        "id": "ven-009-cisco-enterprise",
        "vendor_code": "VEN-009",
        "name": "Cisco Systems Enterprise Solutions",
        "short_name": "Cisco Enterprise",
        "category": "Servers",
        "price": 340000.0,
        "delivery_days": 7,
        "reliability_score": 97.0,
        "seller_rating": "⭐ 4.9 (850 Data Center Nodes)",
        "warranty_years": 3,
        "warranty_text": "3 Years Cisco Smart Net Total Care 24x7x4 Onsite",
        "risk_level": "Very Low",
        "risk_score": 8.0,
        "stock_available": 15,
        "region": "India (South - Bengaluru DC)",
        "source_channel": "Enterprise Direct Tier-1 Catalog",
        "preferred_supplier": True,
        "is_active": True,
        "normalized_specs": {"tier": "Tier-1 DC OEM", "sla": "Smart Net 4-Hour Response"},
        "risk_breakdown": {
            "priceRisk": {"level": "Low", "score": 8, "note": "Government & Enterprise discount tier"},
            "deliveryRisk": {"level": "Low", "score": 10, "note": "Configured-to-order freight"},
            "sellerRisk": {"level": "Very Low", "score": 3, "note": "Global networking & compute leader"},
            "returnRisk": {"level": "Very Low", "score": 4, "note": "Enterprise hardware RMA"},
            "availabilityRisk": {"level": "Low", "score": 14, "note": "Factory configured chassis"}
        }
    },
    {
        "id": "ven-010-ergopro-direct",
        "vendor_code": "VEN-010",
        "name": "ErgoPro Direct Workplace Ergonomics",
        "short_name": "ErgoPro Direct",
        "category": "Office Furniture",
        "price": 12500.0,
        "delivery_days": 4,
        "reliability_score": 93.0,
        "seller_rating": "⭐ 4.8 (2,700 Ergonomic Deployments)",
        "warranty_years": 3,
        "warranty_text": "3 Years Onsite Mechanical & Gas-Lift Warranty",
        "risk_level": "Low",
        "risk_score": 13.0,
        "stock_available": 110,
        "region": "India (South - Bengaluru Factory)",
        "source_channel": "Enterprise Direct Tier-1 Catalog",
        "preferred_supplier": True,
        "is_active": True,
        "normalized_specs": {"tier": "Direct Ergonomics Manufacturer", "sla": "BIFMA Certified"},
        "risk_breakdown": {
            "priceRisk": {"level": "Low", "score": 10, "note": "Direct factory price with no distributor markup"},
            "deliveryRisk": {"level": "Low", "score": 8, "note": "4-day regional logistics"},
            "sellerRisk": {"level": "Low", "score": 9, "note": "BIFMA certified ergonomics supplier"},
            "returnRisk": {"level": "Low", "score": 8, "note": "30-day comfort trial replacement"},
            "availabilityRisk": {"level": "Very Low", "score": 7, "note": "110 units in direct warehouse"}
        }
    },
    {
        "id": "ven-011-samsung-display",
        "vendor_code": "VEN-011",
        "name": "Samsung Display Solutions Direct",
        "short_name": "Samsung Display",
        "category": "Monitors",
        "price": 19500.0,
        "delivery_days": 4,
        "reliability_score": 95.0,
        "seller_rating": "⭐ 4.8 (1,900 Enterprise Screens)",
        "warranty_years": 3,
        "warranty_text": "3 Years Samsung Business Onsite Panel Cover",
        "risk_level": "Very Low",
        "risk_score": 9.0,
        "stock_available": 130,
        "region": "India (North - Noida Factory)",
        "source_channel": "Enterprise Direct Tier-1 Catalog",
        "preferred_supplier": True,
        "is_active": True,
        "normalized_specs": {"tier": "Tier-1 Display OEM", "sla": "Next Business Day Screen Swap"},
        "risk_breakdown": {
            "priceRisk": {"level": "Low", "score": 8, "note": "Volume commercial price list"},
            "deliveryRisk": {"level": "Very Low", "score": 6, "note": "Direct Noida manufacturing transit"},
            "sellerRisk": {"level": "Very Low", "score": 4, "note": "Samsung Electronics Enterprise"},
            "returnRisk": {"level": "Very Low", "score": 5, "note": "Instant DOA replacement"},
            "availabilityRisk": {"level": "Very Low", "score": 7, "note": "130 units in buffer inventory"}
        }
    },
    {
        "id": "ven-012-caldigit-enterprise",
        "vendor_code": "VEN-012",
        "name": "CalDigit Enterprise Connectivity",
        "short_name": "CalDigit Direct",
        "category": "Docking Stations",
        "price": 18500.0,
        "delivery_days": 4,
        "reliability_score": 96.0,
        "seller_rating": "⭐ 4.9 (1,150 High-Bandwidth Docks)",
        "warranty_years": 2,
        "warranty_text": "2 Years Direct OEM Thunderbolt Replacement",
        "risk_level": "Very Low",
        "risk_score": 9.0,
        "stock_available": 60,
        "region": "India (West - Mumbai Import Hub)",
        "source_channel": "Enterprise Direct Tier-1 Catalog",
        "preferred_supplier": True,
        "is_active": True,
        "normalized_specs": {"tier": "Thunderbolt Certified Partner", "sla": "Commercial Express RMA"},
        "risk_breakdown": {
            "priceRisk": {"level": "Low", "score": 10, "note": "Fixed commercial import price"},
            "deliveryRisk": {"level": "Low", "score": 7, "note": "Pre-cleared bonded warehouse stock"},
            "sellerRisk": {"level": "Very Low", "score": 4, "note": "Intel Thunderbolt certified"},
            "returnRisk": {"level": "Very Low", "score": 6, "note": "Direct swap warranty"},
            "availabilityRisk": {"level": "Low", "score": 10, "note": "60 units verified"}
        }
    },
    {
        "id": "ven-013-featherlite-corporate",
        "vendor_code": "VEN-013",
        "name": "Featherlite Corporate Seating Ltd.",
        "short_name": "Featherlite Direct",
        "category": "Office Furniture",
        "price": 11800.0,
        "delivery_days": 5,
        "reliability_score": 94.0,
        "seller_rating": "⭐ 4.8 (4,100 Workstation Seats)",
        "warranty_years": 3,
        "warranty_text": "3 Years Comprehensive Commercial Warranty",
        "risk_level": "Low",
        "risk_score": 11.0,
        "stock_available": 85,
        "region": "India (South - Chennai Depot)",
        "source_channel": "Enterprise Direct Tier-1 Catalog",
        "preferred_supplier": True,
        "is_active": True,
        "normalized_specs": {"tier": "Tier-1 Seating Manufacturer", "sla": "Corporate Onsite Maintenance"},
        "risk_breakdown": {
            "priceRisk": {"level": "Low", "score": 9, "note": "Contract tier-1 manufacturing rates"},
            "deliveryRisk": {"level": "Low", "score": 9, "note": "Standard 5-day regional road transit"},
            "sellerRisk": {"level": "Very Low", "score": 5, "note": "ISO 9001 & BIFMA compliant facilities"},
            "returnRisk": {"level": "Low", "score": 7, "note": "Full parts replacement guarantee"},
            "availabilityRisk": {"level": "Low", "score": 9, "note": "85 units ready in stock"}
        }
    },

    # --- SOURCE B: B2B MARKETPLACE & OEM AGGREGATOR (Competitive Pricing, Delivery Variance) ---
    {
        "id": "ven-014-technoworld",
        "vendor_code": "VEN-014",
        "name": "TechnoWorld Wholesale Corp.",
        "short_name": "TechnoWorld",
        "category": "Laptops",
        "price": 41200.0,
        "delivery_days": 4,
        "reliability_score": 91.0,
        "seller_rating": "⭐ 4.7 (890 Marketplace Orders)",
        "warranty_years": 2,
        "warranty_text": "2 Years Standard OEM Warranty",
        "risk_level": "Low",
        "risk_score": 22.0,
        "stock_available": 80,
        "region": "India (West - Mumbai Hub)",
        "source_channel": "B2B Marketplace & OEM Aggregator",
        "preferred_supplier": False,
        "is_active": True,
        "normalized_specs": {"channel": "B2B Marketplace Partner", "discount": "Volume Aggregator"},
        "risk_breakdown": {
            "priceRisk": {"level": "Very Low", "score": 5, "note": "Aggressive B2B marketplace discount (-₹2,300/unit)"},
            "deliveryRisk": {"level": "Low", "score": 14, "note": "Multi-vendor logistics courier routing"},
            "sellerRisk": {"level": "Low", "score": 15, "note": "Registered marketplace verified merchant"},
            "returnRisk": {"level": "Low", "score": 14, "note": "Standard 14-day return window"},
            "availabilityRisk": {"level": "Low", "score": 12, "note": "80 units shared with retail channel"}
        }
    },
    {
        "id": "ven-015-itmart",
        "vendor_code": "VEN-015",
        "name": "ITMart B2B Sourcing Solutions",
        "short_name": "ITMart",
        "category": "Laptops",
        "price": 40900.0,
        "delivery_days": 6,
        "reliability_score": 89.0,
        "seller_rating": "⭐ 4.6 (640 Business Orders)",
        "warranty_years": 2,
        "warranty_text": "2 Years Authorized Brand Warranty",
        "risk_level": "Low",
        "risk_score": 24.0,
        "stock_available": 55,
        "region": "India (North - Delhi B2B Market)",
        "source_channel": "B2B Marketplace & OEM Aggregator",
        "preferred_supplier": False,
        "is_active": True,
        "normalized_specs": {"channel": "Spot Market Aggregator", "discount": "Bulk Special"},
        "risk_breakdown": {
            "priceRisk": {"level": "Very Low", "score": 4, "note": "Lowest unit price on marketplace"},
            "deliveryRisk": {"level": "Medium", "score": 26, "note": "6-day road logistics with variable tracking"},
            "sellerRisk": {"level": "Low", "score": 18, "note": "Third-party distributor verification passed"},
            "returnRisk": {"level": "Medium", "score": 20, "note": "15% restocking fee on non-DOA returns"},
            "availabilityRisk": {"level": "Low", "score": 16, "note": "55 units in regional depot"}
        }
    },
    {
        "id": "ven-016-quickship",
        "vendor_code": "VEN-016",
        "name": "QuickShip Enterprise Logistics & Peripherals",
        "short_name": "QuickShip",
        "category": "Laptop Stands",
        "price": 1450.0,
        "delivery_days": 2,
        "reliability_score": 92.0,
        "seller_rating": "⭐ 4.7 (3,800 Swift Dispatches)",
        "warranty_years": 1,
        "warranty_text": "1 Year Express Replacement Warranty",
        "risk_level": "Low",
        "risk_score": 18.0,
        "stock_available": 250,
        "region": "India (National Express Network)",
        "source_channel": "B2B Marketplace & OEM Aggregator",
        "preferred_supplier": False,
        "is_active": True,
        "normalized_specs": {"channel": "Fast-Track Logistics Hub", "speed": "48-Hour SLA"},
        "risk_breakdown": {
            "priceRisk": {"level": "Low", "score": 8, "note": "Competitive accessory pricing"},
            "deliveryRisk": {"level": "Very Low", "score": 4, "note": "Guaranteed 48-hour delivery across metro hubs"},
            "sellerRisk": {"level": "Low", "score": 14, "note": "High volume logistics fulfillment specialist"},
            "returnRisk": {"level": "Low", "score": 12, "note": "Immediate swap for defective units"},
            "availabilityRisk": {"level": "Very Low", "score": 5, "note": "250+ units ready for instant dispatch"}
        }
    },
    {
        "id": "ven-017-displayhub",
        "vendor_code": "VEN-017",
        "name": "DisplayHub India Wholesale",
        "short_name": "DisplayHub",
        "category": "Monitors",
        "price": 18200.0,
        "delivery_days": 5,
        "reliability_score": 90.0,
        "seller_rating": "⭐ 4.6 (1,250 Bulk Screen Shipments)",
        "warranty_years": 2,
        "warranty_text": "2 Years Carry-in Brand Warranty",
        "risk_level": "Low",
        "risk_score": 21.0,
        "stock_available": 65,
        "region": "India (South - Hyderabad Hub)",
        "source_channel": "B2B Marketplace & OEM Aggregator",
        "preferred_supplier": False,
        "is_active": True,
        "normalized_specs": {"channel": "Wholesale Panel Aggregator", "stock": "Spot Allocation"},
        "risk_breakdown": {
            "priceRisk": {"level": "Very Low", "score": 6, "note": "₹700 lower than Tier-1 direct rate"},
            "deliveryRisk": {"level": "Low", "score": 16, "note": "5 business days freight transit"},
            "sellerRisk": {"level": "Low", "score": 16, "note": "Authorized wholesale channel partner"},
            "returnRisk": {"level": "Medium", "score": 22, "note": "Carry-in service required for minor panel issues"},
            "availabilityRisk": {"level": "Low", "score": 15, "note": "65 units in stock"}
        }
    },
    {
        "id": "ven-018-officesupplies-hub",
        "vendor_code": "VEN-018",
        "name": "OfficeSupplies Hub B2B Mart",
        "short_name": "OfficeSupplies Mart",
        "category": "Office Furniture",
        "price": 10500.0,
        "delivery_days": 7,
        "reliability_score": 88.0,
        "seller_rating": "⭐ 4.5 (1,100 Office Bundles)",
        "warranty_years": 2,
        "warranty_text": "2 Years Merchant Parts Warranty",
        "risk_level": "Medium",
        "risk_score": 28.0,
        "stock_available": 40,
        "region": "India (North - Delhi B2B Cluster)",
        "source_channel": "B2B Marketplace & OEM Aggregator",
        "preferred_supplier": False,
        "is_active": True,
        "normalized_specs": {"channel": "Commercial Furniture Aggregator", "assembly": "DIY Flat-Pack"},
        "risk_breakdown": {
            "priceRisk": {"level": "Very Low", "score": 5, "note": "Budget bulk pricing"},
            "deliveryRisk": {"level": "Medium", "score": 28, "note": "7-day transit; assembly not included by default"},
            "sellerRisk": {"level": "Medium", "score": 22, "note": "Mid-tier B2B merchant rating"},
            "returnRisk": {"level": "Medium", "score": 25, "note": "Return shipping costs borne by buyer on remorse"},
            "availabilityRisk": {"level": "Low", "score": 18, "note": "40 units available"}
        }
    },
    {
        "id": "ven-019-primehardware",
        "vendor_code": "VEN-019",
        "name": "PrimeHardware B2B Supply Network",
        "short_name": "PrimeHardware",
        "category": "Docking Stations",
        "price": 17200.0,
        "delivery_days": 4,
        "reliability_score": 91.0,
        "seller_rating": "⭐ 4.7 (950 IT Infrastructure Deals)",
        "warranty_years": 2,
        "warranty_text": "2 Years Authorized Brand Warranty",
        "risk_level": "Low",
        "risk_score": 19.0,
        "stock_available": 50,
        "region": "India (West - Ahmedabad Hub)",
        "source_channel": "B2B Marketplace & OEM Aggregator",
        "preferred_supplier": False,
        "is_active": True,
        "normalized_specs": {"channel": "B2B Peripheral Distributor", "warranty": "Standard OEM"},
        "risk_breakdown": {
            "priceRisk": {"level": "Very Low", "score": 6, "note": "Aggressive wholesale margin"},
            "deliveryRisk": {"level": "Low", "score": 12, "note": "4-day reliable dispatch"},
            "sellerRisk": {"level": "Low", "score": 14, "note": "Registered GST verified business entity"},
            "returnRisk": {"level": "Low", "score": 15, "note": "14-day merchant RMA policy"},
            "availabilityRisk": {"level": "Low", "score": 14, "note": "50 units available"}
        }
    },
    {
        "id": "ven-020-cloudtech",
        "vendor_code": "VEN-020",
        "name": "CloudTech Infrastructure Systems",
        "short_name": "CloudTech Supply",
        "category": "Servers",
        "price": 315000.0,
        "delivery_days": 8,
        "reliability_score": 92.0,
        "seller_rating": "⭐ 4.7 (420 Server Clusters)",
        "warranty_years": 3,
        "warranty_text": "3 Years OEM Hardware Support",
        "risk_level": "Low",
        "risk_score": 19.0,
        "stock_available": 12,
        "region": "India (South - Hyderabad DC)",
        "source_channel": "B2B Marketplace & OEM Aggregator",
        "preferred_supplier": False,
        "is_active": True,
        "normalized_specs": {"channel": "Enterprise Hardware Aggregator", "support": "OEM Backed"},
        "risk_breakdown": {
            "priceRisk": {"level": "Low", "score": 8, "note": "Competitive tender pricing"},
            "deliveryRisk": {"level": "Medium", "score": 22, "note": "8-day configured server burn-in and transit"},
            "sellerRisk": {"level": "Low", "score": 12, "note": "Certified multi-brand enterprise partner"},
            "returnRisk": {"level": "Low", "score": 14, "note": "OEM hardware replacement protocol"},
            "availabilityRisk": {"level": "Medium", "score": 24, "note": "12 units in integration lab"}
        }
    },
    {
        "id": "ven-021-apex-solutions",
        "vendor_code": "VEN-021",
        "name": "Apex Business Solutions India",
        "short_name": "Apex Solutions",
        "category": "Laptops",
        "price": 42500.0,
        "delivery_days": 5,
        "reliability_score": 89.0,
        "seller_rating": "⭐ 4.6 (730 Corporate Shipments)",
        "warranty_years": 2,
        "warranty_text": "2 Years Onsite Next Business Day",
        "risk_level": "Low",
        "risk_score": 23.0,
        "stock_available": 60,
        "region": "India (East - Kolkata Hub)",
        "source_channel": "B2B Marketplace & OEM Aggregator",
        "preferred_supplier": False,
        "is_active": True,
        "normalized_specs": {"channel": "Regional IT Distributor", "warranty": "Onsite 2-Year"},
        "risk_breakdown": {
            "priceRisk": {"level": "Low", "score": 11, "note": "₹1,000 below Tier-1 standard list"},
            "deliveryRisk": {"level": "Low", "score": 16, "note": "5-day dispatch to South/West hubs"},
            "sellerRisk": {"level": "Low", "score": 18, "note": "Established East India distributor"},
            "returnRisk": {"level": "Low", "score": 16, "note": "Standard 15-day DOA policy"},
            "availabilityRisk": {"level": "Low", "score": 14, "note": "60 units ready"}
        }
    },
    {
        "id": "ven-022-megadistributors",
        "vendor_code": "VEN-022",
        "name": "MegaDistributors Commercial Ltd.",
        "short_name": "MegaDistributors",
        "category": "Keyboards",
        "price": 2850.0,
        "delivery_days": 4,
        "reliability_score": 90.0,
        "seller_rating": "⭐ 4.6 (5,100 Accessories)",
        "warranty_years": 1,
        "warranty_text": "1 Year Standard Replacement",
        "risk_level": "Low",
        "risk_score": 20.0,
        "stock_available": 400,
        "region": "India (West - Mumbai Logistics Park)",
        "source_channel": "B2B Marketplace & OEM Aggregator",
        "preferred_supplier": False,
        "is_active": True,
        "normalized_specs": {"channel": "Peripherals Volume Aggregator", "stock": "High Inventory"},
        "risk_breakdown": {
            "priceRisk": {"level": "Very Low", "score": 4, "note": "Deep volume discount tier"},
            "deliveryRisk": {"level": "Low", "score": 12, "note": "4-day national road transit"},
            "sellerRisk": {"level": "Low", "score": 15, "note": "Large-scale peripheral importer"},
            "returnRisk": {"level": "Low", "score": 14, "note": "Batch defect replacement policy"},
            "availabilityRisk": {"level": "Very Low", "score": 3, "note": "400+ units in central warehouse"}
        }
    },
    {
        "id": "ven-023-national-wholesalers",
        "vendor_code": "VEN-023",
        "name": "National IT Wholesalers India",
        "short_name": "National Wholesalers",
        "category": "Monitors",
        "price": 18400.0,
        "delivery_days": 6,
        "reliability_score": 88.0,
        "seller_rating": "⭐ 4.5 (1,450 Displays Sold)",
        "warranty_years": 2,
        "warranty_text": "2 Years Standard OEM Cover",
        "risk_level": "Medium",
        "risk_score": 27.0,
        "stock_available": 75,
        "region": "India (North - Chandigarh Hub)",
        "source_channel": "B2B Marketplace & OEM Aggregator",
        "preferred_supplier": False,
        "is_active": True,
        "normalized_specs": {"channel": "National Wholesale Network", "warranty": "OEM Standard"},
        "risk_breakdown": {
            "priceRisk": {"level": "Low", "score": 7, "note": "Wholesale bulk rate"},
            "deliveryRisk": {"level": "Medium", "score": 24, "note": "6-day transit from North hub"},
            "sellerRisk": {"level": "Low", "score": 19, "note": "Registered national tax compliant distributor"},
            "returnRisk": {"level": "Medium", "score": 22, "note": "Factory authorization required for returns"},
            "availabilityRisk": {"level": "Low", "score": 12, "note": "75 units in stock"}
        }
    },
    {
        "id": "ven-024-fasttrack-tech",
        "vendor_code": "VEN-024",
        "name": "FastTrack Tech Supply Systems",
        "short_name": "FastTrack Supply",
        "category": "Servers",
        "price": 325000.0,
        "delivery_days": 6,
        "reliability_score": 93.0,
        "seller_rating": "⭐ 4.8 (310 High-Density Servers)",
        "warranty_years": 3,
        "warranty_text": "3 Years Next Business Day Onsite",
        "risk_level": "Low",
        "risk_score": 16.0,
        "stock_available": 10,
        "region": "India (South - Chennai Tech Park)",
        "source_channel": "B2B Marketplace & OEM Aggregator",
        "preferred_supplier": False,
        "is_active": True,
        "normalized_specs": {"channel": "System Integration Partner", "sla": "NBD Onsite"},
        "risk_breakdown": {
            "priceRisk": {"level": "Low", "score": 9, "note": "Competitive server pricing with custom RAID prep"},
            "deliveryRisk": {"level": "Low", "score": 14, "note": "6-day pre-tested server delivery"},
            "sellerRisk": {"level": "Low", "score": 11, "note": "Enterprise datacenter solution provider"},
            "returnRisk": {"level": "Low", "score": 12, "note": "Onsite component replacement"},
            "availabilityRisk": {"level": "Medium", "score": 20, "note": "10 nodes ready for provisioning"}
        }
    },
    {
        "id": "ven-025-metro-ergo",
        "vendor_code": "VEN-025",
        "name": "Metro Ergonomics B2B Hub",
        "short_name": "Metro Ergonomics",
        "category": "Office Furniture",
        "price": 11200.0,
        "delivery_days": 5,
        "reliability_score": 90.0,
        "seller_rating": "⭐ 4.6 (1,850 Workspaces Sourced)",
        "warranty_years": 3,
        "warranty_text": "3 Years Brand Onsite Warranty",
        "risk_level": "Low",
        "risk_score": 20.0,
        "stock_available": 60,
        "region": "India (South - Bengaluru)",
        "source_channel": "B2B Marketplace & OEM Aggregator",
        "preferred_supplier": False,
        "is_active": True,
        "normalized_specs": {"channel": "Ergonomic Furniture Aggregator", "rating": "BIFMA Level 2"},
        "risk_breakdown": {
            "priceRisk": {"level": "Low", "score": 8, "note": "Competitive mid-tier corporate pricing"},
            "deliveryRisk": {"level": "Low", "score": 14, "note": "5-day local delivery with installation assistance"},
            "sellerRisk": {"level": "Low", "score": 16, "note": "Certified ergonomics aggregator"},
            "returnRisk": {"level": "Low", "score": 15, "note": "Replacement of damaged parts within 72h"},
            "availabilityRisk": {"level": "Low", "score": 12, "note": "60 units ready in warehouse"}
        }
    }
]

# =====================================================================
# 2. 120 REALISTIC CURATED PRODUCTS ACROSS 8 CATEGORIES (15 per category)
# =====================================================================

PRODUCTS_DATA = [
    # --- CATEGORY 1: LAPTOPS (15 items) ---
    {
        "code": "PROD-LAP-001", "name": "Dell Latitude 5440 14\" Enterprise Laptop",
        "category": "Laptops", "brand": "Dell", "model": "Latitude 5440", "base_price": 43500.0,
        "description": "Enterprise standard laptop with Intel Core i5-1345U, 16GB DDR5 RAM, 512GB NVMe SSD, 14\" FHD IPS Anti-Glare display, Windows 11 Pro.",
        "specs": {"cpu": "Intel Core i5-1345U", "ram": "16GB DDR5 4800MHz", "storage": "512GB NVMe SSD", "display": "14\" FHD (1920x1080) IPS", "battery": "54Wh ExpressCharge"},
        "features": ["vPro Enterprise", "Thunderbolt 4", "FHD IR Camera", "Wi-Fi 6E", "Fingerprint Reader"]
    },
    {
        "code": "PROD-LAP-002", "name": "Lenovo ThinkPad T14 Gen 4 Business Laptop",
        "category": "Laptops", "brand": "Lenovo", "model": "ThinkPad T14 Gen 4", "base_price": 46000.0,
        "description": "Military-spec durable business laptop with AMD Ryzen 5 PRO 7540U, 16GB LPDDR5x, 512GB PCIe Gen4 SSD, 14\" WUXGA IPS, Win 11 Pro.",
        "specs": {"cpu": "AMD Ryzen 5 PRO 7540U", "ram": "16GB LPDDR5x", "storage": "512GB PCIe Gen4 SSD", "display": "14\" WUXGA (1920x1200) 16:10", "battery": "52.5Wh"},
        "features": ["TrackPoint", "MIL-STD 810H", "dTPM 2.0", "PrivacyGuard", "Wi-Fi 6E"]
    },
    {
        "code": "PROD-LAP-003", "name": "HP EliteBook 840 G10 Enterprise Laptop",
        "category": "Laptops", "brand": "HP", "model": "EliteBook 840 G10", "base_price": 45500.0,
        "description": "Sleek aluminum corporate laptop with Intel Core i5-1335U, 16GB DDR5, 512GB SSD, 14\" WUXGA Anti-Glare, HP Wolf Pro Security.",
        "specs": {"cpu": "Intel Core i5-1335U", "ram": "16GB DDR5", "storage": "512GB NVMe SSD", "display": "14\" WUXGA 400 nits IPS", "battery": "51Wh Fast Charge"},
        "features": ["HP Wolf Security", "5MP IR Camera", "Bang & Olufsen Audio", "Backlit Spill-Resistant Keyboard"]
    },
    {
        "code": "PROD-LAP-004", "name": "Apple MacBook Pro 14\" M3 Enterprise Edition",
        "category": "Laptops", "brand": "Apple", "model": "MacBook Pro 14 M3", "base_price": 124900.0,
        "description": "High performance workstation laptop with Apple M3 (8-core CPU, 10-core GPU), 18GB Unified Memory, 512GB SSD, Liquid Retina XDR.",
        "specs": {"cpu": "Apple M3 Chip", "ram": "18GB Unified Memory", "storage": "512GB High-Speed SSD", "display": "14.2\" Liquid Retina XDR (3024x1964) 120Hz", "battery": "70Wh (22h battery)"},
        "features": ["Liquid Retina XDR", "ProMotion 120Hz", "MagSafe 3", "Thunderbolt / USB 4", "Touch ID"]
    },
    {
        "code": "PROD-LAP-005", "name": "Lenovo ThinkPad E14 Gen 5 Commercial Laptop",
        "category": "Laptops", "brand": "Lenovo", "model": "ThinkPad E14 Gen 5", "base_price": 41500.0,
        "description": "Value-engineered corporate workhorse with AMD Ryzen 5 7530U, 16GB RAM, 512GB SSD, 14\" IPS FHD display.",
        "specs": {"cpu": "AMD Ryzen 5 7530U", "ram": "16GB DDR4", "storage": "512GB SSD", "display": "14\" FHD IPS 300 nits", "battery": "47Wh"},
        "features": ["Alloy Top Cover", "Full-Size Ergonomic Keyboard", "Dolby Atmos Audio", "USB-C Power Delivery"]
    },
    {
        "code": "PROD-LAP-006", "name": "Asus ExpertBook B9 Ultralight Business Laptop",
        "category": "Laptops", "brand": "Asus", "model": "ExpertBook B9 B9400", "base_price": 48000.0,
        "description": "Ultra-lightweight 880g enterprise laptop with Intel Core i7-1255U, 16GB RAM, 1TB SSD, 66Wh long-life battery.",
        "specs": {"cpu": "Intel Core i7-1255U", "ram": "16GB LPDDR5", "storage": "1TB NVMe PCIe 4.0", "display": "14\" FHD Anti-Glare", "weight": "880g"},
        "features": ["Magnesium-Lithium Alloy", "NumberPad in Touchpad", "AI Noise-Canceling", "Quad Microphones"]
    },
    {
        "code": "PROD-LAP-007", "name": "Dell XPS 15 9530 Executive Laptop",
        "category": "Laptops", "brand": "Dell", "model": "XPS 15 9530", "base_price": 98000.0,
        "description": "Executive creator and executive laptop with Intel Core i7-13700H, RTX 4050 6GB, 32GB DDR5, 1TB SSD, 15.6\" 3.5K OLED Touch.",
        "specs": {"cpu": "Intel Core i7-13700H", "gpu": "NVIDIA RTX 4050 6GB", "ram": "32GB DDR5 4800MHz", "storage": "1TB Gen4 SSD", "display": "15.6\" 3.5K (3456x2160) OLED"},
        "features": ["InfinityEdge Display", "CNC Aluminum & Carbon Fiber", "Quad Speaker Design", "Waves Nx 3D Audio"]
    },
    {
        "code": "PROD-LAP-008", "name": "HP ProBook 450 G10 15.6\" Corporate Laptop",
        "category": "Laptops", "brand": "HP", "model": "ProBook 450 G10", "base_price": 42000.0,
        "description": "Full-size enterprise laptop with numeric keypad, Intel Core i5-1335U, 16GB RAM, 512GB SSD, 15.6\" FHD IPS display.",
        "specs": {"cpu": "Intel Core i5-1335U", "ram": "16GB DDR4", "storage": "512GB NVMe SSD", "display": "15.6\" FHD IPS Anti-Glare", "battery": "51.3Wh"},
        "features": ["Numeric Keypad", "HP Sure Sense", "Durable Aluminum Chassis", "Wi-Fi 6E"]
    },
    {
        "code": "PROD-LAP-009", "name": "Lenovo Yoga Pro 7 Slim Business Notebook",
        "category": "Laptops", "brand": "Lenovo", "model": "Yoga Pro 7 14", "base_price": 54000.0,
        "description": "Sleek professional laptop with AMD Ryzen 7 7735HS, 16GB LPDDR5, 512GB SSD, 14.5\" 2.5K 90Hz IPS Display.",
        "specs": {"cpu": "AMD Ryzen 7 7735HS", "ram": "16GB LPDDR5", "storage": "512GB SSD", "display": "14.5\" 2.5K (2560x1600) 90Hz 100% sRGB", "battery": "73Wh"},
        "features": ["TUV Low Blue Light", "Premium All-Metal Chassis", "Dual Mic Array", "Rapid Charge Express"]
    },
    {
        "code": "PROD-LAP-010", "name": "Acer TravelMate P6 Commercial Grade Laptop",
        "category": "Laptops", "brand": "Acer", "model": "TravelMate P6", "base_price": 43000.0,
        "description": "Ultra-portable corporate laptop with Intel Core i5-1245U, 16GB RAM, 512GB SSD, 14\" FHD IPS, 1kg ultra-light design.",
        "specs": {"cpu": "Intel Core i5-1245U", "ram": "16GB LPDDR4X", "storage": "512GB Gen4 SSD", "display": "14\" FHD IPS Narrow Bezel", "weight": "1.0kg"},
        "features": ["Acer Dust Defender", "MIL-STD 810H Certified", "Smart Card Reader", "Acer User Sensing"]
    },
    {
        "code": "PROD-LAP-011", "name": "Dell Precision 3581 Mobile Workstation",
        "category": "Laptops", "brand": "Dell", "model": "Precision 3581", "base_price": 78000.0,
        "description": "ISV Certified engineering workstation with Intel Core i7-13700H, NVIDIA RTX A1000 6GB, 32GB DDR5, 1TB NVMe, 15.6\" FHD.",
        "specs": {"cpu": "Intel Core i7-13700H (14-Core)", "gpu": "NVIDIA RTX A1000 6GB", "ram": "32GB DDR5 4800MHz", "storage": "1TB Gen4 SSD", "display": "15.6\" FHD 100% sRGB"},
        "features": ["ISV Certification for AutoCAD/SolidWorks", "Dell Optimizer for Precision", "Advanced Thermals", "ExpressCharge 97Wh"]
    },
    {
        "code": "PROD-LAP-012", "name": "Apple MacBook Air 13\" M2 Corporate Bundle",
        "category": "Laptops", "brand": "Apple", "model": "MacBook Air 13 M2", "base_price": 89000.0,
        "description": "Fanless ultra-thin laptop with Apple M2 chip, 16GB Unified Memory, 512GB SSD, 13.6\" Liquid Retina, MagSafe 3.",
        "specs": {"cpu": "Apple M2 (8-Core CPU, 10-Core GPU)", "ram": "16GB Unified Memory", "storage": "512GB SSD", "display": "13.6\" Liquid Retina 500 nits", "battery": "52.6Wh (18h battery)"},
        "features": ["Silent Fanless Architecture", "MagSafe 3 Charging", "1080p FaceTime HD Camera", "Four-Speaker Sound System"]
    },
    {
        "code": "PROD-LAP-013", "name": "HP ZBook Power G10 Mobile Workstation",
        "category": "Laptops", "brand": "HP", "model": "ZBook Power G10", "base_price": 82000.0,
        "description": "Engineering and 3D modeling power with AMD Ryzen 7 PRO 7840HS, NVIDIA RTX 2000 Ada 8GB, 32GB DDR5, 1TB NVMe, 15.6\" QHD.",
        "specs": {"cpu": "AMD Ryzen 7 PRO 7840HS", "gpu": "NVIDIA RTX 2000 Ada 8GB", "ram": "32GB DDR5 5600MHz", "storage": "1TB PCIe Gen4 SSD", "display": "15.6\" QHD (2560x1440) 300 nits"},
        "features": ["HP Z Central Remote Boost", "ISV Certified", "Spill-Resistant Backlit Keyboard", "Vapor Chamber Cooling"]
    },
    {
        "code": "PROD-LAP-014", "name": "Lenovo ThinkPad X1 Carbon Gen 11 Flagship",
        "category": "Laptops", "brand": "Lenovo", "model": "ThinkPad X1 Carbon Gen 11", "base_price": 115000.0,
        "description": "Ultralight carbon-fiber flagship business laptop with Intel Core i7-1365U vPro, 32GB LPDDR5, 1TB SSD, 14\" 2.8K OLED Display.",
        "specs": {"cpu": "Intel Core i7-1365U vPro", "ram": "32GB LPDDR5 6400MHz", "storage": "1TB Gen4 NVMe", "display": "14\" 2.8K (2880x1800) OLED 400 nits", "weight": "1.12kg"},
        "features": ["Carbon-Fiber & Magnesium Weave", "Computer Vision Presence Detect", "Quad 360-degree Mics", "Dolby Atmos"]
    },
    {
        "code": "PROD-LAP-015", "name": "Asus ZenBook Pro 14 OLED Business Creator",
        "category": "Laptops", "brand": "Asus", "model": "ZenBook Pro 14 OLED", "base_price": 88000.0,
        "description": "Compact creator laptop with Intel Core i7-13700H, RTX 4060, 16GB DDR5, 1TB SSD, 14.5\" 2.8K 120Hz OLED touch display.",
        "specs": {"cpu": "Intel Core i7-13700H", "gpu": "NVIDIA RTX 4060 8GB", "ram": "16GB DDR5", "storage": "1TB SSD", "display": "14.5\" 2.8K 120Hz OLED 0.2ms Pantone"},
        "features": ["ASUS DialPad", "Pantone Validated Color", "Harman Kardon Audio", "Wi-Fi 6E"]
    },

    # --- CATEGORY 2: MONITORS (15 items) ---
    {
        "code": "PROD-MON-001", "name": "LG 27UK850-W 27\" 4K UHD USB-C IPS Monitor",
        "category": "Monitors", "brand": "LG", "model": "27UK850-W", "base_price": 18900.0,
        "description": "Professional 27-inch 4K UHD (3840x2160) IPS monitor with HDR10, USB Type-C 60W power delivery, sRGB 99%, ergonomic stand.",
        "specs": {"resolution": "3840x2160 (4K UHD)", "panel": "IPS Anti-Glare", "refresh_rate": "60Hz", "ports": "USB-C 60W, 2x HDMI 2.0, DisplayPort 1.2, 2x USB 3.0", "stand": "Height/Tilt/Pivot Adjustable"},
        "features": ["USB-C Single Cable Solution", "HDR10 Support", "99% sRGB Color Calibrated", "Ergonomic Pivot/Height Stand", "AMD FreeSync"]
    },
    {
        "code": "PROD-MON-002", "name": "Dell UltraSharp U2724D 27\" QHD IPS Black Monitor",
        "category": "Monitors", "brand": "Dell", "model": "UltraSharp U2724D", "base_price": 24500.0,
        "description": "Premier productivity display with IPS Black technology (2000:1 contrast), 2560x1440 QHD, 120Hz refresh, ComfortView Plus.",
        "specs": {"resolution": "2560x1440 (QHD)", "panel": "IPS Black (2000:1 Contrast)", "refresh_rate": "120Hz", "ports": "DisplayPort 1.4, HDMI 2.1, USB-C Upstream, 4x USB-A 10Gbps", "color": "100% sRGB, 98% DCI-P3"},
        "features": ["IPS Black Technology", "120Hz Refresh Rate", "Built-in Ambient Light Sensor", "Daisy Chaining DisplayPort Out"]
    },
    {
        "code": "PROD-MON-003", "name": "Samsung ViewFinity S8 32\" 4K Professional Monitor",
        "category": "Monitors", "brand": "Samsung", "model": "ViewFinity S8 32", "base_price": 28000.0,
        "description": "Large-format 32-inch 4K UHD matte display, 98% DCI-P3, USB-C 90W charging, Ethernet LAN pass-through, UL Matte certification.",
        "specs": {"resolution": "3840x2160 (4K UHD)", "panel": "IPS Matte Display", "ports": "USB-C 90W, RJ45 LAN, DisplayPort, HDMI, USB 3.0 Hub", "brightness": "350 cd/m2"},
        "features": ["90W USB-C Power Delivery", "Matte Glare-Free Display", "Integrated Ethernet RJ45", "Auto Source Switch+"]
    },
    {
        "code": "PROD-MON-004", "name": "BenQ PD2705U 27\" 4K Designer & CAD Monitor",
        "category": "Monitors", "brand": "BenQ", "model": "PD2705U", "base_price": 29500.0,
        "description": "CalMAN and Pantone validated 27\" 4K UHD display with KVM switch, Hotkey Puck G2, USB-C 65W, specialized CAD/CAM modes.",
        "specs": {"resolution": "3840x2160 (4K UHD)", "panel": "IPS 10-Bit Color", "ports": "USB-C 65W, HDMI 2.0, DisplayPort 1.4, KVM USB Hub", "accuracy": "Delta E <= 3.0"},
        "features": ["Hardware KVM Switch", "Hotkey Puck G2 Controller", "CAD/CAM & Darkroom Mode", "DualView Split Screen"]
    },
    {
        "code": "PROD-MON-005", "name": "HP E27 G5 27\" FHD Ergonomic Business Monitor",
        "category": "Monitors", "brand": "HP", "model": "E27 G5", "base_price": 14500.0,
        "description": "Corporate standard 27-inch 1080p FHD IPS monitor, 75Hz refresh, 4-way ergonomic adjustability, HP Eye Ease low blue light.",
        "specs": {"resolution": "1920x1080 (FHD)", "panel": "IPS Anti-Glare", "refresh_rate": "75Hz", "ports": "DisplayPort 1.2, HDMI 1.4, 4x USB-A 3.2 Gen1 Hub", "stand": "Tilt, Swivel, Pivot, 150mm Height"},
        "features": ["Always-On Low Blue Light (HP Eye Ease)", "4-Port USB Hub", "3-Sided Micro-Edge Bezel", "Energy Star Certified"]
    },
    {
        "code": "PROD-MON-006", "name": "LG 34WN80C-B 34\" 21:9 UltraWide Curved Monitor",
        "category": "Monitors", "brand": "LG", "model": "34WN80C-B", "base_price": 38000.0,
        "description": "Ultrawide 34-inch WQHD (3440x1440) curved IPS screen with USB Type-C 60W, sRGB 99%, HDR10, dual controller support.",
        "specs": {"resolution": "3440x1440 (UltraWide QHD)", "aspect_ratio": "21:9", "curve": "1900R", "ports": "USB-C 60W, 2x HDMI, DisplayPort, 2x USB 3.0", "color": "sRGB 99%"},
        "features": ["21:9 Panoramic Screen Real Estate", "USB-C Connectivity", "OnScreen Control with Screen Split", "Dual Controller PBP"]
    },
    {
        "code": "PROD-MON-007", "name": "Dell P2422H 24\" Corporate Workhorse Monitor",
        "category": "Monitors", "brand": "Dell", "model": "P2422H", "base_price": 11500.0,
        "description": "Dependable 23.8-inch Full HD (1080p) IPS corporate display with comprehensive connectivity, ComfortView Plus, 4-way stand.",
        "specs": {"resolution": "1920x1080 (FHD)", "panel": "IPS", "ports": "DisplayPort, HDMI, VGA, 4x SuperSpeed USB 5Gbps", "bezel": "Ultrathin Three-Sided"},
        "features": ["ComfortView Plus TUV Certified", "VGA Legacy & DisplayPort Modern", "Compact Base Design", "Dell Display Manager Easy Arrange"]
    },
    {
        "code": "PROD-MON-008", "name": "ASUS ProArt PA278CV 27\" Color Accurate QHD",
        "category": "Monitors", "brand": "ASUS", "model": "ProArt PA278CV", "base_price": 22500.0,
        "description": "Factory calibrated (Delta E < 2) 27-inch 2560x1440 QHD IPS display, 100% sRGB/Rec.709, USB-C 65W, DisplayPort daisy-chaining.",
        "specs": {"resolution": "2560x1440 (QHD)", "panel": "IPS 75Hz FreeSync", "ports": "USB-C 65W, DisplayPort In/Out (Daisy Chain), HDMI, 4x USB 3.1", "calibration": "Calman Verified"},
        "features": ["Calman Verified Delta E < 2", "DisplayPort Daisy Chaining", "ProArt Preset & Palette", "Ergonomic Stand"]
    },
    {
        "code": "PROD-MON-009", "name": "Samsung Odyssey G5 27\" 165Hz QHD Display",
        "category": "Monitors", "brand": "Samsung", "model": "Odyssey G5 27", "base_price": 16500.0,
        "description": "High-refresh 27-inch 1440p QHD display with 165Hz refresh rate, 1ms response time, 1000R curvature, HDR10.",
        "specs": {"resolution": "2560x1440 (QHD)", "panel": "VA 1000R Deep Curve", "refresh_rate": "165Hz", "response_time": "1ms (MPRT)", "ports": "DisplayPort 1.2, HDMI 2.0"},
        "features": ["165Hz Fast Refresh", "1000R Human Eye Curvature", "AMD FreeSync Premium", "HDR10 High Dynamic Range"]
    },
    {
        "code": "PROD-MON-010", "name": "Philips 276E8VJSB 27\" 4K IPS Value Display",
        "category": "Monitors", "brand": "Philips", "model": "276E8VJSB", "base_price": 17200.0,
        "description": "High resolution 27-inch 4K UHD (3840x2160) IPS panel with 1.07 billion colors, MultiView PIP/PBP, ultra-narrow borders.",
        "specs": {"resolution": "3840x2160 (4K UHD)", "panel": "IPS 10-Bit Color", "ports": "DisplayPort 1.2, 2x HDMI 2.0, Audio Out", "brightness": "350 cd/m2"},
        "features": ["MultiView Active Dual Connect", "Flicker-Free Technology", "LowBlue Mode", "Ultra Narrow Border"]
    },
    {
        "code": "PROD-MON-011", "name": "ViewSonic VG2755-2K 27\" Ergonomic QHD",
        "category": "Monitors", "brand": "ViewSonic", "model": "VG2755-2K", "base_price": 21000.0,
        "description": "Advanced enterprise ergonomic monitor with 2560x1440 QHD IPS panel, USB Type-C 60W, client-mount compatible stand, Eco-mode.",
        "specs": {"resolution": "2560x1440 (QHD)", "panel": "SuperClear IPS", "ports": "USB-C 60W, DisplayPort, HDMI, 3x USB 3.1", "stand": "40-degree Tilt, Bi-directional Pivot"},
        "features": ["Integrated Client Mount for Thin Clients", "USB-C Video/Data/Power", "vDisplayManager Software", "Energy Star Certified"]
    },
    {
        "code": "PROD-MON-012", "name": "Lenovo ThinkVision T27i-30 27\" FHD Display",
        "category": "Monitors", "brand": "Lenovo", "model": "ThinkVision T27i-30", "base_price": 13800.0,
        "description": "Corporate standard 27-inch 1920x1080 FHD IPS monitor, 99% sRGB, 4x USB-A 3.2 Gen1 hub, Natural Low Blue Light technology.",
        "specs": {"resolution": "1920x1080 (FHD)", "panel": "IPS 3-Side NearEdgeless", "ports": "VGA, HDMI 1.4, DisplayPort 1.2, 4x USB 3.2 Gen1 Hub", "stand": "Full Function Ergonomic"},
        "features": ["Natural Low Blue Light (no yellow tint)", "Phone Holder in Base", "ThinkCentre Tiny Bar Support", "RoHS Compliant"]
    },
    {
        "code": "PROD-MON-013", "name": "Dell UltraSharp U3223QE 32\" 4K USB-C Hub Display",
        "category": "Monitors", "brand": "Dell", "model": "UltraSharp U3223QE", "base_price": 54000.0,
        "description": "Flagship 31.5-inch 4K UHD IPS Black monitor with 90W USB-C, RJ45 LAN, built-in KVM switch, 2000:1 contrast, HDR400.",
        "specs": {"resolution": "3840x2160 (4K UHD)", "panel": "IPS Black (2000:1)", "ports": "USB-C 90W, RJ45 Ethernet, DisplayPort In/Out, HDMI, 5x USB-A 10Gbps, USB-C Data Hub", "kvm": "Auto KVM"},
        "features": ["Built-in KVM Switch (Control 2 PCs with 1 Keyboard/Mouse)", "RJ45 Wired Ethernet Hub", "IPS Black Deep Contrast", "VESA DisplayHDR 400"]
    },
    {
        "code": "PROD-MON-014", "name": "LG 24MP400-B 24\" FHD Standard Corporate Monitor",
        "category": "Monitors", "brand": "LG", "model": "24MP400-B", "base_price": 8500.0,
        "description": "Budget corporate 23.8-inch FHD (1920x1080) IPS display with 75Hz refresh, AMD FreeSync, Reader Mode, wall-mountable.",
        "specs": {"resolution": "1920x1080 (FHD)", "panel": "IPS", "refresh_rate": "75Hz", "ports": "HDMI, D-Sub (VGA)", "vesa": "75x75mm"},
        "features": ["Reader Mode & Flicker Safe", "AMD FreeSync", "OnScreen Control", "Smart Energy Saving"]
    },
    {
        "code": "PROD-MON-015", "name": "Acer Vero BR277 27\" Eco-Friendly Business Display",
        "category": "Monitors", "brand": "Acer", "model": "Vero BR277", "base_price": 12900.0,
        "description": "Sustainable 27-inch FHD IPS monitor manufactured from 85% PCR plastic, 100% recyclable packaging, TCO and EPEAT Gold certified.",
        "specs": {"resolution": "1920x1080 (FHD)", "panel": "IPS 75Hz", "ports": "DisplayPort, HDMI, VGA, Audio In/Out", "sustainability": "85% Post-Consumer Recycled"},
        "features": ["EPEAT Gold & TCO Certified", "Acer VisionCare 2.0", "ErgoStand Full Adjustment", "Eco-Conscious Packaging"]
    },

    # --- CATEGORY 3: KEYBOARDS (15 items) ---
    {
        "code": "PROD-KB-001", "name": "Logitech MX Keys S Advanced Wireless Keyboard",
        "category": "Keyboards", "brand": "Logitech", "model": "MX Keys S", "base_price": 9500.0,
        "description": "Master series low-profile wireless keyboard with smart backlighting, spherically-dished keys, Bluetooth + Logi Bolt, multi-OS.",
        "specs": {"connectivity": "Bluetooth Low Energy & Logi Bolt USB", "layout": "Full Size with Numpad", "battery": "USB-C Rechargeable (up to 5 months)", "weight": "810g"},
        "features": ["Smart Illumination with Hand Proximity", "Easy-Switch Multi-Device (Up to 3 Devices)", "Smart Actions Automation", "Logi Options+ Support"]
    },
    {
        "code": "PROD-KB-002", "name": "Keychron K2 Wireless Mechanical Keyboard (Hot-Swap)",
        "category": "Keyboards", "brand": "Keychron", "model": "K2 Version 2", "base_price": 7200.0,
        "description": "Compact 75% layout mechanical keyboard with Gateron G Pro Brown tactile switches, Bluetooth 5.1 & wired USB-C, Mac/Win keys.",
        "specs": {"connectivity": "Bluetooth 5.1 & Type-C Wired", "layout": "75% (84 Keys)", "switches": "Gateron G Pro Mechanical (Hot-Swappable)", "battery": "4000mAh Lithium-ion"},
        "features": ["Hot-Swappable Switch Sockets", "Dedicated Mac & Windows Keycaps", "Multi-Device Bluetooth 5.1", "RGB / White Backlight Options"]
    },
    {
        "code": "PROD-KB-003", "name": "Dell Premier Multi-Device Wireless Keyboard KB700",
        "category": "Keyboards", "brand": "Dell", "model": "KB700", "base_price": 4500.0,
        "description": "Full-sized slim premium scissor-switch keyboard with dual-mode RF 2.4GHz + Bluetooth 5.0, 36-month battery life.",
        "specs": {"connectivity": "2.4GHz RF & Bluetooth 5.0 (3 Devices)", "layout": "Full Size", "battery": "2x AAA (Up to 36 Months)", "keys": "Scissor Keys"},
        "features": ["12 Programmable Keys", "Dell Peripheral Manager Integration", "AES-128 Bit Hardware Encryption", "3-Device Fast Switch"]
    },
    {
        "code": "PROD-KB-004", "name": "Lenovo Professional Bluetooth Wireless Keyboard",
        "category": "Keyboards", "brand": "Lenovo", "model": "Professional BT Keyboard", "base_price": 3200.0,
        "description": "Classic ThinkPad-inspired full size corporate keyboard with dedicated media keys, Bluetooth 5.0, spill-resistant design.",
        "specs": {"connectivity": "Bluetooth 5.0", "layout": "Full Size 3-Zone", "battery": "2x AA Batteries", "key_travel": "2.5mm Island Keys"},
        "features": ["Spill Resistant Architecture", "Dedicated One-Touch Media Controls", "LED Indicators for Caps/NumLock", "ThinkPad Sculpted Keycaps"]
    },
    {
        "code": "PROD-KB-005", "name": "Corsair K70 Enterprise Silent Mechanical Keyboard",
        "category": "Keyboards", "brand": "Corsair", "model": "K70 Enterprise Silent", "base_price": 8800.0,
        "description": "Durable brushed aluminum frame keyboard with Cherry MX Silent Red switches for quiet open-office typing, USB passthrough.",
        "specs": {"connectivity": "USB Type-A Braided", "switches": "Cherry MX Silent Red (Linear & Ultra-Quiet)", "frame": "Anodized Aircraft-Grade Aluminum", "polling": "1000Hz"},
        "features": ["Ultra-Quiet Dampened Switches for Offices", "Dedicated Volume Roller & Media Keys", "Detachable Soft-Touch Wrist Rest", "PBT Double-Shot Keycaps"]
    },
    {
        "code": "PROD-KB-006", "name": "HP 450 Programmable Wireless Keyboard",
        "category": "Keyboards", "brand": "HP", "model": "HP 450 Wireless", "base_price": 2800.0,
        "description": "Enterprise sanitized-wipeable keyboard with 20+ programmable shortcut keys, 2.4GHz nano receiver, 20+ month battery life.",
        "specs": {"connectivity": "2.4GHz Wireless Nano USB", "layout": "Full-Size Ergonomic", "battery": "2x AAA", "cleaning": "Sanitizable with Alcohol Wipes"},
        "features": ["Disinfectable & Wipe-Clean Tested", "20+ Customizable Fn Shortcuts", "Comfortable Contoured Keycaps", "Low Battery LED Alert"]
    },
    {
        "code": "PROD-KB-007", "name": "Logitech Wave Keys Wireless Ergonomic Keyboard",
        "category": "Keyboards", "brand": "Logitech", "model": "Wave Keys", "base_price": 6900.0,
        "description": "Ergonomist-approved wave-shaped keyboard with integrated memory foam palm rest, compact footprint, Bluetooth and Logi Bolt.",
        "specs": {"connectivity": "Bluetooth Low Energy + Logi Bolt", "design": "Wave Ergonomic Layout", "wrist_rest": "3-Layer Cushioned Palm Rest", "battery": "2x AAA (36 Months)"},
        "features": ["US Ergonomics Certified Wave Design", "Memory Foam Deep Cushion Rest", "Easy-Switch Multi-OS Support", "Quiet Low-Friction Typing"]
    },
    {
        "code": "PROD-KB-008", "name": "Microsoft Ergonomic Keyboard for Business",
        "category": "Keyboards", "brand": "Microsoft", "model": "Ergonomic Desktop Keyboard", "base_price": 5200.0,
        "description": "Split-key layout ergonomic keyboard with dedicated Office 365, emoji, and multimedia keys, cushioned palm rest.",
        "specs": {"connectivity": "USB 2.0 Wired", "layout": "Split Keypad & Curved Arc", "wrist_rest": "Padded Fabric Palm Rest", "dimensions": "487 x 262 x 60 mm"},
        "features": ["Split & Sloped Ergonomic Architecture", "Natural Hand & Wrist Alignment", "Dedicated Microsoft 365 Shortcuts", "Built-In Palm Lift Riser"]
    },
    {
        "code": "PROD-KB-009", "name": "Apple Magic Keyboard with Touch ID & Numeric Keypad",
        "category": "Keyboards", "brand": "Apple", "model": "Magic Keyboard with Touch ID", "base_price": 16500.0,
        "description": "Sleek aluminum Mac keyboard with integrated Touch ID biometric authentication, full numeric keypad, USB-C to Lightning.",
        "specs": {"connectivity": "Bluetooth & Lightning/USB-C Wired", "layout": "Full Size with Number Pad", "biometrics": "Touch ID Sensor", "battery": "Internal Rechargeable Lithium-ion"},
        "features": ["Fast Biometric Touch ID Login", "Ultra-Low Scissor Mechanism", "Instant Automatic Mac Pairing", "Full Document Navigation Controls"]
    },
    {
        "code": "PROD-KB-010", "name": "Razer BlackWidow Lite Silent Business Mechanical Keyboard",
        "category": "Keyboards", "brand": "Razer", "model": "BlackWidow Lite", "base_price": 6200.0,
        "description": "Tenkeyless compact mechanical keyboard equipped with Razer Orange tactile switches and sound-dampening O-rings.",
        "specs": {"connectivity": "Detachable Braided Micro-USB", "layout": "Tenkeyless (TKL 87-Key)", "switches": "Razer Orange Tactile Silent", "lighting": "Individually Backlit White LED"},
        "features": ["Pre-Installed Sound Dampening O-Rings", "Clean White Minimalist Backlighting", "80 Million Keystroke Durability", "Razer Synapse Cloud Profiles"]
    },
    {
        "code": "PROD-KB-011", "name": "Logitech K380 Multi-Device Bluetooth Keyboard",
        "category": "Keyboards", "brand": "Logitech", "model": "K380 Multi-Device", "base_price": 2400.0,
        "description": "Ultra-portable minimalist Bluetooth keyboard that connects to 3 devices simultaneously (laptops, tablets, phones).",
        "specs": {"connectivity": "Bluetooth 3.0 (3 Channels)", "layout": "Compact Scoop Keys", "battery": "2x AAA (24 Months)", "weight": "423g"},
        "features": ["Ultra-Lightweight & Mobile", "Scooped Scissor Keys", "Automatic OS Key Mapping", "Easy-Switch Instant Pairing"]
    },
    {
        "code": "PROD-KB-012", "name": "Anker Full-Size Bluetooth Wireless Keyboard",
        "category": "Keyboards", "brand": "Anker", "model": "A7726 Full-Size", "base_price": 2100.0,
        "description": "Slim aluminum-finish Bluetooth keyboard with numeric keypad, quiet low-profile scissor keys, 6-month rechargeable battery.",
        "specs": {"connectivity": "Bluetooth 4.2", "layout": "Full Size with Numpad", "battery": "Rechargeable via Micro-USB", "finish": "Matte Aluminum Gray"},
        "features": ["Low-Profile Silent Keystrokes", "Full Number Pad for Financials", "Auto-Sleep Power Saving", "Cross-Platform Compatible"]
    },
    {
        "code": "PROD-KB-013", "name": "Lenovo ThinkPad TrackPoint Keyboard II",
        "category": "Keyboards", "brand": "Lenovo", "model": "TrackPoint Keyboard II", "base_price": 8900.0,
        "description": "Iconic ThinkPad typing experience with integrated red TrackPoint navigation nub, eliminating the need for an external mouse.",
        "specs": {"connectivity": "Bluetooth 5.0 & 2.4GHz Wireless USB", "layout": "ThinkPad Compact", "navigation": "Integrated Optical TrackPoint", "battery": "USB-C Rechargeable (2 Months)"},
        "features": ["Integrated Red TrackPoint & Mouse Buttons", "Dish-Shaped ThinkPad Key Architecture", "Swift Pair Bluetooth Support", "6-Point Entry Keycaps"]
    },
    {
        "code": "PROD-KB-014", "name": "Dell Pro Wireless Keyboard and Mouse KM5221W",
        "category": "Keyboards", "brand": "Dell", "model": "KM5221W Combo", "base_price": 2600.0,
        "description": "Reliable corporate wireless keyboard and 4000 DPI optical mouse combo, 2.4GHz RF nano dongle, 36-month battery life.",
        "specs": {"connectivity": "2.4GHz RF USB Dongle", "keyboard_layout": "Full Size with Number Pad", "mouse_dpi": "Up to 4000 DPI Adjustable", "battery": "36 Months (Keyboard & Mouse)"},
        "features": ["Plug-and-Play Single Receiver Combo", "Spill Resistant Keybed", "12 Programmable Keys", "Dell Peripheral Manager Ready"]
    },
    {
        "code": "PROD-KB-015", "name": "Keychron Q1 Pro Custom Wireless Mechanical Keyboard",
        "category": "Keyboards", "brand": "Keychron", "model": "Q1 Pro Wireless", "base_price": 15500.0,
        "description": "CNC full-aluminum custom mechanical keyboard with double-gasket design, QMK/VIA programmable, hot-swappable Keychron K Pro switches.",
        "specs": {"connectivity": "Bluetooth 5.1 & Type-C Wired", "body": "Full CNC 6063 Aluminum", "layout": "75% Exploded with Rotary Knob", "switches": "Keychron K Pro Banana/Red (Pre-Lubed)"},
        "features": ["Double-Gasket Acoustic Mount", "Fully Programmable QMK/VIA", "Programmable Aluminum Rotary Knob", "Acoustic Sound Absorbing Foams"]
    },

    # --- CATEGORY 4: OFFICE FURNITURE / CHAIRS (15 items) ---
    {
        "code": "PROD-CHR-001", "name": "ErgoPro High-Back Breathable Mesh Executive Chair",
        "category": "Office Furniture", "brand": "ErgoPro", "model": "ErgoPro High-Back Mesh", "base_price": 12500.0,
        "description": "High-back ergonomic task chair with 2D adjustable lumbar support, 3D armrests, heavy-duty Class-4 gas lift, 135-degree tilt lock.",
        "specs": {"material": "High-Density Breathable Korean Mesh", "lumbar": "2D Height & Depth Adjustable", "armrests": "3D (Height, Angle, Fore/Aft)", "gas_lift": "Class 4 BIFMA Certified (150kg)", "tilt": "Synchro-Tilt 90-135 Deg"},
        "features": ["BIFMA & ISO 9001 Certified", "Dynamic Self-Adjusting Lumbar", "Breathable Zero-Heat Mesh", "Silent PU Caster Wheels", "Integrated Adjustable Headrest"]
    },
    {
        "code": "PROD-CHR-002", "name": "Steelcase Gesture Ergonomic Executive Chair",
        "category": "Office Furniture", "brand": "Steelcase", "model": "Gesture Executive", "base_price": 32000.0,
        "description": "World-class ergonomic chair designed for digital device postures, Core Equalizer lumbar support, 360-degree rotating arms.",
        "specs": {"mechanism": "LiveBack Technology", "armrests": "360-Degree Gesture Arms", "seat_depth": "Adjustable Passive Edge Seat", "weight_capacity": "180kg"},
        "features": ["Core Equalizer Lumbar Pressure Support", "360-Degree Arm Movement Matching Smartphone/Laptop Use", "Cradle-to-Cradle Certified", "Adaptive Seat Perimeter"]
    },
    {
        "code": "PROD-CHR-003", "name": "Featherlite Helix High-Back Ergonomic Office Chair",
        "category": "Office Furniture", "brand": "Featherlite", "model": "Helix High-Back", "base_price": 11800.0,
        "description": "Commercial high-back mesh chair with self-calibrating weight-sensing mechanism, adjustable headrest, molded foam seat.",
        "specs": {"mechanism": "Self-Calibrating Synchro Tilt", "base": "Nylon Reinforced 5-Star Base", "seat": "High Resilience Molded Foam", "certification": "BIFMA Level 2"},
        "features": ["Weight-Activated Auto Recline Tension", "Waterfall Seat Edge to Promote Blood Flow", "Adjustable 2D Lumbar Pad", "Multi-Position Tilt Lock"]
    },
    {
        "code": "PROD-CHR-004", "name": "Green Soul Monster Ultimate Ergonomic Gaming/Work Chair",
        "category": "Office Furniture", "brand": "Green Soul", "model": "Monster Ultimate T", "base_price": 14500.0,
        "description": "Spacious heavy-duty multi-functional chair with cold-cure molded foam, magnetic memory foam head pillow, 4D armrests.",
        "specs": {"material": "Spill-Proof Premium Fabric / PU Leather", "foam": "Cold-Cured High Density Sponge", "armrests": "4D Metal Core", "recline": "180 Degree Flat Recline"},
        "features": ["Magnetic Snap-On Memory Foam Neck Pillow", "180-Degree Deep Rest Recline", "Heavy Duty Metal Wheelbase", "Adjustable Inbuilt Lumbar System"]
    },
    {
        "code": "PROD-CHR-005", "name": "Herman Miller Aeron Ergonomic Chair (Certified Commercial)",
        "category": "Office Furniture", "brand": "Herman Miller", "model": "Aeron Remastered", "base_price": 68000.0,
        "description": "Iconic posture-perfect office chair with 8Z Pellicle elastomeric suspension, PostureFit SL sacral support, forward tilt.",
        "specs": {"material": "8Z Pellicle Breathable Elastomer", "posture": "PostureFit SL Dual Pad", "tilt": "Harmonic 2 Tilt with Forward Lean", "sizes": "Size B (Medium) / Size C (Large)"},
        "features": ["8Z Pellicle 8-Zone Tension Suspension", "PostureFit SL Spine Stabilizer", "Forward 5-Degree Working Tilt", "12-Year 24/7 Multi-Shift Warranty"]
    },
    {
        "code": "PROD-CHR-006", "name": "SmartDesk Pro 120 Motorized Standing Desk (120x60cm)",
        "category": "Office Furniture", "brand": "ErgoPro", "model": "SmartDesk Pro 120", "base_price": 21500.0,
        "description": "Dual-motor electric height adjustable standing desk with 4 memory presets, anti-collision sensor, solid engineered wood top.",
        "specs": {"motors": "Dual Heavy-Duty Silent Motors (<45dB)", "height_range": "71cm - 119cm (Smooth Lift)", "load_capacity": "120kg", "desktop": "120cm x 60cm Laminated Maple"},
        "features": ["4-Level Digital Memory Preset Controller", "Active Anti-Collision Obstacle Sensor", "Integrated Cable Management Tray", "Heavy Gauge Steel Telescopic Frame"]
    },
    {
        "code": "PROD-CHR-007", "name": "Fezibo Dual-Motor Electric Standing Desk 140x70cm",
        "category": "Office Furniture", "brand": "Fezibo", "model": "Fezibo Dual 140", "base_price": 24800.0,
        "description": "Spacious motorized sit-stand desk with dual drawer storage, integrated lockable casters, 3 memory height buttons.",
        "specs": {"motors": "Dual Synchronized Motors", "height_range": "69cm - 118cm", "load_capacity": "100kg", "desktop": "140cm x 70cm Walnut Finish"},
        "features": ["Dual Integrated Storage Drawers", "Lockable Swivel Casters & Glides Included", "Under-Desk Cable Concealment", "Soft Start/Stop Technology"]
    },
    {
        "code": "PROD-CHR-008", "name": "Featherlite Contact Executive High-Back Leather Chair",
        "category": "Office Furniture", "brand": "Featherlite", "model": "Contact Executive", "base_price": 18500.0,
        "description": "Executive boardroom chair upholstered in bonded breathable leather with polished chrome accents, knee-tilt mechanism.",
        "specs": {"material": "Bonded Breathable Leatherette", "mechanism": "Knee-Tilt Multi-Lock Mechanism", "base": "Die-Cast Polished Aluminum Base", "arms": "Chrome Padded Fixed Arms"},
        "features": ["Knee-Tilt Ergonomics for Executive Desks", "Polished Die-Cast Aluminum Base", "Plush Double-Layer Cushioning", "Executive 5-Year Frame Warranty"]
    },
    {
        "code": "PROD-CHR-009", "name": "Godrej Interio Motion High-Back Synchronized Chair",
        "category": "Office Furniture", "brand": "Godrej Interio", "model": "Motion High-Back", "base_price": 13200.0,
        "description": "Active responsive work chair that flexes with bodily micro-movements, 3D armrests, responsive lumbar contour.",
        "specs": {"mechanism": "Dynamic Synchronous Tilt", "mesh": "High Resilience Polyester Mesh", "gas_lift": "Class 4", "certification": "GreenGuard Gold Certified"},
        "features": ["Dynamic Flex-Back Movement", "GreenGuard Gold Indoor Air Quality", "Adjustable Height Lumbar Pad", "Anti-Friction Twin Wheel Casters"]
    },
    {
        "code": "PROD-CHR-010", "name": "ErgoSmart Lumbar Support Medium-Back Task Chair",
        "category": "Office Furniture", "brand": "ErgoPro", "model": "ErgoSmart Task", "base_price": 7800.0,
        "description": "Compact and cost-effective mid-back office chair with fixed lumbar arch, breathable mesh back, pneumatic height adjust.",
        "specs": {"type": "Mid-Back Task Chair", "cushion": "High Density Molded Polyurethane", "gas_lift": "Class 3 Pneumatic", "base": "Nylon 5-Star Base"},
        "features": ["Compact Ergonomic Profile", "Spill-Resistant Mesh Fabric", "Smooth 360-Degree Swivel", "Easy 10-Minute Toolless Assembly"]
    },
    {
        "code": "PROD-CHR-011", "name": "Duramont Ergonomic Mesh Recliner Office Chair",
        "category": "Office Furniture", "brand": "Duramont", "model": "Duramont Pro Recliner", "base_price": 16900.0,
        "description": "Fully adjustable task chair with pull-out retractable footrest, 155-degree deep tilt, lumbar depth adjustment wheel.",
        "specs": {"recline": "90 to 155 Degrees Locking", "footrest": "Padded Extendable Metal Rail", "lumbar": "Rotary Dial Depth & Height Knob", "load": "150kg"},
        "features": ["Extendable Padded Retractable Footrest", "Precision Rotary Lumbar Dial", "Heavy-Duty Rollerblade Style Wheels", "Extra-Thick Seat Cushion"]
    },
    {
        "code": "PROD-CHR-012", "name": "Steelcase Series 2 Ergonomic Mesh Office Chair",
        "category": "Office Furniture", "brand": "Steelcase", "model": "Series 2 Task", "base_price": 22000.0,
        "description": "Engineered corporate task chair with AirBack technology, weight-activated synchro mechanism, 4D adjustable arms.",
        "specs": {"technology": "AirBack Geometric Spine Support", "armrests": "4D (Height, Width, Pivot, Depth)", "seat": "Adaptive Bolstering Seat Foam", "warranty": "Steelcase 12-Year"},
        "features": ["AirBack Geometric Responsive Flex", "Weight-Activated Mechanism (No Manual Knob Needed)", "Compact Corporate Footprint", "100% Recyclable Design"]
    },
    {
        "code": "PROD-CHR-013", "name": "Royal Ergonomics Executive Full Grain Leather Recliner",
        "category": "Office Furniture", "brand": "Royal Ergonomics", "model": "Presidential Leather", "base_price": 27500.0,
        "description": "Presidential high-back executive chair crafted with top-grain leather, mahogany finished base accents, ergonomic lumbar bulge.",
        "specs": {"material": "Top-Grain Italian Leather", "frame": "Hardwood & Reinforced Steel", "mechanism": "Heavy-Duty Relax Knee-Tilt", "base": "Reinforced Chrome with Mahogany Caps"},
        "features": ["Supple Top-Grain Breathable Leather", "Padded Pillowtop Head & Lumbar Zones", "Substantial 200kg Load Certification", "Heavy-Duty Double Caster Assembly"]
    },
    {
        "code": "PROD-CHR-014", "name": "Autonomous ErgoChair Pro Executive Mesh Chair",
        "category": "Office Furniture", "brand": "Autonomous", "model": "ErgoChair Pro", "base_price": 23500.0,
        "description": "Modern Scandinavian-designed ergonomic chair with 22-degree recline lock across 5 positions, flexible lumbar support, woven TPE mesh.",
        "specs": {"positions": "5 Lockable Recline Angles", "lumbar": "Spring-Loaded Adaptive Lumbar", "material": "100% Earth-Friendly TPE & Mesh", "capacity": "135kg"},
        "features": ["Scandinavian Aesthetic Architecture", "Spring-Loaded Responsive Lumbar Cushion", "Fully Adjustable Headrest Angle", "Forward Seat Incline Feature"]
    },
    {
        "code": "PROD-CHR-015", "name": "Wipro Furniture Adapt High-Back Commercial Chair",
        "category": "Office Furniture", "brand": "Wipro", "model": "Adapt High-Back", "base_price": 10900.0,
        "description": "Standard corporate enterprise task chair with synchronised multi-lock mechanism, adjustable armrests, fire-retardant mesh.",
        "specs": {"mechanism": "Syncro Multi-Lock with Tension Control", "mesh": "FR Grade Breathable Mesh", "gas_lift": "Class 4 Standard", "certification": "BIFMA Level 3"},
        "features": ["Fire-Retardant Fabric & Mesh Certification", "Integrated Lumbar Curve Support", "Nylon Fiber Body with Scratch Resistance", "Smooth Carpet Casters"]
    },

    # --- CATEGORY 5: LAPTOP STANDS (15 items) ---
    {
        "code": "PROD-STD-001", "name": "Nexstand K2 Portable Adjustable Laptop Stand",
        "category": "Laptop Stands", "brand": "Nexstand", "model": "K2 Foldable", "base_price": 1250.0,
        "description": "Ultra-lightweight 240g folding laptop stand with 8 height levels, universal fit for 11\" to 17.3\" laptops, carrying pouch included.",
        "specs": {"weight": "240g", "height_settings": "8 Levels (14cm to 32cm)", "material": "Industrial Grade Reinforced Polymer", "compatibility": "11\" to 17.3\" Laptops"},
        "features": ["Folds in 1 Second into Compact Baton", "8 Ergonomic Height & Angle Adjustments", "Increases Airflow by 95%", "Anti-Skid Silicone Grip Pads"]
    },
    {
        "code": "PROD-STD-002", "name": "Roost V3 Ultra-Light Folding Laptop Stand",
        "category": "Laptop Stands", "brand": "Roost", "model": "Roost V3", "base_price": 4200.0,
        "description": "Premium ultra-compact portable laptop stand engineered in USA with structural delrin polymer, 3 height settings, pivoting grips.",
        "specs": {"weight": "170g", "height_settings": "3 Height Levels (15cm, 21cm, 27cm)", "material": "Structural Delrin & Anodized Aluminum", "folded_size": "3.3 x 3.0 x 33 cm"},
        "features": ["World's Lightest High-Elevation Stand", "Patented Pivoting Clamps Lock Laptop In Place", "One-Hand Quick Deploy Mechanism", "Prevents Neck & Cervical Strain"]
    },
    {
        "code": "PROD-STD-003", "name": "Rain Design mStand Aluminum Desktop Stand",
        "category": "Laptop Stands", "brand": "Rain Design", "model": "mStand 10032", "base_price": 3800.0,
        "description": "Solid single-piece sandblasted aluminum stand that elevates laptop screen by 150mm for perfect eye-level posture and cooling.",
        "specs": {"material": "Solid Sandblasted Anodized Aluminum (Unibody)", "elevation": "150mm Fixed Height", "cable_routing": "Rear Teardrop Cable Pass-Through", "weight": "1.36kg"},
        "features": ["Single-Piece Unibody Heat-Sink Aluminum", "Raises Screen to Eye Level Matching External Monitors", "Keyboard Stash Space Underneath", "Matches MacBook Space Gray & Silver"]
    },
    {
        "code": "PROD-STD-004", "name": "ErgoRiser 360 Rotating Heavy Duty Metal Stand",
        "category": "Laptop Stands", "brand": "ErgoPro", "model": "ErgoRiser 360", "base_price": 2400.0,
        "description": "Dual-hinge height adjustable aluminum laptop stand with 360-degree rotating base for instant screen sharing in meetings.",
        "specs": {"rotation": "360-Degree Swivel Base with Audible Click", "hinges": "Dual Tight-Tension Steel Hinges (Supports 10kg)", "material": "Solid Aviation Aluminum", "cooling": "Large Ventilated Cutout Base"},
        "features": ["360-Degree Swivel Base for Collaborative Work", "Dual-Axis Infinite Height & Tilt Angle", "Heavy Weighted Non-Slip Anti-Wobble Base", "Thick Non-Scratch Protective Silicone Pads"]
    },
    {
        "code": "PROD-STD-005", "name": "Portronics My Buddy Hexa Foldable Stand with Phone Holder",
        "category": "Laptop Stands", "brand": "Portronics", "model": "My Buddy Hexa", "base_price": 699.0,
        "description": "Cost-effective 12-level adjustable ABS desk riser with 360-degree rotating turntable base and flip-out smartphone holder.",
        "specs": {"material": "Tough ABS Plastic & Silicone Rubber", "height_settings": "12 Adjustable Angles", "phone_holder": "Dual Side Flip-Out Phone Cradle", "load": "Up to 5kg"},
        "features": ["Integrated Pull-Out Smartphone Holder", "Bottom Rotating Turntable", "Foldable Flat for Laptop Bags", "Hollow Hexagonal Air Cooling Vents"]
    },
    {
        "code": "PROD-STD-006", "name": "Baseus Dual-Slot Vertical Laptop Desktop Stand",
        "category": "Laptop Stands", "brand": "Baseus", "model": "Dual-Slot Vertical Stand", "base_price": 1850.0,
        "description": "Space-saving vertical aluminum dock stand capable of holding two laptops/tablets upright in clamshell mode simultaneously.",
        "specs": {"slots": "Dual Adjustable Width Slots (1.4cm - 4.0cm)", "material": "Precision CNC Anodized Aluminum", "base": "Weighted Anti-Tip Silicone Base", "screws": "Tool-Free Bottom Adjustment Dial"},
        "features": ["Organizes Desk Clamshell Setup with External Monitors", "Dual Slot for Laptop + iPad/Tablet", "Protective Internal Rubber Lining", "Maximizes Workspace Desk Surface"]
    },
    {
        "code": "PROD-STD-007", "name": "Nillkin Bolster Portable Zinc Alloy Kickstand Feet",
        "category": "Laptop Stands", "brand": "Nillkin", "model": "Bolster Stand Feet", "base_price": 850.0,
        "description": "Pair of ultra-slim adhesive zinc-alloy kickstands that attach directly to the bottom of any laptop for an instant 12-degree typing lift.",
        "specs": {"material": "Electroplated Zinc Alloy", "angle": "12-Degree Ergonomic Incline", "attachment": "Reusable Non-Residue Nano Adhesive", "thickness": "4.8mm Ultra-Slim"},
        "features": ["Sticks Inconspicuously Under Laptop Chassis", "Instant Typing Lift & Natural Wrist Angle", "Aero Ventilation Channel Under Fans", "Supports Heavy 16\" Laptops Up to 15kg"]
    },
    {
        "code": "PROD-STD-008", "name": "OMOTON Ergonomic Desktop Stand with Cable Management",
        "category": "Laptop Stands", "brand": "OMOTON", "model": "LD02 Desktop Riser", "base_price": 1950.0,
        "description": "Detachable 3-piece heavy duty aluminum laptop elevator designed for maximum stability with zero desk vibrations.",
        "specs": {"material": "4mm Thick Sandblasted Aluminum", "elevation": "15cm Ergonomic Rise", "compatibility": "10\" - 16\" Laptops", "structure": "Detachable 3-Piece Assembly"},
        "features": ["Rock-Solid Zero-Flex Typing Stability", "All-Around Heat Dissipation Architecture", "Non-Slip Silicone Hooks", "Integrated Cable Collector Hook"]
    },
    {
        "code": "PROD-STD-009", "name": "Soundance Aluminum Laptop Elevator with Cooling Flow",
        "category": "Laptop Stands", "brand": "Soundance", "model": "ALS-01 Elevator", "base_price": 1650.0,
        "description": "Classic minimalist desktop elevator raising the laptop 15cm off the table to alleviate eye and neck fatigue.",
        "specs": {"material": "Thickened Aluminum Alloy", "elevation": "150mm Fixed Height", "load": "Supports Up to 8.8 lbs (4kg)", "color": "Space Gray"},
        "features": ["Clean Single-Hook Protective Lip", "Open Bottom for Full Air Circulation", "Easy Snap-Fit 3-Part Assembly", "Anti-Scratch Rubber Coating on Contact Points"]
    },
    {
        "code": "PROD-STD-010", "name": "UGREEN Foldable X-Stand Aluminum Travel Riser",
        "category": "Laptop Stands", "brand": "UGREEN", "model": "LP310 Foldable X", "base_price": 1400.0,
        "description": "Compact foldable scissor X-frame stand made of aerospace grade aluminum with 5 height adjustments (86mm to 131mm).",
        "specs": {"material": "Aerospace Grade Aluminum Alloy", "height_settings": "5 Height Levels", "folded_dimensions": "25 x 4.5 x 1.5 cm", "weight": "220g"},
        "features": ["Folds into Slim Travel Pouch", "5 Adjustable Eye-Level Ergonomic Settings", "Anti-Slip Triangular Support Structure", "Protects Laptop Finish with Full Silicone Pads"]
    },
    {
        "code": "PROD-STD-011", "name": "BoYata Adjustable Heavy Duty Ergonomic Laptop Riser",
        "category": "Laptop Stands", "brand": "BoYata", "model": "BoYata N21 Z-Type", "base_price": 2900.0,
        "description": "Heavy-duty Z-type adjustable laptop stand supporting up to 20kg with dual-spring tension joints and ventilated holes.",
        "specs": {"joint_tension": "Dual Ultra-Tight Spring Steel Tension Joints", "max_height": "Up to 30cm Elevation", "load": "Tested Up to 20kg", "material": "Reinforced Aluminum Plate"},
        "features": ["Z-Type Dual Arm Infinite Elevation & Tilt", "Can Be Used as a Quick Standing Desk Riser", "Ventilation Flow Holes Prevent Throttling", "Sturdy Typing Without Any Screen Bounce"]
    },
    {
        "code": "PROD-STD-012", "name": "Tukzer Heavy Duty Aluminum Stand with Mouse Pad Extension",
        "category": "Laptop Stands", "brand": "Tukzer", "model": "TZ-LS-04", "base_price": 1750.0,
        "description": "Multi-function aluminum desktop stand with detachable side mouse tray and 6 multi-angle incline notches.",
        "specs": {"material": "Aluminum Alloy + ABS Components", "side_tray": "Attachable Right/Left Mouse Tray", "angles": "6 Ergonomic Locking Slots", "portability": "Collapsible Flat"},
        "features": ["Detachable Mouse Extension Plate", "Dual Front Retention Stoppers", "Folds Completely Flat for Briefcases", "Wide Surface Fits Laptops Up to 17.3 Inches"]
    },
    {
        "code": "PROD-STD-013", "name": "Twelve South Curve Desktop Stand for Laptops",
        "category": "Laptop Stands", "brand": "Twelve South", "model": "Curve Black", "base_price": 4500.0,
        "description": "Designer flowing curved matte black aluminum stand that lifts laptop screen 165mm while leaving 70% of the base exposed for cooling.",
        "specs": {"finish": "Matte Black Powder-Coated Metal", "elevation": "165mm Fixed Height", "design": "Minimalist Sculptural Curve", "weight": "650g"},
        "features": ["Sculptural Flowing Studio Aesthetic", "Exposes 70% of Base for Maximum Cooling", "Allows One-Handed Screen Opening", "Non-Slip Silicone Grip Ring"]
    },
    {
        "code": "PROD-STD-014", "name": "Spigen LD202 Ergonomic Aluminum Desk Stand",
        "category": "Laptop Stands", "brand": "Spigen", "model": "LD202 Universal", "base_price": 2100.0,
        "description": "Precision chamfered aluminum stand with anti-skid rubber feet, rear cable organizer slot, and open cooling pass-through.",
        "specs": {"material": "Premium Anodized Aluminum with Diamond-Cut Edges", "tilt": "15-Degree Optimum Typing Angle", "elevation": "140mm Elevation", "cable_hole": "Rear Cable Channel"},
        "features": ["Diamond-Cut Polished Chamfered Edges", "Cable Pass-Through Keeps Desk Wire-Free", "Matches Corporate Enterprise Workstations", "Heavy Anti-Vibration Footpads"]
    },
    {
        "code": "PROD-STD-015", "name": "Gizga Essentials Multi-Angle Foldable Metal Stand",
        "category": "Laptop Stands", "brand": "Gizga", "model": "Essentials LS-01", "base_price": 999.0,
        "description": "Sturdy 6-level adjustable steel laptop stand that collapses into a slim stick, fits effortlessly into standard backpack pockets.",
        "specs": {"material": "High-Strength Steel Alloy", "angles": "6 Incline Levels (15 to 45 Degrees)", "folded_size": "24 x 4.5 cm", "weight": "260g"},
        "features": ["Budget Corporate Accessory Standard", "6 Incline Angle Positions", "Sturdy Double Triangular Load Structure", "Carrying Velvet Pouch Included"]
    },

    # --- CATEGORY 6: MICE & PERIPHERALS (15 items) ---
    {
        "code": "PROD-MOU-001", "name": "Logitech MX Master 3S Advanced Wireless Performance Mouse",
        "category": "Mice", "brand": "Logitech", "model": "MX Master 3S", "base_price": 8900.0,
        "description": "Flagship wireless performance mouse with 8K DPI any-surface glass tracking, Quiet Click switches, MagSpeed electromagnetic wheel.",
        "specs": {"sensor": "Darkfield 8000 DPI (Tracks on Glass)", "scroll": "MagSpeed Electromagnetic (1000 Lines/Sec)", "connectivity": "Bluetooth Low Energy + Logi Bolt USB", "battery": "USB-C Rechargeable (70 Days)"},
        "features": ["Quiet Clicks with 90% Noise Reduction", "MagSpeed Scroll Wheel", "Thumbwheel & Gesture Button", "Multi-Device Easy-Switch with Flow Cross-Computer Control"]
    },
    {
        "code": "PROD-MOU-002", "name": "Dell Premier Rechargeable Wireless Mouse MS7421W",
        "category": "Mice", "brand": "Dell", "model": "MS7421W Premier", "base_price": 3800.0,
        "description": "Rechargeable multi-device mouse with 4000 DPI sensor, dual-mode 2.4GHz + Bluetooth 5.0, up to 6 months battery per charge.",
        "specs": {"dpi": "1000, 1600, 2400, 4000 Adjustable DPI", "connectivity": "2.4GHz RF & Bluetooth 5.0 (3 Devices)", "battery": "USB-C Fast Rechargeable (6 Months)", "buttons": "7 Programmable Buttons"},
        "features": ["USB-C Quick Charging (2 Minutes gives Full Day)", "Connects to 3 Devices with One-Touch Switch", "Dell Peripheral Manager Customization", "Symmetrical Sculpted Grip"]
    },
    {
        "code": "PROD-MOU-003", "name": "HP 930 Creator Wireless Bluetooth Mouse",
        "category": "Mice", "brand": "HP", "model": "930 Creator Mouse", "base_price": 4200.0,
        "description": "Ergonomic creator mouse with 7 programmable buttons, hyper-fast scroll wheel, multi-OS Bluetooth + 2.4GHz USB nano receiver.",
        "specs": {"sensor": "Track-on-Glass Optical Sensor (Up to 3000 DPI)", "connectivity": "Connects to up to 3 Devices (Dongle + 2x BT)", "battery": "USB-C Rechargeable (Up to 12 Weeks)", "buttons": "7 Programmable Buttons"},
        "features": ["Hyper-Fast Free-Spinning Scroll Wheel", "Tracks on Any Surface Including Glass", "Comfortable Ergonomic Thumb Rest", "Customizable Gestures via HP Accessory Center"]
    },
    {
        "code": "PROD-MOU-004", "name": "Lenovo Go Wireless Multi-Device Mouse",
        "category": "Mice", "brand": "Lenovo", "model": "Lenovo Go Multi-Device", "base_price": 2800.0,
        "description": "Compact travel-ready wireless mouse with Qi wireless charging support, USB-C fast charge, blue optical sensor.",
        "specs": {"charging": "Qi Wireless Charging & USB-C Wired", "dpi": "Up to 2400 DPI (3-Level On-the-Fly)", "connectivity": "Unified 2.4GHz USB-C Receiver + 2x Bluetooth 5.0", "battery": "3 Months per Charge"},
        "features": ["Supports Qi Wireless Charging Pads", "Blue Optical Sensor Works on Cloth & Wood", "Dedicated Programmable Utility Button", "Ultra-Portable Ergonomic Contours"]
    },
    {
        "code": "PROD-MOU-005", "name": "Anker 2.4G Ergonomic Vertical Optical Mouse",
        "category": "Mice", "brand": "Anker", "model": "AK-98ANWVM-UBA", "base_price": 1800.0,
        "description": "Scientific handshake-grip ergonomic vertical mouse that reduces forearm pronation and wrist strain during long work days.",
        "specs": {"design": "Vertical Neutral Handshake (60-Degree Angle)", "dpi": "800 / 1200 / 1600 DPI Resolution", "connectivity": "2.4GHz Wireless Nano USB Receiver", "battery": "2x AAA Batteries"},
        "features": ["Reduces Carpal Tunnel & Repetitive Strain (RSI)", "Next/Previous Browser Thumb Buttons", "Auto-Power Sleep Mode", "Smooth Matte Finish"]
    },
    {
        "code": "PROD-MOU-006", "name": "Logitech Lift Vertical Ergonomic Wireless Mouse",
        "category": "Mice", "brand": "Logitech", "model": "Lift Vertical", "base_price": 5800.0,
        "description": "Ergonomist-certified 57-degree vertical mouse designed for small to medium hands, SmartWheel magnetic scroll, whisper-quiet clicks.",
        "specs": {"angle": "57-Degree Optimal Ergonomic Angle", "scroll": "SmartWheel (Speed & Precision Modes)", "connectivity": "Bluetooth Low Energy & Logi Bolt USB", "battery": "1x AA Battery (Up to 2 Years)"},
        "features": ["57-Degree Natural Handshake Elevation", "Whisper-Quiet Silent Buttons", "SmartWheel Precision Magnetic Scrolling", "Certified by United States Ergonomics"]
    },
    {
        "code": "PROD-MOU-007", "name": "Apple Magic Mouse Wireless Rechargeable (Multi-Touch)",
        "category": "Mice", "brand": "Apple", "model": "Magic Mouse", "base_price": 7500.0,
        "description": "Sleek continuous multi-touch surface wireless mouse for Mac, supporting intuitive swipe and scroll gestures.",
        "specs": {"surface": "Seamless Multi-Touch Glass Surface", "connectivity": "Bluetooth & Lightning/USB-C", "battery": "Internal Rechargeable Lithium-ion", "weight": "99g"},
        "features": ["Multi-Touch Gesture Support (Swipe between pages/desktops)", "Optimized Foot Design for Smooth Gliding", "Instant macOS Pairing", "Sleek Low-Profile Design"]
    },
    {
        "code": "PROD-MOU-008", "name": "Razer Pro Click Wireless Ergonomic Business Mouse",
        "category": "Mice", "brand": "Razer", "model": "Pro Click (Humanscale Collab)", "base_price": 7200.0,
        "description": "Co-designed with Humanscale ergonomics experts, 16,000 DPI 5G optical sensor, 400-hour battery life, 8 programmable buttons.",
        "specs": {"sensor": "Razer 5G Advanced 16000 DPI Optical", "ergonomics": "Humanscale Collaborative Design (30-Degree Tilt)", "connectivity": "Bluetooth & 2.4GHz Wireless & Wired", "battery": "Up to 400 Hours"},
        "features": ["Humanscale Ergonomics Prevents Wrist Tendonitis", "50 Million Click Mechanical Switches", "Multi-Host Connectivity for 4 Systems", "Metal Tilt-Click Scroll Wheel"]
    },
    {
        "code": "PROD-MOU-009", "name": "Microsoft Bluetooth Ergonomic Wireless Mouse",
        "category": "Mice", "brand": "Microsoft", "model": "Bluetooth Ergonomic", "base_price": 3100.0,
        "description": "All-day comfortable ergonomic mouse with soft thumb rest, aluminum scroll wheel, precise tracking Teflon base.",
        "specs": {"connectivity": "Bluetooth 5.0 Low Energy", "buttons": "2 Customizable Thumb Buttons", "wheel": "Machined Aluminum Scroll Wheel", "battery": "2x AAA (Up to 15 Months)"},
        "features": ["Natural Ergonomic Palm Arch & Thumb Rest", "Machined Aluminum Scroll Wheel", "Teflon Base Glides Smoothly on Desks", "Smart Switch Seamless Pairing"]
    },
    {
        "code": "PROD-MOU-010", "name": "Dell Pro Wireless Optical Mouse MS300",
        "category": "Mice", "brand": "Dell", "model": "MS300 Pro Wireless", "base_price": 1400.0,
        "description": "Reliable full-size corporate wireless mouse with 4000 DPI optical sensor, 36-month battery life, ambidextrous shape.",
        "specs": {"dpi": "4000 DPI Sensor (Adjustable via DPM)", "connectivity": "2.4GHz Wireless USB Nano Receiver", "battery": "1x AA Battery (36 Months Life)", "design": "Full-Size Ambidextrous"},
        "features": ["3-Year Exceptional Battery Life", "4000 DPI High-Resolution Tracking", "Dell Advanced Exchange Service Warranty", "AES 128-bit Encryption"]
    },
    {
        "code": "PROD-MOU-011", "name": "Logitech Triathlon M720 Multi-Device Wireless Mouse",
        "category": "Mice", "brand": "Logitech", "model": "M720 Triathlon", "base_price": 3400.0,
        "description": "Endurance corporate mouse capable of pairing with 3 computers with instant illuminated number toggle, hyper-fast scroll.",
        "specs": {"connectivity": "Unifying Receiver + Bluetooth (3 Devices)", "battery": "1x AA Battery (24 Months)", "scroll": "Dual-Mode Hyper-Fast Scroll Wheel", "durability": "10 Million Clicks"},
        "features": ["Illuminated 1-2-3 Easy-Switch Indicator", "Hyper-Fast Kinetic Scrolling", "Logitech Flow Cross-Computer File Sharing", "Comfortable Contoured Rubber Grip"]
    },
    {
        "code": "PROD-MOU-012", "name": "Asus SmartO MD200 Wireless Silent Business Mouse",
        "category": "Mice", "brand": "Asus", "model": "SmartO MD200", "base_price": 2600.0,
        "description": "Antibacterial coated business mouse with integrated carrying elastic loop, 4200 DPI optical sensor, 100% silent switches.",
        "specs": {"coating": "ASUS Antibacterial Guard (99% Inhibition)", "sensor": "4200 DPI Optical (Tracks on Glass)", "loop": "Elastic Carrying Finger Loop", "battery": "1x AA (Up to 1 Year)"},
        "features": ["ASUS Antibacterial Guard Coating", "Integrated Elastic Carry Loop for Laptops", "100% Silent Micro-Switches", "Armoury Crate Custom Profiles"]
    },
    {
        "code": "PROD-MOU-013", "name": "HP 240 Bluetooth Wireless Ambidextrous Mouse",
        "category": "Mice", "brand": "HP", "model": "HP 240 Bluetooth", "base_price": 1100.0,
        "description": "Simple, sleek Bluetooth 5.1 mouse that connects directly without any USB dongle, smooth 1600 DPI optical tracking.",
        "specs": {"connectivity": "Bluetooth 5.1 (No USB Port Needed)", "dpi": "1600 DPI Optical", "battery": "1x AA Battery (Up to 15 Months)", "design": "Slim Ambidextrous"},
        "features": ["Dongle-Free Bluetooth Direct Connection", "Frees Up USB Ports on Ultrabooks", "Smooth Left-or-Right Handed Design", "Fast Energy-Efficient Sleep Wakeup"]
    },
    {
        "code": "PROD-MOU-014", "name": "Lenovo 600 Bluetooth Silent Travel Mouse",
        "category": "Mice", "brand": "Lenovo", "model": "600 BT Silent", "base_price": 1350.0,
        "description": "Low-profile minimalist silent mouse with on-the-fly 3-level DPI adjustment button, sculpted low-profile palm rest.",
        "specs": {"connectivity": "Bluetooth 5.0 with Swift Pair", "switches": "Silent Click Micro-Switches", "dpi": "800 / 1600 / 2400 DPI Selector Button", "battery": "1x AA (12 Months)"},
        "features": ["Near-Silent Clicks for Open Plan Offices", "Swift Pair Instant Windows Connection", "Low-Profile Pocketable Design", "Dedicated Top DPI Toggle Button"]
    },
    {
        "code": "PROD-MOU-015", "name": "Corsair Katar Pro Wireless Lightweight Gaming/Work Mouse",
        "category": "Mice", "brand": "Corsair", "model": "Katar Pro Wireless", "base_price": 2400.0,
        "description": "Lightweight 96g symmetrical mouse with ultra-fast sub-1ms Slipstream wireless technology, 10,000 DPI PMW3325 sensor.",
        "specs": {"sensor": "PixArt PMW3325 10000 DPI", "connectivity": "Sub-1ms Slipstream Wireless & Low-Latency Bluetooth", "weight": "96g Lightweight", "battery": "1x AA (Up to 135 Hours)"},
        "features": ["Sub-1ms Wireless Response Time", "Symmetrical Compact Claw/Fingertip Grip", "Onboard Profile Storage via iCUE", "Zero Input Lag for Fast Workflows"]
    },

    # --- CATEGORY 7: DOCKING STATIONS (15 items) ---
    {
        "code": "PROD-DOC-001", "name": "Dell Thunderbolt 4 Dock WD22TB4 Modular Enterprise",
        "category": "Docking Stations", "brand": "Dell", "model": "WD22TB4", "base_price": 21500.0,
        "description": "Modular Thunderbolt 4 dock delivering 130W Dell ExpressCharge (90W standard), dual 4K/single 8K display support, Gigabit Ethernet.",
        "specs": {"technology": "Thunderbolt 4 (40Gbps)", "power_delivery": "130W Dell Power / 90W Non-Dell", "video_outputs": "2x DisplayPort 1.4, 1x HDMI 2.0, 1x USB-C MFDP, 2x Thunderbolt 4", "ethernet": "Gigabit RJ45"},
        "features": ["Modular Swappable Interface Module", "Dell ExpressCharge 80% in 1 Hour", "Pass-Through MAC Address Cloning & PXE Boot", "Dual Thunderbolt 4 Downstream Ports"]
    },
    {
        "code": "PROD-DOC-002", "name": "Lenovo ThinkPad Universal Thunderbolt 4 Enterprise Dock",
        "category": "Docking Stations", "brand": "Lenovo", "model": "40B00135US", "base_price": 22800.0,
        "description": "Enterprise-managed Thunderbolt 4 dock supporting quad 4K displays, 100W PD charging, vPro / AMT enterprise pass-through.",
        "specs": {"technology": "Thunderbolt 4 / USB4", "power_delivery": "100W Dynamic Power Delivery", "video_outputs": "2x DisplayPort 1.4, 1x HDMI 2.1, 1x TB4 Downstream", "ports": "4x USB-A 3.2 10Gbps, 1x USB-C 10Gbps, Gigabit LAN"},
        "features": ["Supports Quad 4K @ 60Hz Displays", "vPro & Intel AMT Remote Management Passthrough", "Silent Firmware Auto-Updates via Lenovo Cloud", "Kensington Lock Slot"]
    },
    {
        "code": "PROD-DOC-003", "name": "CalDigit TS4 Thunderbolt 4 18-Port Flagship Dock",
        "category": "Docking Stations", "brand": "CalDigit", "model": "TS4 18-Port", "base_price": 34500.0,
        "description": "Industry-leading 18-port Thunderbolt 4 docking station with 98W laptop charging, 2.5GbE Ethernet, UHS-II SD/microSD slots.",
        "specs": {"ports_count": "18 Total Connectivity Ports", "power_delivery": "98W Full Host Charging", "networking": "2.5 Gigabit Ethernet (2.5GbE)", "audio": "Front Combo + Dedicated Rear Mic/Audio"},
        "features": ["18 Comprehensive Workstation Ports", "2.5 Gigabit High-Speed Ethernet", "Front 20W USB-C Fast Charge Port", "High-End Aluminum Heat Dissipation Enclosure"]
    },
    {
        "code": "PROD-DOC-004", "name": "Anker 575 USB-C 13-in-1 Triple Display Docking Station",
        "category": "Docking Stations", "brand": "Anker", "model": "Anker 575 13-in-1", "base_price": 14200.0,
        "description": "Universal 13-in-1 desktop dock providing 85W laptop charging, triple display video output (dual HDMI + DisplayPort), 10Gbps USB.",
        "specs": {"power_delivery": "85W High-Speed USB-C PD", "displays": "Triple Display (2x HDMI, 1x DisplayPort)", "ports": "1x USB-C 10Gbps, 3x USB-A, SD/TF Card, Gigabit Ethernet", "power_brick": "135W AC Adapter Included"},
        "features": ["Triple External Monitor Expansion", "High-Speed 10Gbps USB-C Data Transfer", "Simultaneous SD and MicroSD Card Access", "Built-In Short Circuit & Surge Protection"]
    },
    {
        "code": "PROD-DOC-005", "name": "HP USB-C G5 Essential Multi-Port Corporate Dock",
        "category": "Docking Stations", "brand": "HP", "model": "HP USB-C Dock G5", "base_price": 16500.0,
        "description": "Universal USB-C dock compatible with HP, Apple, Dell, and Lenovo laptops, delivering up to 100W PD and dual 4K outputs.",
        "specs": {"compatibility": "Universal USB-C with Alt Mode", "power_delivery": "Up to 100W to Host (75W on Non-HP)", "video_outputs": "2x DisplayPort 1.4, 1x HDMI 2.0", "networking": "Gigabit RJ45"},
        "features": ["Universal Multi-Brand Operating System Support", "Network Manageability (PXE Boot, WoL, MAC Address Pass)", "Single Cable Tidy Desk Setup", "Compact 122 x 122 mm Footprint"]
    },
    {
        "code": "PROD-DOC-006", "name": "Belkin Connect Pro Thunderbolt 4 Dual 4K Dock",
        "category": "Docking Stations", "brand": "Belkin", "model": "INC006 Belkin Pro", "base_price": 26900.0,
        "description": "High performance 12-port Thunderbolt 4 dock delivering 90W host charging, dual 4K @ 60Hz, ultra-fast 40Gbps data pipelines.",
        "specs": {"technology": "Thunderbolt 4 / USB4", "power_delivery": "90W Power Delivery", "video_outputs": "2x HDMI 2.0, 1x Thunderbolt 4 Downstream", "ports": "4x USB-A 3.1, 2x TB4, SD 4.0, Gigabit LAN"},
        "features": ["Dual 4K @ 60Hz or Single 8K @ 30Hz", "Thunderbolt 4 Certified by Intel & Apple", "Overcurrent & Thermal Safety Monitoring", "Includes 0.8m 40Gbps Thunderbolt 4 Cable"]
    },
    {
        "code": "PROD-DOC-007", "name": "Plugable TBT4-UDZ 16-in-1 Thunderbolt 4 Docking Station",
        "category": "Docking Stations", "brand": "Plugable", "model": "TBT4-UDZ", "base_price": 28500.0,
        "description": "Flexible multi-display dock with 16 ports, 100W charging, offering any combination of DisplayPort and HDMI across dual displays.",
        "specs": {"video_flexibility": "4 Video Ports (2x HDMI 2.1 & 2x DisplayPort 1.4)", "power_delivery": "100W Certified Host Power", "ports": "7x USB Ports, 2.5Gbps Ethernet, SD & MicroSD", "audio": "Combo Audio Jack"},
        "features": ["Any-Display Flexibility (HDMI + HDMI, DP + DP, or HDMI + DP)", "100W Maximum Power Delivery", "2.5G Fast Wired Network Controller", "Solid Aluminum Enclosure"]
    },
    {
        "code": "PROD-DOC-008", "name": "Kensington SD5700T Thunderbolt 4 Dual 4K Enterprise Dock",
        "category": "Docking Stations", "brand": "Kensington", "model": "SD5700T", "base_price": 25000.0,
        "description": "Engineered enterprise dock supporting three downstream Thunderbolt 4 ports, 90W PD, zero-footprint mounting bracket ready.",
        "specs": {"thunderbolt_ports": "1x Host + 3x Downstream TB4 Ports", "power_delivery": "90W Power Delivery", "card_reader": "UHS-II SD 4.0 Card Reader", "ethernet": "Gigabit Ethernet"},
        "features": ["3 Downstream Thunderbolt 4 Daisy-Chain Ports", "Zero-Footprint Mounting Plate Compatible", "Kensington Lock & NanoSaver Security Slots", "Free Kensington DockWorks Software"]
    },
    {
        "code": "PROD-DOC-009", "name": "Dell USB-C Dual Charge Dock HD22Q with Qi Pad",
        "category": "Docking Stations", "brand": "Dell", "model": "HD22Q Dual Charge", "base_price": 13900.0,
        "description": "Innovative hybrid dock featuring a 12W integrated Qi wireless smartphone charging stand on top, 90W laptop USB-C power delivery.",
        "specs": {"smartphone_charging": "12W Fast Qi Wireless Charging Stand", "laptop_charging": "90W USB-C Power Delivery", "video": "1x DisplayPort 1.4, 1x HDMI 2.1 (Dual 4K)", "ports": "4x USB-A 3.2 Gen 1, Gigabit Ethernet"},
        "features": ["Built-In Qi Fast Wireless Phone Charging Cradle", "Compact Desk Footprint with Vertical Phone Display", "Dual 4K Monitor Support at 60Hz", "ExpressCharge Fast Laptop Replenishment"]
    },
    {
        "code": "PROD-DOC-010", "name": "StarTech Dual 4K HDMI USB-C Docking Station",
        "category": "Docking Stations", "brand": "StarTech", "model": "DK30CH2DEP", "base_price": 18200.0,
        "description": "Industrial grade dual 4K HDMI dock with 100W PD, hardware network MAC address clone utility, 60W upstream charging.",
        "specs": {"video_outputs": "2x HDMI 2.0 (Dual 4K 60Hz)", "power_delivery": "100W Power Delivery (85W to Laptop)", "ports": "4x USB 3.0, Gigabit Ethernet, Headphone/Mic", "os": "Windows, macOS, ChromeOS, Ubuntu"},
        "features": ["StarTech Connectivity Tools Suite Included", "Dual 4K 60Hz HDMI Uncompressed Video", "Rugged K-Slot Security Enclosure", "Enterprise IT Driverless Setup"]
    },
    {
        "code": "PROD-DOC-011", "name": "Baseus 17-in-1 Triple Display Multi-Port Hub Station",
        "category": "Docking Stations", "brand": "Baseus", "model": "17-in-1 Triple Display", "base_price": 11500.0,
        "description": "High-density 17-port vertical desktop hub with 100W PD input, 3x HDMI ports for triple monitor mirroring/extension.",
        "specs": {"ports_count": "17 Integrated Hub Ports", "video_outputs": "3x HDMI 4K Ports", "data_ports": "3x USB 3.0, 2x USB 2.0, 2x Type-C Data", "audio": "3.5mm Aux Audio Out"},
        "features": ["Vertical Tower Space-Saving Stand", "Triple Monitor HDMI Display Matrix", "High Speed 5Gbps USB-C Data Channels", "Dual SD/TF High-Speed Card Readers"]
    },
    {
        "code": "PROD-DOC-012", "name": "WAVLINK Universal Dual 4K DisplayLink USB-C & USB-A Dock",
        "category": "Docking Stations", "brand": "WAVLINK", "model": "WL-UG69DK1", "base_price": 12800.0,
        "description": "DisplayLink DL-6950 powered universal dock that works on any laptop (USB-C or legacy USB-A), delivering dual 4K @ 60Hz.",
        "specs": {"chipset": "DisplayLink DL-6950 Universal GPU", "host_interface": "USB-C & USB-A Hybrid Cable Included", "video_outputs": "2x DisplayPort ++ and 2x HDMI (Dual 4K)", "ports": "6x USB 3.0 Ports, Gigabit Ethernet"},
        "features": ["Works on Legacy USB-A and Modern USB-C Laptops", "Dual 4K 60Hz on M1/M2/M3 Base MacBooks", "DisplayLink Driver Universal Stability", "Separate Audio Mic & Speaker Jacks"]
    },
    {
        "code": "PROD-DOC-013", "name": "UGREEN Revodok Pro 109 9-in-1 4K 60Hz Docking Station",
        "category": "Docking Stations", "brand": "UGREEN", "model": "Revodok Pro 109", "base_price": 6200.0,
        "description": "Compact all-in-one aluminum travel dock with dual 4K @ 60Hz HDMI ports, 100W PD charging pass-through, 5Gbps USB-A/C.",
        "specs": {"video": "2x HDMI 4K @ 60Hz", "power_pass_through": "100W USB-C Power Delivery", "ports": "2x USB-A 3.0, 1x USB-C Data, Gigabit RJ45, SD/TF", "cable": "Integrated 20cm Braided Cable"},
        "features": ["Dual 4K @ 60Hz HDMI Crisp Output", "100W Fast Pass-Through Power Delivery", "Gigabit Ethernet Stable Wired Connection", "Sleek Aluminum Shell Dissipates Heat Fast"]
    },
    {
        "code": "PROD-DOC-014", "name": "HyperDrive GEN2 18-Port Heavy Workstation Dock",
        "category": "Docking Stations", "brand": "HyperDrive", "model": "GEN2 18-Port", "base_price": 31000.0,
        "description": "Ultimate creative workstation dock with 18 ports, quad monitor support, 100W PD, optical Toslink digital audio out.",
        "specs": {"video_outputs": "2x HDMI 4K60Hz, 1x DisplayPort 4K60Hz, 1x VGA", "audio": "Optical Toslink Audio & 3.5mm TRRS", "power_delivery": "100W Host PD (180W DC Adapter)", "storage_ports": "UHS-II MicroSD/SD, DC Power In"},
        "features": ["Optical Toslink Digital Audio Output", "Quad Video Output Configurations", "Industrial Ridged Aluminum Heat Sink", "Fast 10Gbps USB 3.1 Gen 2 Ports"]
    },
    {
        "code": "PROD-DOC-015", "name": "Lenovo USB-C Universal Business Docking Station",
        "category": "Docking Stations", "brand": "Lenovo", "model": "40AY0090US", "base_price": 14900.0,
        "description": "Corporate standard commercial USB-C dock with 65W laptop charging, dual DisplayPort 1.4 + HDMI 2.0, automated firmware updates.",
        "specs": {"power_delivery": "65W USB-C Standard PD", "video_outputs": "2x DisplayPort 1.4, 1x HDMI 2.0", "ports": "3x USB 3.2 Gen 2 (10Gbps), 2x USB 2.0, Gigabit LAN", "security": "Kensington Lock Slot"},
        "features": ["Silent Enterprise IT Firmware Deployment", "Support for Dual 4K Displays", "Pass-Through Corporate MAC Address Management", "Plug-and-Play Simplicity Across All OS"]
    },

    # --- CATEGORY 8: SERVERS & INFRASTRUCTURE (15 items) ---
    {
        "code": "PROD-SRV-001", "name": "Dell PowerEdge R760 2U Enterprise Rack Server",
        "category": "Servers", "brand": "Dell", "model": "PowerEdge R760 2U", "base_price": 345000.0,
        "description": "High performance 2U dual-socket enterprise rack server with 2x Intel Xeon Silver 4410Y (24 Cores total), 128GB DDR5 ECC RAM, 2x 960GB NVMe + 4x 2.4TB SAS HDD, PERC H755 RAID, dual 1400W redundant PSUs.",
        "specs": {"cpu": "2x Intel Xeon Silver 4410Y (24 Cores / 48 Threads)", "ram": "128GB (4x 32GB) DDR5-4800MHz ECC RDIMM", "storage": "2x 960GB NVMe Boot + 4x 2.4TB 10K SAS 12Gbps", "raid": "PERC H755 8GB NV Cache", "power": "Dual 1400W Titanium Redundant Hot-Plug PSUs", "remote_mgmt": "iDRAC9 Enterprise with OpenManage Enterprise"},
        "features": ["iDRAC9 Enterprise Remote Management", "Dual Redundant Hot-Swap Titanium Power Supplies", "PERC H755 RAID Controller with Battery Cache", "Intel QuickAssist Technology Accelerator", "3-Year 24x7 ProSupport Mission Critical SLA"]
    },
    {
        "code": "PROD-SRV-002", "name": "HPE ProLiant DL380 Gen11 2U Datacenter Server",
        "category": "Servers", "brand": "HPE", "model": "ProLiant DL380 Gen11", "base_price": 365000.0,
        "description": "Flagship 2U compute server with 2x Intel Xeon Silver 4416+ (40 Cores total), 128GB TruDDR5 ECC RAM, 8-bay SFF backplane, HPE Smart Array MR416i-p, HPE iLO 6 Advanced.",
        "specs": {"cpu": "2x Intel Xeon Silver 4416+ (40 Cores / 80 Threads)", "ram": "128GB (4x 32GB) DDR5-4800 ECC", "storage": "2x 480GB SATA SSD Read Intensive + 4x 1.92TB SAS SSD", "controller": "HPE MR416i-p Gen11 Storage Controller", "management": "HPE Integrated Lights-Out 6 (iLO 6) Advanced"},
        "features": ["Silicon Root of Trust Firmware Security", "HPE iLO 6 Advanced Datacenter Telemetry", "HPE GreenLake Cloud Orchestration Ready", "Hot-Plug Redundant Fan & Power Modules"]
    },
    {
        "code": "PROD-SRV-003", "name": "Lenovo ThinkSystem SR650 V3 2U Rack Server",
        "category": "Servers", "brand": "Lenovo", "model": "ThinkSystem SR650 V3", "base_price": 330000.0,
        "description": "Versatile 2U rack server powered by 2x Intel Xeon Silver 4410Y, 128GB DDR5 ECC RAM, ThinkSystem RAID 9350-8i, XClarity Controller 2.",
        "specs": {"cpu": "2x Intel Xeon Silver 4410Y (24 Cores)", "ram": "128GB TruDDR5 ECC RDIMM", "storage": "2x 960GB NVMe + 4x 2.4TB 10K HDD", "network": "Intel X710-DA2 Dual Port 10GbE SFP+", "management": "Lenovo XClarity Controller 2 Enterprise"},
        "features": ["Lenovo XClarity Cloud Management", "Dual 10GbE SFP+ High Speed Optical Uplinks", "Optimized Thermal Calibrated Fan Zones", "3-Year Premier Support Next Business Day Onsite"]
    },
    {
        "code": "PROD-SRV-004", "name": "Dell PowerEdge T350 1-Socket Office Tower Server",
        "category": "Servers", "brand": "Dell", "model": "PowerEdge T350 Tower", "base_price": 145000.0,
        "description": "Quiet office-ready tower server with Intel Xeon E-2336 (6 Cores / 12 Threads), 32GB DDR4 ECC UDIMM, 2x 2TB Enterprise SATA HDD, iDRAC9 Basic.",
        "specs": {"cpu": "Intel Xeon E-2336 (6 Cores, 2.9GHz / 4.8GHz Turbo)", "ram": "32GB (2x 16GB) DDR4-3200 ECC UDIMM", "storage": "2x 2TB Enterprise SATA 7.2K HDD RAID 1", "chassis": "Acoustically Quiet Office Tower (35dB)", "power": "Single 600W Gold Efficiency PSU"},
        "features": ["Quiet Acoustic Profile for In-Office Placement", "Hardware RAID 1 Mirroring Data Protection", "iDRAC9 Embedded Server Lifecycle Controller", "Supports Windows Server 2022 / RedHat Linux"]
    },
    {
        "code": "PROD-SRV-005", "name": "Supermicro SuperServer 2U Dual AMD EPYC 9004 Server",
        "category": "Servers", "brand": "Supermicro", "model": "AS-2125HS-TNR", "base_price": 420000.0,
        "description": "Dense high-throughput virtualization server with 2x AMD EPYC 9124 (32 Cores / 64 Threads), 256GB DDR5 ECC RAM, 24 NVMe/SAS hot-swap bays.",
        "specs": {"cpu": "2x AMD EPYC 9124 (32 Cores / 64 Threads, PCIe 5.0)", "ram": "256GB (8x 32GB) DDR5-4800 ECC", "storage": "4x 1.92TB NVMe PCIe 5.0 Enterprise SSD", "bays": "24x Hot-Swap 2.5\" NVMe/SAS/SATA Bays", "power": "Dual 1600W Titanium Redundant PSUs"},
        "features": ["High Density 32-Core AMD EPYC Architecture", "PCIe Gen 5.0 High Bandwidth Lanes", "24x Toolless Hot-Swap NVMe Drive Bays", "IPMI 2.0 Dedicated Out-of-Band Management"]
    },
    {
        "code": "PROD-SRV-006", "name": "Cisco UCS C220 M7 1U High-Density Compute Node",
        "category": "Servers", "brand": "Cisco", "model": "UCS C220 M7", "base_price": 385000.0,
        "description": "Compact 1U compute power node for Cisco Intersight cloud management, 2x Intel Xeon Gold 5416S (32 Cores), 128GB DDR5, Cisco VIC 1467.",
        "specs": {"cpu": "2x Intel Xeon Gold 5416S (32 Cores / 64 Threads)", "ram": "128GB DDR5-4800MHz ECC", "storage": "2x 960GB M.2 SATA SSD + 4x 1.92TB SAS SSD", "network": "Cisco VIC 1467 Quad Port 10/25GbE", "management": "Cisco Intersight Cloud Native Management"},
        "features": ["Cisco Intersight SaaS Infrastructure Orchestration", "Ultra-High-Density 1U Form Factor", "Quad 10/25GbE High Speed Network Fabric", "Cisco Smart Net Total Care Support"]
    },
    {
        "code": "PROD-SRV-007", "name": "HPE ProLiant MicroServer Gen10 Plus v2 Ultra-Compact",
        "category": "Servers", "brand": "HPE", "model": "MicroServer Gen10+ v2", "base_price": 68000.0,
        "description": "Ultra-compact small business edge server with Intel Xeon E-2314 (4 Cores), 16GB DDR4 ECC, 4x 3.5\" non-hot-plug SATA bays.",
        "specs": {"cpu": "Intel Xeon E-2314 (4 Cores, 2.8GHz)", "ram": "16GB DDR4-3200 ECC", "storage": "2x 1TB SATA 7.2K HDD", "form_factor": "Ultra-Micro Cube (11.9 x 24.5 x 24.5 cm)", "ethernet": "4x 1GbE Embedded Network Ports"},
        "features": ["Ultra-Small Micro Footprint for Branch Offices", "4x Gigabit Integrated Ethernet Ports", "HPE iLO 5 Remote Management Enablement Kit Ready", "Whisper Quiet 21dB Operation"]
    },
    {
        "code": "PROD-SRV-008", "name": "Dell PowerEdge R660 1U Dual-Socket Virtualization Server",
        "category": "Servers", "brand": "Dell", "model": "PowerEdge R660 1U", "base_price": 355000.0,
        "description": "High-density 1U dual-socket virtualization host with 2x Intel Xeon Silver 4410Y, 128GB DDR5 ECC, 8x 2.5\" NVMe/SAS backplane, Broadcom 2x 10GbE.",
        "specs": {"cpu": "2x Intel Xeon Silver 4410Y (24 Cores)", "ram": "128GB DDR5-4800MHz ECC", "storage": "4x 960GB Read-Intensive NVMe SSDs", "raid": "PERC H755 Front RAID Controller", "form_factor": "1U Rackmount Server"},
        "features": ["Space-Saving 1U Form Factor", "Direct NVMe Storage Backplane", "iDRAC9 Enterprise with Telemetry Streaming", "Dual Redundant Hot-Plug 1100W Power Supplies"]
    },
    {
        "code": "PROD-SRV-009", "name": "Lenovo ThinkSystem ST250 V2 Entry Enterprise Tower",
        "category": "Servers", "brand": "Lenovo", "model": "ThinkSystem ST250 V2", "base_price": 125000.0,
        "description": "Enterprise-grade tower server for retail and remote offices with Intel Xeon E-2336, 32GB RAM, 8x 3.5\" hot-swap drive bays, XClarity.",
        "specs": {"cpu": "Intel Xeon E-2336 (6 Cores / 12 Threads)", "ram": "32GB DDR4 ECC", "storage": "2x 4TB Enterprise SATA 7.2K HDD", "bays": "8x 3.5\" Hot-Swap SAS/SATA Bays", "power": "Dual 550W Platinum Hot-Swap Redundant PSUs"},
        "features": ["8 Hot-Swap 3.5\" Drive Bays for Mass Storage", "Dual Redundant Hot-Swap Power Supplies", "Lenovo XClarity Provisioning Engine", "Lockable Front Security Bezel"]
    },
    {
        "code": "PROD-SRV-010", "name": "Fujitsu Primergy TX1320 M5 Ultra-Compact Quiet Tower",
        "category": "Servers", "brand": "Fujitsu", "model": "Primergy TX1320 M5", "base_price": 115000.0,
        "description": "Ultra-small silent tower server designed for medical clinics and branch offices, Intel Xeon E-2356G, 32GB ECC RAM, iRMC S5.",
        "specs": {"cpu": "Intel Xeon E-2356G (6 Cores / 12 Threads, 3.2GHz)", "ram": "32GB DDR4-3200 ECC", "storage": "2x 1TB SSD SATA 6G Enterprise", "management": "Fujitsu iRMC S5 Out-of-Band Controller", "noise": "Ultra-Low 18dB Whisper Quiet"},
        "features": ["Ultra-Compact 10-Liter Chassis", "Whisper Quiet 18dB Noise Level", "Integrated iRMC S5 Remote Management", "Made in Germany Enterprise Engineering"]
    },
    {
        "code": "PROD-SRV-011", "name": "Supermicro 1U Enterprise Edge IoT Compute Server",
        "category": "Servers", "brand": "Supermicro", "model": "SYS-110D-16C-FRDN8TP", "base_price": 285000.0,
        "description": "Compact edge server with built-in Intel Xeon D-2775TE (16 Cores), 64GB DDR4 ECC, 4x 10GbE SFP+ optical ports, wide temperature tolerance.",
        "specs": {"cpu": "Intel Xeon D-2775TE (16 Cores / 32 Threads, Embedded SoC)", "ram": "64GB DDR4 ECC RDIMM", "storage": "2x 960GB Enterprise M.2 NVMe SSD", "network": "4x 10GbE SFP+ Optical Ports + 4x 1GbE RJ45", "depth": "Short Depth 399mm Chassis"},
        "features": ["Short Depth 399mm for Telco & Edge Racks", "4 Built-In 10GbE SFP+ High Speed Optical Ports", "Wide Operating Temperature Tolerance (0-50°C)", "Hardware QAT Crypto Acceleration"]
    },
    {
        "code": "PROD-SRV-012", "name": "ASUS RS720-E11 High Performance Dual Xeon Server",
        "category": "Servers", "brand": "ASUS", "model": "RS720-E11-RS12U", "base_price": 375000.0,
        "description": "Scalable 2U server with 2x 4th Gen Intel Xeon Scalable processors, 128GB DDR5 ECC, ASUS ASMB11-iKVM remote management, PCIe 5.0 slots.",
        "specs": {"cpu": "2x Intel Xeon Silver 4410Y (24 Cores)", "ram": "128GB DDR5-4800MHz ECC", "storage": "2x 960GB NVMe M.2 + 8x 2.5\" SAS/NVMe Bays", "expansion": "9x PCIe Gen 5.0 Slots", "management": "ASUS ASMB11-iKVM (Out-of-Band)"},
        "features": ["9x PCIe Gen 5.0 Expansion Slots for Accelerators", "ASUS Thermal Radar 2.0 Intelligent Cooling", "ASMB11-iKVM Dedicated Management Port", "Dual 1600W 80 PLUS Platinum Redundant PSUs"]
    },
    {
        "code": "PROD-SRV-013", "name": "Dell PowerEdge R450 1U Dense Virtualization Node",
        "category": "Servers", "brand": "Dell", "model": "PowerEdge R450 1U", "base_price": 275000.0,
        "description": "Value-optimized 1U dual-socket rack server with 2x Intel Xeon Silver 4310 (24 Cores), 64GB DDR4 ECC RAM, PERC H745 RAID, iDRAC9.",
        "specs": {"cpu": "2x Intel Xeon Silver 4310 (24 Cores / 48 Threads)", "ram": "64GB (2x 32GB) DDR4-3200 ECC RDIMM", "storage": "2x 480GB SATA SSD + 4x 1.2TB 10K SAS HDD", "raid": "PERC H745 4GB Cache", "form_factor": "1U Rackmount"},
        "features": ["Cost-Optimized Dual-Socket Virtualization", "PERC H745 Hardware RAID Controller", "iDRAC9 Enterprise Remote Management", "Dual 800W Platinum Redundant Power Supplies"]
    },
    {
        "code": "PROD-SRV-014", "name": "HPE ProLiant ML350 Gen11 Expandable Enterprise Tower",
        "category": "Servers", "brand": "HPE", "model": "ProLiant ML350 Gen11", "base_price": 310000.0,
        "description": "Robust and expandable dual-socket tower server with Intel Xeon Silver 4410Y, 64GB DDR5 ECC, 8x SFF hot-swap bays, iLO 6 Advanced.",
        "specs": {"cpu": "1x Intel Xeon Silver 4410Y (Upgradeable to 2 CPUs)", "ram": "64GB DDR5 ECC RDIMM (Up to 8TB)", "storage": "4x 1.2TB 10K SAS 12Gbps HDD", "chassis": "Convertible Tower-to-Rack 4U", "management": "HPE iLO 6 Advanced"},
        "features": ["Convertible Tower or 4U Rack Configuration", "Massive Scalability with Dual CPU Socket Support", "HPE Silicon Root of Trust Security", "Toolless Chassis Access for Fast Maintenance"]
    },
    {
        "code": "PROD-SRV-015", "name": "Cisco UCS C240 M6 2U Storage-Dense Data Server",
        "category": "Servers", "brand": "Cisco", "model": "UCS C240 M6 2U", "base_price": 395000.0,
        "description": "Storage-optimized 2U dual-socket rack server with 2x Intel Xeon Silver 4314 (32 Cores), 128GB DDR4, 24x 2.5\" SAS/SATA/NVMe front drive bays.",
        "specs": {"cpu": "2x Intel Xeon Silver 4314 (32 Cores / 64 Threads)", "ram": "128GB DDR4-3200 ECC", "storage": "2x 480GB M.2 SSD + 8x 2.4TB 10K SAS HDD", "network": "Cisco Modular LOM (mLOM) Dual 10/25GbE", "bays": "Up to 24x Front Hot-Swap Drive Bays"},
        "features": ["Massive 24-Drive High-Density Storage Capacity", "Unified Cisco Intersight Management", "Dual 1050W Platinum Hot-Plug Power Supplies", "Cisco UCS Integrated Management Controller (CIMC)"]
    }
]

# =====================================================================
# 3. 5 ENTERPRISE GOVERNANCE POLICIES
# =====================================================================

POLICIES_DATA = [
    {
        "policy_code": "POL-001",
        "title": "Maximum Purchase Authorization Tiering",
        "category": "Financial Governance",
        "rule_description": "Purchases up to ₹2,00,000 are auto-approved. ₹2,00,001 to ₹5,00,000 require VP sign-off (ESCALATE). Above ₹5,00,000 are strictly blocked (BLOCK).",
        "policy_type": "BUDGET_THRESHOLD",
        "threshold_value": "200000.0,500000.0",
        "operator": "TIERED_BUDGET",
        "impact": "Auto-executes ≤₹2L; Requires VP Approval for ₹2L-₹5L; Blocks >₹5L",
        "is_active": True
    },
    {
        "policy_code": "POL-002",
        "title": "Vendor Reliability Threshold",
        "category": "Quality Assurance",
        "rule_description": "Sourced vendor must maintain a historical reliability score of at least 85%. Lower scored vendors are disqualified by Risk Engine.",
        "policy_type": "VENDOR_RELIABILITY",
        "threshold_value": "85.0",
        "operator": "GTE",
        "impact": "Disqualifies vendors scoring below 85% to mitigate fulfillment risk",
        "is_active": True
    },
    {
        "policy_code": "POL-003",
        "title": "Per-Item Unit Budget Ceiling",
        "category": "Cost Control",
        "rule_description": "Individual unit cost must not exceed category ceiling without executive waiver.",
        "policy_type": "ITEM_BUDGET_CAP",
        "threshold_value": "50000.0",
        "operator": "LTE",
        "impact": "Prevents unit price inflation beyond market baseline",
        "is_active": True
    },
    {
        "policy_code": "POL-004",
        "title": "Approved IT & Corporate Asset Categories",
        "category": "Compliance",
        "rule_description": "Procurement requests must match whitelisted corporate catalog categories: Laptops, Monitors, Office Furniture, Laptop Stands, Keyboards, Mice, Docking Stations, Servers.",
        "policy_type": "APPROVED_CATEGORY",
        "threshold_value": "Laptops,Monitors,Office Furniture,Laptop Stands,Keyboards,Mice,Docking Stations,Servers,IT Hardware,Enterprise Peripherals,Office Equipment,Network Infrastructure",
        "operator": "IN_LIST",
        "impact": "Restricts unauthorized procurement categories",
        "is_active": True
    },
    {
        "policy_code": "POL-005",
        "title": "Autonomous Negotiation Boundary",
        "category": "Pricing Boundary",
        "rule_description": "AI Negotiation Agent cannot accept vendor counter-offers that exceed +8% above initial target baseline.",
        "policy_type": "NEGOTIATION_TOLERANCE",
        "threshold_value": "8.0",
        "operator": "LTE",
        "impact": "Limits autonomous price concessions to 8% max",
        "is_active": True
    }
]

# =====================================================================
# SEED FUNCTION
# =====================================================================

def seed_db():
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE vendors ADD COLUMN IF NOT EXISTS preferred_supplier BOOLEAN DEFAULT FALSE;"))
            conn.execute(text("ALTER TABLE vendors ADD COLUMN IF NOT EXISTS source_channel VARCHAR(100) DEFAULT 'Enterprise Direct Tier-1 Catalog';"))
            conn.execute(text("ALTER TABLE vendors ADD COLUMN IF NOT EXISTS normalized_specs JSON DEFAULT '{}';"))
            conn.execute(text("ALTER TABLE vendors ADD COLUMN IF NOT EXISTS risk_breakdown JSON DEFAULT '{}';"))
            conn.commit()
        except Exception as ddl_err:
            logger.debug(f"DDL check note: {ddl_err}")

    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    try:
        # Check counts
        vendor_count = db.query(Vendor).count()
        product_count = db.query(Product).count()
        offer_count = db.query(VendorOffer).count()
        policy_count = db.query(PolicyRule).count()

        if vendor_count >= 25 and product_count >= 120 and offer_count >= 360 and policy_count >= 5:
            logger.info(f"Database already populated: {product_count} products, {vendor_count} vendors, {offer_count} offers, {policy_count} policies.")
            return

        logger.info("Seeding full procurement knowledge base (120 products, 25 vendors across 2 sources, 360 offers)...")

        # 1. Upsert 25 Enterprise Vendors
        vendor_objects = {}
        for vdata in VENDORS_DATA:
            vendor = Vendor(
                id=vdata["id"],
                vendor_code=vdata["vendor_code"],
                name=vdata["name"],
                short_name=vdata["short_name"],
                category=vdata["category"],
                price=vdata["price"],
                delivery_days=vdata["delivery_days"],
                reliability_score=vdata["reliability_score"],
                seller_rating=vdata["seller_rating"],
                warranty_years=vdata["warranty_years"],
                warranty_text=vdata["warranty_text"],
                risk_level=vdata["risk_level"],
                risk_score=vdata["risk_score"],
                stock_available=vdata["stock_available"],
                region=vdata["region"],
                source_channel=vdata["source_channel"],
                preferred_supplier=vdata["preferred_supplier"],
                is_active=vdata["is_active"],
                normalized_specs=vdata["normalized_specs"],
                risk_breakdown=vdata["risk_breakdown"]
            )
            db.merge(vendor)
            vendor_objects[vendor.id] = vendor
        db.commit()
        logger.info(f"Upserted {len(vendor_objects)} Enterprise Vendors across Source A (Tier-1 Direct) and Source B (B2B Marketplace).")

        # 2. Upsert 120 Products
        product_objects = []
        for pdata in PRODUCTS_DATA:
            prod_id = f"prod-{pdata['code'].lower()}"
            product = Product(
                id=prod_id,
                product_code=pdata["code"],
                product_name=pdata["name"],
                category=pdata["category"],
                brand=pdata["brand"],
                model=pdata["model"],
                description=pdata["description"],
                base_price=pdata["base_price"],
                specifications=pdata["specs"],
                features=pdata["features"]
            )
            db.merge(product)
            product_objects.append(product)
        db.commit()
        logger.info(f"Upserted {len(product_objects)} Curated Products across 8 categories.")

        # 3. Clean and recreate Vendor Offers for the 120 products
        db.query(VendorOffer).delete()
        db.commit()

        offers_to_add = []
        
        # Sourcing vendor mapping per category
        # Each category links to 2 Source A vendors and 1-2 Source B vendors
        category_vendor_pool = {
            "Laptops": [
                ("ven-001-dell-direct", 1.00, 4, 3, "3 Years Onsite ProSupport Plus", 120), # Source A
                ("ven-005-compsource", 0.97, 5, 3, "3 Years Onsite ProSupport", 45),       # Source A
                ("ven-014-technoworld", 0.94, 4, 2, "2 Years Standard OEM Warranty", 80),   # Source B
                ("ven-015-itmart", 0.93, 6, 2, "2 Years Authorized Brand Warranty", 55),    # Source B
            ],
            "Monitors": [
                ("ven-004-lg-partner", 1.00, 3, 3, "3 Years Commercial Onsite Zero-Bright-Dot", 150), # Source A
                ("ven-011-samsung-display", 1.02, 4, 3, "3 Years Samsung Business Onsite", 130),     # Source A
                ("ven-017-displayhub", 0.96, 5, 2, "2 Years Carry-in Brand Warranty", 65),          # Source B
                ("ven-023-national-wholesalers", 0.97, 6, 2, "2 Years Standard OEM Cover", 75),     # Source B
            ],
            "Keyboards": [
                ("ven-007-logitech-commercial", 1.00, 3, 2, "2 Years Commercial Advance Replacement", 300), # Source A
                ("ven-002-lenovo-hub", 1.03, 5, 3, "3 Years Premier Support Next Business Day", 95),       # Source A
                ("ven-022-megadistributors", 0.91, 4, 1, "1 Year Standard Replacement", 400),               # Source B
                ("ven-016-quickship", 0.95, 2, 1, "1 Year Express Replacement Warranty", 250),              # Source B
            ],
            "Office Furniture": [
                ("ven-006-steelcase-direct", 1.05, 6, 5, "5 Years Structural & Mechanism Lifetime", 70),  # Source A
                ("ven-010-ergopro-direct", 1.00, 4, 3, "3 Years Onsite Mechanical & Gas-Lift", 110),     # Source A
                ("ven-013-featherlite-corporate", 0.98, 5, 3, "3 Years Comprehensive Commercial", 85),   # Source A
                ("ven-018-officesupplies-hub", 0.88, 7, 2, "2 Years Merchant Parts Warranty", 40),        # Source B
                ("ven-025-metro-ergo", 0.92, 5, 3, "3 Years Brand Onsite Warranty", 60),                  # Source B
            ],
            "Laptop Stands": [
                ("ven-010-ergopro-direct", 1.00, 4, 3, "3 Years Onsite Replacement", 110),               # Source A
                ("ven-016-quickship", 0.92, 2, 1, "1 Year Express Replacement Warranty", 250),            # Source B
                ("ven-022-megadistributors", 0.89, 4, 1, "1 Year Standard Replacement", 400),             # Source B
            ],
            "Mice": [
                ("ven-007-logitech-commercial", 1.00, 3, 2, "2 Years Commercial Advance Replacement", 300), # Source A
                ("ven-001-dell-direct", 1.02, 4, 3, "3 Years Dell Advanced Exchange", 120),                 # Source A
                ("ven-022-megadistributors", 0.90, 4, 1, "1 Year Standard Replacement", 400),               # Source B
            ],
            "Docking Stations": [
                ("ven-012-caldigit-enterprise", 1.00, 4, 2, "2 Years Direct OEM Thunderbolt Replacement", 60), # Source A
                ("ven-001-dell-direct", 1.04, 4, 3, "3 Years ProSupport Advanced Exchange", 120),              # Source A
                ("ven-019-primehardware", 0.93, 4, 2, "2 Years Authorized Brand Warranty", 50),                 # Source B
            ],
            "Servers": [
                ("ven-009-cisco-enterprise", 1.02, 7, 3, "3 Years Cisco Smart Net Total Care 24x7x4", 15),     # Source A
                ("ven-001-dell-direct", 1.00, 5, 3, "3 Years ProSupport Mission Critical 4h Onsite", 35),       # Source A
                ("ven-020-cloudtech", 0.93, 8, 3, "3 Years OEM Hardware Support", 12),                           # Source B
                ("ven-024-fasttrack-tech", 0.95, 6, 3, "3 Years Next Business Day Onsite", 10),                 # Source B
            ]
        }

        offer_count_created = 0
        for product in product_objects:
            pool = category_vendor_pool.get(product.category, category_vendor_pool["Laptops"])
            selected_vendors = pool[:3]
            for v_id, price_multiplier, days, war_yrs, war_txt, stock in selected_vendors:
                offer_price = round(product.base_price * price_multiplier, 0)
                offer = VendorOffer(
                    id=str(uuid.uuid4()),
                    vendor_id=v_id,
                    product_id=product.id,
                    price=offer_price,
                    stock=stock,
                    delivery_days=days,
                    warranty_years=war_yrs,
                    warranty_text=war_txt,
                    return_policy="30-day DOA zero-penalty replacement" if war_yrs >= 3 else "14-day standard merchant replacement",
                    is_available=True
                )
                offers_to_add.append(offer)
                offer_count_created += 1

        db.add_all(offers_to_add)
        db.commit()
        logger.info(f"Seeded {offer_count_created} Curated Vendor Offers linking 120 Products and 25 Vendors.")

        # 4. Upsert 5 Policies
        for pdata in POLICIES_DATA:
            existing = db.query(PolicyRule).filter(PolicyRule.policy_code == pdata["policy_code"]).first()
            if existing:
                existing.title = pdata["title"]
                existing.category = pdata["category"]
                existing.rule_description = pdata["rule_description"]
                existing.policy_type = pdata["policy_type"]
                existing.threshold_value = pdata["threshold_value"]
                existing.operator = pdata["operator"]
                existing.impact = pdata["impact"]
                existing.is_active = pdata["is_active"]
            else:
                policy = PolicyRule(
                    id=str(uuid.uuid4()),
                    policy_code=pdata["policy_code"],
                    title=pdata["title"],
                    category=pdata["category"],
                    rule_description=pdata["rule_description"],
                    policy_type=pdata["policy_type"],
                    threshold_value=pdata["threshold_value"],
                    operator=pdata["operator"],
                    impact=pdata["impact"],
                    is_active=pdata["is_active"]
                )
                db.add(policy)
        db.commit()
        logger.info("Seeded 5 Enterprise Governance Policy Rules.")

    except Exception as e:
        db.rollback()
        logger.error(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
