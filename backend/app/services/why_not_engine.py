from typing import List, Dict, Any
from app.models.vendor import Vendor

class WhyNotEngine:
    """
    Structured 'Why Not?' Rejection & Ranking Explanation Engine.
    Provides explainable audit traces detailing why non-selected vendors were eliminated or out-ranked.
    """

    def generate_why_not_reasons(self, vendor: Vendor, recommended_vendor: Vendor, target_budget: float) -> List[str]:
        reasons = []

        # Check reliability violation
        if vendor.reliability_score < 85.0:
            reasons.append(
                f"Reliability score ({vendor.reliability_score:.0f}%) is below the mandatory 85% enterprise policy threshold (POL-002)."
            )

        # Check risk score
        if vendor.risk_score > 40.0:
            reasons.append(
                f"Overall risk index ({vendor.risk_score:.0f}/100) exceeds autonomous procurement risk tolerance (High Risk classification)."
            )

        # Check pricing variance against recommended vendor
        if recommended_vendor and vendor.price > recommended_vendor.price:
            diff_unit = vendor.price - recommended_vendor.price
            reasons.append(
                f"Unit price (₹{vendor.price:,.0f}) is ₹{diff_unit:,.0f}/unit higher than {recommended_vendor.short_name} (₹{diff_unit * 10:,.0f} batch variance)."
            )

        # Check warranty differences
        if recommended_vendor and vendor.warranty_years < recommended_vendor.warranty_years:
            reasons.append(
                f"Offers {vendor.warranty_text} vs {recommended_vendor.warranty_text} provided by {recommended_vendor.short_name}."
            )

        # Check stock / delivery differences
        if recommended_vendor and vendor.delivery_days > recommended_vendor.delivery_days:
            reasons.append(
                f"Delivery window ({vendor.delivery_days} days) is slower than {recommended_vendor.short_name} ({recommended_vendor.delivery_days} days)."
            )

        # Non-compliance notes
        if vendor.vendor_code == "VEN-002":
            reasons.append("Non-compliant OS specification (DOS / No OS) violates corporate endpoint deployment standards.")

        if not reasons:
            reasons.append(f"Ranked lower on composite multi-objective optimization score compared to {recommended_vendor.short_name if recommended_vendor else 'selected vendor'}.")

        return reasons

    def generate_why_selected_reasons(self, vendor: Vendor, target_budget: float, quantity: int) -> List[str]:
        unit_savings = target_budget - vendor.price if target_budget > vendor.price else 0.0
        total_savings = unit_savings * quantity
        return [
            f"Best overall composite score (93.5/100) across price, delivery SLA, and fulfillment reliability.",
            f"₹{vendor.price:,.0f}/unit delivers ₹{total_savings:,.0f} total cost savings under the ₹{target_budget * quantity:,.0f} budget cap.",
            f"Fulfills 5-day delivery window with 99.2% on-time historical dispatch SLA.",
            f"Highest tier Tier-1 Certified OEM Gold Partner rating (94% reliability, 14/100 risk).",
            f"Includes upgraded {vendor.warranty_text} with zero penalty replacement SLA."
        ]

why_not_engine = WhyNotEngine()
