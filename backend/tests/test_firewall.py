import pytest
from app.models.vendor import Vendor
from app.models.policy import PolicyRule
from app.services.policy_service import policy_service

def test_3_tier_budget_policy():
    policies = [
        PolicyRule(
            policy_code="POL-001",
            title="Maximum Purchase Authorization Tiering",
            category="Financial Governance",
            rule_description="Purchases up to ₹2L auto-approved, ₹2L-₹5L VP review, >₹5L block",
            policy_type="BUDGET_THRESHOLD",
            threshold_value="200000.0,500000.0",
            operator="TIERED_BUDGET"
        ),
        PolicyRule(
            policy_code="POL-002",
            title="Vendor Reliability Threshold",
            category="Quality Assurance",
            rule_description="Reliability >= 85%",
            policy_type="VENDOR_RELIABILITY",
            threshold_value="85.0",
            operator="GTE"
        ),
        PolicyRule(
            policy_code="POL-004",
            title="Approved IT Asset Categories",
            category="Compliance",
            rule_description="Whitelisted category",
            policy_type="APPROVED_CATEGORY",
            threshold_value="IT Hardware,Enterprise Peripherals",
            operator="IN_LIST"
        )
    ]

    vendor_valid = Vendor(
        vendor_code="VEN-001",
        name="CompSource",
        category="IT Hardware",
        price=42000.0,
        reliability_score=94.0
    )

    # Case 1: Amount = ₹1,68,000 (<= ₹2L) -> ALLOW
    status_allow, checks_allow, _ = policy_service.evaluate_policies(
        policies=policies,
        vendor=vendor_valid,
        quantity=4,
        unit_price=42000.0,
        target_budget_per_unit=45000.0
    )
    assert status_allow == "ALLOW"

    # Case 2: Amount = ₹4,20,000 (₹2L - ₹5L) -> ESCALATE (10 laptops @ ₹42,000)
    status_esc, checks_esc, reason_esc = policy_service.evaluate_policies(
        policies=policies,
        vendor=vendor_valid,
        quantity=10,
        unit_price=42000.0,
        target_budget_per_unit=45000.0
    )
    assert status_esc == "ESCALATE"
    assert "₹2,00,000" in reason_esc

    # Case 3: Amount = ₹8,40,000 (> ₹5L) -> BLOCK (20 laptops @ ₹42,000)
    status_block, checks_block, reason_block = policy_service.evaluate_policies(
        policies=policies,
        vendor=vendor_valid,
        quantity=20,
        unit_price=42000.0,
        target_budget_per_unit=45000.0
    )
    assert status_block == "BLOCK"
    assert "₹5,00,000" in reason_block
