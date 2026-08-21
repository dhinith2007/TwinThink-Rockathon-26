import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["api"] == "healthy"
    assert data["database"] == "connected"
    assert "ready" in data["ai_engine"]
    assert data["active_vendors_count"] >= 3

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
    assert data["recommended_vendor"]["name"] == "CompSource Enterprise Ltd."
    assert data["decision"]["authorization_status"] == "ESCALATE" # Due to ₹4.2L > ₹2L
    assert len(data["audit_events"]) >= 5

    # 2. Test State Rehydration Endpoint (GET /api/procurement/{id})
    rehydrate_res = client.get(f"/api/procurement/{request_id}")
    assert rehydrate_res.status_code == 200
    rehydrate_data = rehydrate_res.json()
    assert rehydrate_data["request_id"] == request_id
    assert rehydrate_data["recommended_vendor"]["name"] == "CompSource Enterprise Ltd."

    # 3. Simulate Relaxation (POST /api/procurement/{id}/simulate-relaxation)
    relax_res = client.post(
        f"/api/procurement/{request_id}/simulate-relaxation",
        json={"delivery_days": 10}
    )
    assert relax_res.status_code == 200
    relax_data = relax_res.json()
    assert relax_data["delivery_days"] == 10
    assert relax_data["flexibility_score"] == 92

    # 4. Human Approval (POST /api/approvals/{id}/approve)
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
    assert appr_data["purchase_order"]["total_amount"] == 420000.0

    # 5. Audit Trail Verification (GET /api/procurement/{id}/audit)
    audit_res = client.get(f"/api/procurement/{request_id}/audit")
    assert audit_res.status_code == 200
    audit_list = audit_res.json()
    assert len(audit_list) >= 7 # Includes REQUEST_CREATED, CONSTRAINTS, VENDORS, NEGOTIATION, POLICY, DECISION, APPROVAL, PO

    # Verify SHA-256 Hash Chain Integrity
    for i in range(1, len(audit_list)):
        curr_prev_hash = audit_list[i]["previous_event_hash"]
        parent_hash = audit_list[i-1]["event_hash"]
        assert curr_prev_hash == parent_hash, f"Hash chain broken at event {i}"
