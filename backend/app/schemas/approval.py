from typing import Optional, Dict, Any
from pydantic import BaseModel, Field

class ApprovalActionRequest(BaseModel):
    action: str = Field(..., description="APPROVE, REJECT, or MODIFY")
    action_by: Optional[str] = "Human Executive"
    approver_role: Optional[str] = "VP Engineering / Procurement"
    comments: Optional[str] = None

class PurchaseOrderDTO(BaseModel):
    id: str
    po_number: str
    request_id: str
    vendor_name: str
    item_name: str
    quantity: int
    unit_price: float
    total_amount: float
    status: str
    issued_at: str
    delivery_address: str
    payment_terms: str

class ApprovalResponse(BaseModel):
    approval_id: str
    request_id: str
    decision_id: str
    status: str
    action_by: str
    comments: Optional[str] = None
    purchase_order: Optional[PurchaseOrderDTO] = None
    audit_event: Optional[Dict[str, Any]] = None
