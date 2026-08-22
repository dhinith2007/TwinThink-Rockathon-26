import pytest
import asyncio
from app.db.database import SessionLocal
from app.services.vendor_source_service import vendor_source_service
from app.services.ai_service import ai_service
from app.services.procurement_service import ProcurementService
from app.schemas.procurement import ProcurementAnalyzeRequest
from app.models.knowledge_base import Product, VendorOffer
from app.models.vendor import Vendor

@pytest.fixture(scope="module")
def db_session():
    db = SessionLocal()
    yield db
    db.close()

def test_knowledge_base_scale(db_session):
    """Verifies that knowledge base contains at least 120 products, 25 vendors, and 360 offers."""
    products_count = db_session.query(Product).count()
    vendors_count = db_session.query(Vendor).count()
    offers_count = db_session.query(VendorOffer).count()

    assert products_count >= 120, f"Expected >= 120 products, got {products_count}"
    assert vendors_count >= 25, f"Expected >= 25 vendors, got {vendors_count}"
    assert offers_count >= 360, f"Expected >= 360 offers, got {offers_count}"

def test_category_normalization_aliases():
    """Verifies semantic category aliasing for all judge inputs and conversational synonyms."""
    assert vendor_source_service.normalize_category("25 Bluetooth keyboards") == "Keyboards"
    assert vendor_source_service.normalize_category("typing device") == "Keyboards"
    assert vendor_source_service.normalize_category("input devices") == "Keyboards"
    assert vendor_source_service.normalize_category("8 ergonomic chairs") == "Office Furniture"
    assert vendor_source_service.normalize_category("mesh chair") == "Office Furniture"
    assert vendor_source_service.normalize_category("standing desk") == "Office Furniture"
    assert vendor_source_service.normalize_category("10 laptops") == "Laptops"
    assert vendor_source_service.normalize_category("ultrabook") == "Laptops"
    assert vendor_source_service.normalize_category("6 monitors") == "Monitors"
    assert vendor_source_service.normalize_category("27 inch display") == "Monitors"
    assert vendor_source_service.normalize_category("screen") == "Monitors"
    assert vendor_source_service.normalize_category("2 servers") == "Servers"
    assert vendor_source_service.normalize_category("15 laptop stands") == "Laptop Stands"
    assert vendor_source_service.normalize_category("desk riser") == "Laptop Stands"
    assert vendor_source_service.normalize_category("wireless mouse") == "Mice"
    assert vendor_source_service.normalize_category("thunderbolt dock") == "Docking Stations"

def test_two_source_discovery(db_session):
    """Verifies multi-source offer retrieval discovers both Source A and Source B offers."""
    discovery = vendor_source_service.discover_offers(db_session, category="Laptops")
    assert discovery["source_a_offers_count"] > 0, "Expected Source A (Enterprise Direct) offers"
    assert discovery["source_b_offers_count"] > 0, "Expected Source B (B2B Marketplace) offers"
    assert discovery["total_matching_offers"] >= 10
    assert "discovered" in discovery["summary_tag"].lower()

@pytest.mark.asyncio
async def test_scenario_1_keyboards(db_session):
    """Scenario 1: '25 Bluetooth keyboards' -> Works, normalized to Keyboards, dual source."""
    svc = ProcurementService()
    req = ProcurementAnalyzeRequest(raw_request="Procure 25 Bluetooth keyboards with low latency under 4500 per unit")
    resp = await svc.analyze_procurement(db_session, req)
    
    assert resp.quantity == 25
    assert resp.decision.authorization_status in ["ALLOW", "ESCALATE"]
    assert len(resp.vendors) > 0
    assert resp.ai_funnel is not None
    assert resp.ai_funnel["total_products_considered"] == 120

@pytest.mark.asyncio
async def test_scenario_2_chairs(db_session):
    """Scenario 2: '8 ergonomic chairs' -> Works, normalized to Office Furniture."""
    svc = ProcurementService()
    req = ProcurementAnalyzeRequest(raw_request="Need 8 ergonomic chairs with adjustable lumbar and 3D armrests")
    resp = await svc.analyze_procurement(db_session, req)
    
    assert resp.quantity == 8
    assert len(resp.vendors) > 0
    assert resp.recommended_vendor is not None

@pytest.mark.asyncio
async def test_scenario_3_laptops(db_session):
    """Scenario 3: '10 laptops' -> Works, compares DellDirect, CompSource, TechnoWorld."""
    svc = ProcurementService()
    req = ProcurementAnalyzeRequest(raw_request="Buy 10 laptops with 16GB RAM for engineering under 50k")
    resp = await svc.analyze_procurement(db_session, req)
    
    assert resp.quantity == 10
    assert len(resp.vendors) >= 3

@pytest.mark.asyncio
async def test_scenario_4_monitors(db_session):
    """Scenario 4: '6 monitors' -> Works, compares LG Partner, DisplayHub, etc."""
    svc = ProcurementService()
    req = ProcurementAnalyzeRequest(raw_request="Order 6 monitors 4K UHD with USB-C 60W delivery")
    resp = await svc.analyze_procurement(db_session, req)
    
    assert resp.quantity == 6
    assert len(resp.vendors) > 0

@pytest.mark.asyncio
async def test_scenario_5_servers(db_session):
    """Scenario 5: '2 servers' -> High budget triggers escalation in Policy Firewall."""
    svc = ProcurementService()
    req = ProcurementAnalyzeRequest(raw_request="Procure 2 rack servers 2U with dual Xeon and 128GB RAM")
    resp = await svc.analyze_procurement(db_session, req)
    
    assert resp.quantity == 2
    # Total cost for 2 enterprise servers is ~6.5L, which exceeds 2.0L threshold -> ESCALATES
    assert resp.decision.authorization_status in ["ESCALATE", "BLOCK"]

@pytest.mark.asyncio
async def test_scenario_6_stands(db_session):
    """Scenario 6: '15 laptop stands' -> Works, discovers accessory suppliers."""
    svc = ProcurementService()
    req = ProcurementAnalyzeRequest(raw_request="Procure 15 laptop stands aluminum adjustable for remote staff")
    resp = await svc.analyze_procurement(db_session, req)
    
    assert resp.quantity == 15
    assert len(resp.vendors) > 0

@pytest.mark.asyncio
async def test_scenario_7_unseen_query_fallback(db_session):
    """Scenario 7: Unseen conversational query gracefully handled."""
    svc = ProcurementService()
    req = ProcurementAnalyzeRequest(raw_request="We need some reliable typing devices and screen units quickly for onboarding")
    resp = await svc.analyze_procurement(db_session, req)
    
    assert resp.quantity >= 1
    assert resp.recommended_vendor is not None
    assert len(resp.reasoning_steps) >= 5
