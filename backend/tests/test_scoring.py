import pytest
from app.models.vendor import Vendor
from app.services.scoring_service import scoring_service

def test_vendor_scoring_deterministic():
    vendor_a = Vendor(
        vendor_code="VEN-001",
        name="CompSource Enterprise Ltd.",
        price=42000.0,
        delivery_days=5,
        reliability_score=94.0,
        risk_score=14.0
    )

    vendor_b = Vendor(
        vendor_code="VEN-002",
        name="QuickShip Direct Logistics",
        price=39000.0,
        delivery_days=7,
        reliability_score=63.0,
        risk_score=67.0
    )

    score_a = scoring_service.evaluate_vendor(vendor_a, target_budget=45000.0, max_delivery_days=7)
    score_b = scoring_service.evaluate_vendor(vendor_b, target_budget=45000.0, max_delivery_days=7)

    # Vendor A must win over Vendor B due to superior reliability and low risk
    assert score_a["overall_score"] > 90.0
    assert score_b["overall_score"] <= 63.0
    assert score_a["overall_score"] > score_b["overall_score"]
