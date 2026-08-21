import logging
from typing import Dict, Any, List, Tuple
from app.models.vendor import Vendor
from app.models.policy import PolicyRule
from app.schemas.procurement import PolicyCheckDTO

logger = logging.getLogger(__name__)

class PolicyService:
    """
    Deterministic Authorization Firewall Engine.
    Evaluates policy rules against selected vendor and purchase metrics.
    
    Refinement #2 (Explicit 3-Tier Budget Policy):
      - <= ₹2,00,000     -> ALLOW (Autonomous Execution)
      - ₹2,00,001 - ₹5L  -> ESCALATE (Requires VP / Executive Approval)
      - > ₹5,00,000      -> BLOCK (Exceeds Departmental Spending Limit)
    """

    def evaluate_policies(
        self,
        policies: List[PolicyRule],
        vendor: Vendor,
        quantity: int,
        unit_price: float,
        target_budget_per_unit: float
    ) -> Tuple[str, List[PolicyCheckDTO], str]:
        total_amount = quantity * unit_price
        checks: List[PolicyCheckDTO] = []
        overall_status = "ALLOW"
        escalation_reason = ""

        for pol in policies:
            code = pol.policy_code
            status = "PASSED"
            details = ""

            if code == "POL-001" or pol.policy_type == "BUDGET_THRESHOLD":
                # 3-Tier Budget Governance
                if total_amount <= 200000.0:
                    status = "PASSED"
                    details = f"Total amount ₹{total_amount:,.0f} is within autonomous limit (≤₹2,00,000)."
                elif total_amount <= 500000.0:
                    status = "ESCALATED"
                    details = f"Total amount ₹{total_amount:,.0f} exceeds auto-cap (₹2,00,000) but is within VP approval ceiling (≤₹5,00,000). Executive sign-off required."
                    if overall_status != "BLOCK":
                        overall_status = "ESCALATE"
                    escalation_reason = f"Purchase amount (₹{total_amount:,.0f}) exceeds autonomous limit of ₹2,00,000. Requires VP sign-off."
                else:
                    status = "BLOCKED"
                    details = f"Total amount ₹{total_amount:,.0f} exceeds maximum departmental cap of ₹5,00,000. Autonomous action blocked."
                    overall_status = "BLOCK"
                    escalation_reason = f"Purchase amount (₹{total_amount:,.0f}) exceeds hard limit of ₹5,00,000."

            elif code == "POL-002" or pol.policy_type == "VENDOR_RELIABILITY":
                if vendor.reliability_score >= 85.0:
                    status = "PASSED"
                    details = f"Supplier reliability ({vendor.reliability_score:.0f}%) satisfies minimum 85% requirement."
                else:
                    status = "BLOCKED"
                    details = f"Supplier reliability ({vendor.reliability_score:.0f}%) is below mandatory 85% threshold."
                    overall_status = "BLOCK"

            elif code == "POL-003" or pol.policy_type == "ITEM_BUDGET_CAP":
                if unit_price <= 50000.0:
                    status = "PASSED"
                    details = f"Unit price ₹{unit_price:,.0f} complies with per-item ceiling of ₹50,000."
                else:
                    status = "ESCALATED"
                    details = f"Unit price ₹{unit_price:,.0f} exceeds ₹50,000 ceiling. Requires finance exception review."
                    if overall_status != "BLOCK":
                        overall_status = "ESCALATE"

            elif code == "POL-004" or pol.policy_type == "APPROVED_CATEGORY":
                whitelisted = [c.strip() for c in pol.threshold_value.split(",")]
                if vendor.category in whitelisted:
                    status = "PASSED"
                    details = f"Category '{vendor.category}' is whitelisted in corporate asset registry."
                else:
                    status = "BLOCKED"
                    details = f"Category '{vendor.category}' is not in approved corporate purchasing list."
                    overall_status = "BLOCK"

            elif code == "POL-005" or pol.policy_type == "NEGOTIATION_TOLERANCE":
                variance = ((unit_price - target_budget_per_unit) / target_budget_per_unit) * 100.0 if target_budget_per_unit > 0 else 0.0
                if variance <= 8.0:
                    status = "ACTIVE"
                    details = f"Price variance ({variance:+.1f}%) is within autonomous ±8% negotiation corridor."
                else:
                    status = "ESCALATED"
                    details = f"Price variance ({variance:+.1f}%) exceeds 8% negotiation boundary."
                    if overall_status != "BLOCK":
                        overall_status = "ESCALATE"

            checks.append(PolicyCheckDTO(
                policy_code=code,
                title=pol.title,
                category=pol.category,
                status=status,
                details=details,
                impact=pol.impact
            ))

        return overall_status, checks, escalation_reason

policy_service = PolicyService()
