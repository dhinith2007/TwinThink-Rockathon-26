import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.seed import seed_db

@pytest.fixture(scope="session", autouse=True)
def init_test_db():
    seed_db()

client = TestClient(app)

def test_health_endpoint():
    with TestClient(app) as client:
        response = client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["api"] == "healthy"
        assert data["database"] == "connected"
        assert "ready" in data["ai_engine"]
        assert data["active_vendors_count"] >= 20

def test_full_procurement_e2e_journey():
    # 1. Analyze Request
    analyze_payload = {
        "raw_request": "Buy 10 Dell Latitude 5440 laptops under ₹45,000 each with 16GB RAM and delivery within 7 days",
        "quantity": 10,
        "budget_per_unit": 45000.0,
        "delivery_days": 7
    }
    response = client.post("/api/procurement/analyze", json=analyze_payload)
    assert response.status_code == 200
    data = response.json()

    request_id = data["request_id"]
    assert request_id is not None
    assert len(data["vendors"]) >= 3
    assert data["recommended_vendor"]["name"] in ["Dell Direct Enterprise OEM", "CompSource Enterprise Solutions", "CompSource Enterprise Ltd."]
    assert data["decision"]["authorization_status"] == "ESCALATE" # Due to > ₹2L
    assert len(data["audit_events"]) >= 5

    # 2. Test State Rehydration Endpoint (GET /api/procurement/{id})
    rehydrate_res = client.get(f"/api/procurement/{request_id}")
    assert rehydrate_res.status_code == 200
    rehydrate_data = rehydrate_res.json()
    assert rehydrate_data["request_id"] == request_id
    assert rehydrate_data["recommended_vendor"]["name"] in ["Dell Direct Enterprise OEM", "CompSource Enterprise Solutions", "CompSource Enterprise Ltd."]

    # 3. Simulate Relaxation (POST /api/procurement/{id}/simulate-relaxation)
    relax_res = client.post(
        f"/api/procurement/{request_id}/simulate-relaxation",
        json={"delivery_days": 10}
    )
    assert relax_res.status_code == 200
    relax_data = relax_res.json()
    assert relax_data["delivery_days"] == 10
    assert relax_data["flexibility_score"] >= 80

    # 4. Vendor Negotiation Simulation (POST /api/procurement/{id}/negotiate)
    neg_res = client.post(f"/api/procurement/{request_id}/negotiate")
    assert neg_res.status_code == 200
    neg_data = neg_res.json()
    assert len(neg_data["dialogue"]) >= 3
    assert neg_data["status"] == "CONFIRMED"

    # 5. Human Approval (POST /api/approvals/{id}/approve)
    approve_res = client.post(
        f"/api/approvals/{request_id}/approve",
        json={
            "action": "APPROVE",
            "action_by": "Ravi Kumar (VP Engineering)",
            "comments": "Approved 10 units of Dell Latitude 5440 with 3yr Onsite warranty."
        }
    )
    assert approve_res.status_code == 200
    appr_data = approve_res.json()
    assert appr_data["status"] == "APPROVE"
    assert appr_data["purchase_order"] is not None
    assert "PO-2026-" in appr_data["purchase_order"]["po_number"]
    assert appr_data["purchase_order"]["total_amount"] > 0

    # 6. Audit Trail Verification (GET /api/procurement/{id}/audit)
    audit_res = client.get(f"/api/procurement/{request_id}/audit")
    assert audit_res.status_code == 200
    audit_list = audit_res.json()
    assert len(audit_list) >= 7

    # Verify SHA-256 Hash Chain Integrity
    for i in range(1, len(audit_list)):
        curr_prev_hash = audit_list[i]["previous_event_hash"]
        parent_hash = audit_list[i-1]["event_hash"]
        assert curr_prev_hash == parent_hash, f"Hash chain broken at event {i}"

def test_generic_multi_category_procurement():
    """Verify system handles generic categories like Chairs, Monitors, Servers."""
    # Test Chairs
    chair_res = client.post("/api/procurement/analyze", json={
        "raw_request": "Procure 8 ergonomic office chairs under ₹8,000 each with 5-day delivery"
    })
    assert chair_res.status_code == 200
    chair_data = chair_res.json()
    assert chair_data["recommended_vendor"]["name"] == "ErgoPro Workspace Solutions"
    assert chair_data["decision"]["authorization_status"] == "ALLOW" # ₹57,600 is under ₹2.00L

    # Test Monitors
    monitor_res = client.post("/api/procurement/analyze", json={
        "raw_request": "Buy 8 27-inch 4K UHD monitors under ₹30,000 each"
    })
    assert monitor_res.status_code == 200
    monitor_data = monitor_res.json()
    assert "LG" in monitor_data["recommended_vendor"]["name"] or "VisionTek" in monitor_data["recommended_vendor"]["name"] or "UltraView" in monitor_data["recommended_vendor"]["name"]

def test_multi_brief_procurement_batch_workflow():
    """Verify Ravi scenario: Batch of 3 items (Laptops, Chairs, Monitors) with selective escalation."""
    batch_payload = {
        "batch_title": "Q3 Engineering Team Infrastructure Requisition",
        "requests": [
            {
                "raw_request": "Buy 10 Dell Latitude laptops under ₹45,000 each",
                "category": "Laptops",
                "quantity": 10,
                "budget_per_unit": 45000.0,
                "delivery_days": 7
            },
            {
                "raw_request": "Procure 8 ergonomic mesh chairs under ₹8,000 each",
                "category": "Office Furniture",
                "quantity": 8,
                "budget_per_unit": 8000.0,
                "delivery_days": 5
            },
            {
                "raw_request": "Buy 8 external 4K monitors under ₹28,000 each",
                "category": "Monitors",
                "quantity": 8,
                "budget_per_unit": 28000.0,
                "delivery_days": 5
            }
        ]
    }
    response = client.post("/api/procurement/batch", json=batch_payload)
    assert response.status_code == 200
    batch_data = response.json()
    assert batch_data["total_requests"] == 3
    assert batch_data["total_spend"] > 0
    assert len(batch_data["items"]) == 3
    # Verify chairs are auto-approved / completed
    chair_item = next(item for item in batch_data["items"] if "Chair" in item["item_name"] or "Furniture" in item["category"])
    assert chair_item["status"] == "COMPLETED"
    assert chair_item["po_number"] is not None

def test_vendor_catalog_search():
    """Verify multi-source vendor discovery across categories and source channels."""
    search_res = client.get("/api/vendors/search?category=Monitors")
    assert search_res.status_code == 200
    monitors = search_res.json()
    assert len(monitors) >= 3
    # Check source channel metadata
    assert any("Enterprise Direct" in m.get("source_channel", "") for m in monitors)
    assert any("B2B Marketplace" in m.get("source_channel", "") for m in monitors)
