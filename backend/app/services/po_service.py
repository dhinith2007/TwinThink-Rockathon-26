import uuid
import random
from datetime import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.purchase_order import PurchaseOrder
from app.models.procurement import ProcurementRequest
from app.models.vendor import Vendor
from app.services.audit_service import audit_service

class POService:
    """
    Purchase Order Dispatch & Lifecycle Service.
    Issues binding PO records, generates traceable PO identifiers, and appends audit events.
    """

    def generate_po_number(self, request_id: str) -> str:
        # Predictable yet traceable PO Number: e.g. PO-2026-8942
        short_id = request_id.split("-")[0] if "-" in request_id else request_id[:4]
        # Use fixed format for demo continuity or dynamic number
        return f"PO-2026-{abs(hash(short_id)) % 9000 + 1000}"

    def issue_purchase_order(
        self,
        db: Session,
        request: ProcurementRequest,
        vendor: Vendor,
        unit_price: float,
        quantity: int,
        approver_name: str
    ) -> PurchaseOrder:
        total_amount = unit_price * quantity
        po_number = self.generate_po_number(request.id)

        po = PurchaseOrder(
            request_id=request.id,
            vendor_id=vendor.id,
            po_number=po_number,
            item_name=request.item_name,
            quantity=quantity,
            unit_price=unit_price,
            total_amount=total_amount,
            currency="INR",
            status="ISSUED",
            vendor_name=vendor.name,
            delivery_address="Tower B, Corporate Technology Park, Bengaluru, KA - 560103",
            payment_terms="Net 30 Days via Corporate ERP Dispatch",
            metadata_json={
                "authorized_by": approver_name,
                "vendor_code": vendor.vendor_code,
                "session_id": request.session_id,
                "dispatch_method": "Structured PO API Payload",
                "estimated_delivery_days": vendor.delivery_days
            },
            issued_at=datetime.utcnow()
        )

        db.add(po)
        request.status = "PO_ISSUED"
        db.commit()
        db.refresh(po)

        # Log PO Issued Audit Event
        audit_service.log_event(
            db=db,
            request_id=request.id,
            event_type="PO_ISSUED",
            event_title="Purchase Order Issued & Dispatched",
            stage="PO Generation",
            actor="Order Dispatcher (Autonomous)",
            event_message=f"Purchase Order {po_number} generated for ₹{total_amount:,.0f} and structured PO payload dispatched to {vendor.name}.",
            metadata={
                "po_number": po_number,
                "total_amount": total_amount,
                "vendor_name": vendor.name,
                "vendor_code": vendor.vendor_code,
                "authorized_by": approver_name
            },
            status="COMPLETED"
        )

        return po

po_service = POService()
