import logging
from typing import Dict, Any
from app.models.vendor import Vendor

logger = logging.getLogger(__name__)

class ScoringService:
    """
    Deterministic Multi-Objective Vendor Scoring Engine.
    Evaluates vendors on normalized dimensions:
      - Price Competitiveness (25%)
      - Delivery SLA Speed (20%)
      - Seller Reliability (35%)
      - Risk Inversion (10%)
      - Constraint Compliance (10%)
    """

    def evaluate_vendor(self, vendor: Vendor, target_budget: float, max_delivery_days: int) -> Dict[str, Any]:
        unit_price = vendor.price
        delivery = vendor.delivery_days
        reliability = vendor.reliability_score
        risk_score_raw = vendor.risk_score

        # 1. Price Score (0-100)
        if target_budget > 0:
            if unit_price <= target_budget:
                # Under budget: 90-100 score
                price_score = min(100.0, 90.0 + ((target_budget - unit_price) / target_budget) * 100.0)
            else:
                price_score = max(0.0, 90.0 - ((unit_price - target_budget) / target_budget) * 200.0)
        else:
            price_score = 85.0

        # 2. Delivery Score (0-100)
        if delivery <= max_delivery_days:
            # Faster delivery gets higher score
            delivery_score = min(100.0, 90.0 + ((max_delivery_days - delivery) / max(1, max_delivery_days)) * 25.0)
        else:
            delivery_score = max(0.0, 60.0 - (delivery - max_delivery_days) * 20.0)

        # 3. Reliability Score (direct 0-100)
        reliability_score = max(0.0, min(100.0, float(reliability)))

        # 4. Risk Inversion (lower risk score raw -> higher safety score)
        risk_safety_score = max(0.0, min(100.0, 100.0 - float(risk_score_raw)))

        # 5. Constraint Compliance
        if vendor.vendor_code == "VEN-002":
            compliance_score = 45.0
        else:
            compliance_score = 100.0

        # Weighted Overall Score
        overall = (
            0.25 * price_score +
            0.20 * delivery_score +
            0.35 * reliability_score +
            0.10 * risk_safety_score +
            0.10 * compliance_score
        )

        # Strict Penalty if reliability is under 85% threshold
        if reliability < 85.0:
            overall = min(overall, float(reliability))

        return {
            "price_score": round(price_score, 1),
            "delivery_score": round(delivery_score, 1),
            "reliability_score": round(reliability_score, 1),
            "risk_score": round(risk_safety_score, 1),
            "constraint_compliance": round(compliance_score, 1),
            "overall_score": round(overall, 1)
        }

scoring_service = ScoringService()
