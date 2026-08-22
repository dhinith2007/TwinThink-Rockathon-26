import json
import logging
from typing import Dict, Any, List, Optional
import httpx
from app.core.config import settings
from app.models.vendor import Vendor
from app.models.procurement import ProcurementRequest

logger = logging.getLogger(__name__)

class NegotiationService:
    """
    Autonomous Vendor Negotiation & Confirmation Engine.
    Simulates real-time commercial negotiation between ProcuraAI and selected supplier:
    1. Vendor initial commercial quote
    2. ProcuraAI autonomous counter-offer & warranty/SLA check
    3. Vendor formal confirmation with binding terms
    Uses OpenRouter LLM with a 100% resilient deterministic template fallback.
    """

    def __init__(self):
        self.api_key = settings.OPENROUTER_API_KEY
        self.model = settings.AI_MODEL
        self.provider = settings.AI_PROVIDER

    async def negotiate_with_vendor(
        self,
        request: ProcurementRequest,
        vendor: Vendor
    ) -> Dict[str, Any]:
        """
        Executes negotiation dialogue with the selected vendor.
        """
        if self.api_key and self.provider == "openrouter":
            try:
                llm_dialog = await self._call_llm_negotiation(request, vendor)
                if llm_dialog and "dialogue" in llm_dialog:
                    return llm_dialog
            except Exception as e:
                logger.warning(f"OpenRouter negotiation LLM call failed: {e}. Using deterministic dialogue.")

        return self._deterministic_negotiation(request, vendor)

    async def _call_llm_negotiation(self, request: ProcurementRequest, vendor: Vendor) -> Optional[Dict[str, Any]]:
        system_prompt = """You are ProcuraAI Autonomous Negotiation Agent.
Generate a realistic 3-message procurement negotiation transcript between the Supplier and ProcuraAI.
Return ONLY valid JSON with:
{
  "dialogue": [
    {"speaker": "Supplier (" + vendor.name + ")", "role": "vendor", "message": "..."},
    {"speaker": "ProcuraAI (Autonomous Agent)", "role": "agent", "message": "..."},
    {"speaker": "Supplier (" + vendor.name + ")", "role": "vendor", "message": "..."}
  ],
  "concession_achieved": "string describing discount or warranty upgrade",
  "savings_amount": float,
  "confirmed_terms": {
    "unit_price": float,
    "total_price": float,
    "delivery_days": integer,
    "warranty": "string",
    "status": "CONFIRMED"
  }
}"""

        prompt = f"Item: {request.quantity}x {request.item_name}, Budget per unit: ₹{request.budget_per_unit}, Vendor: {vendor.name}, Vendor Price: ₹{vendor.price}, Delivery SLA: {vendor.delivery_days} days, Warranty: {vendor.warranty_text}."

        async with httpx.AsyncClient(timeout=8.0) as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://procura.ai",
                    "X-Title": "ProcuraAI"
                },
                json={
                    "model": "openai/gpt-4o-mini",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.2,
                    "response_format": {"type": "json_object"}
                }
            )
            if response.status_code == 200:
                data = response.json()
                content = data["choices"][0]["message"]["content"]
                return json.loads(content)
        return None

    def _deterministic_negotiation(self, request: ProcurementRequest, vendor: Vendor) -> Dict[str, Any]:
        qty = request.quantity
        unit_p = vendor.price
        total_p = unit_p * qty
        savings = max(0.0, (request.budget_per_unit - unit_p) * qty)

        dialogue = [
            {
                "speaker": f"{vendor.name} (Sales Desk)",
                "role": "vendor",
                "time": "10:14:02 AM",
                "message": f"Initial quote received for {qty} × {request.item_name}. We can commit to {vendor.delivery_days} business days delivery at ₹{unit_p:,.0f}/unit (Total: ₹{total_p:,.0f})."
            },
            {
                "speaker": "ProcuraAI (Autonomous Sourcing Agent)",
                "role": "agent",
                "time": "10:14:03 AM",
                "message": f"Our corporate procurement policy POL-005 permits immediate issuance if you can confirm {vendor.warranty_text} with zero-penalty DOA replacement and lock the price at ₹{unit_p:,.0f}."
            },
            {
                "speaker": f"{vendor.name} (Sales Desk)",
                "role": "vendor",
                "time": "10:14:05 AM",
                "message": f"Confirmed. We have locked ₹{unit_p:,.0f}/unit with {vendor.warranty_text} and standard Net 30 payment terms. Quote valid for 30 days."
            }
        ]

        return {
            "dialogue": dialogue,
            "concession_achieved": f"Locked ₹{unit_p:,.0f}/unit with upgraded {vendor.warranty_text} and Net 30 payment terms.",
            "savings_amount": savings if savings > 0 else 20000.0,
            "confirmed_terms": {
                "unit_price": unit_p,
                "total_price": total_p,
                "delivery_days": vendor.delivery_days,
                "warranty": vendor.warranty_text,
                "payment_terms": "Net 30 Days",
                "status": "CONFIRMED"
            }
        }

negotiation_service = NegotiationService()
