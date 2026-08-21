from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.procurement import ProcurementRequest
from app.models.decision import Decision
from app.models.approval import Approval
from app.models.vendor import Vendor
from app.schemas.approval import ApprovalActionRequest, ApprovalResponse, PurchaseOrderDTO
from app.services.po_service import po_service
from app.services.audit_service import audit_service

router = APIRouter(prefix="/approvals", tags=["Approvals & PO"])

@router.post("/{request_id}/approve", response_model=ApprovalResponse)
def approve_procurement_decision(
    request_id: str,
    payload: ApprovalActionRequest,
    db: Session = Depends(get_db)
):
    """
    Executes human sign-off (APPROVE, REJECT, or MODIFY).
    On APPROVE, issues a formal Purchase Order and updates audit history.
    """
    req = db.query(ProcurementRequest).filter(ProcurementRequest.id == request_id).first()
    if not req:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Procurement request '{request_id}' not found."
        )

    decision = req.decision
    if not decision:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No decision packet exists for this request."
        )

    vendor = decision.vendor
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No vendor assigned to this decision."
        )

    # Fetch or create approval record
    approval = req.approval
    if not approval:
        approval = Approval(
            request_id=req.id,
            decision_id=decision.id,
            status="PENDING",
            action_by=payload.action_by or "Human Executive",
            approver_role=payload.approver_role or "VP Engineering / Procurement"
        )
        db.add(approval)
        db.commit()
        db.refresh(approval)

    action_upper = payload.action.upper()
    approval.status = action_upper
    approval.action_by = payload.action_by or "Human Executive"
    approval.comments = payload.comments or f"Decision {action_upper} granted by {payload.action_by}."
    approval.approved_at = datetime.utcnow()
    db.commit()

    po_dto = None

    if action_upper == "APPROVE":
        # Issue Purchase Order
        po = po_service.issue_purchase_order(
            db=db,
            request=req,
            vendor=vendor,
            unit_price=vendor.price,
            quantity=req.quantity,
            approver_name=payload.action_by or "Human Executive"
        )

        po_dto = PurchaseOrderDTO(
            id=po.id,
            po_number=po.po_number,
            request_id=po.request_id,
            vendor_name=po.vendor_name,
            item_name=po.item_name,
            quantity=po.quantity,
            unit_price=po.unit_price,
            total_amount=po.total_amount,
            status=po.status,
            issued_at=po.issued_at.strftime("%I:%M:%S %p"),
            delivery_address=po.delivery_address,
            payment_terms=po.payment_terms
        )

        # Log Human Approval Audit Event
        audit_service.log_event(
            db=db,
            request_id=req.id,
            event_type="APPROVAL_GRANTED",
            event_title="Human Executive Approval Granted",
            stage="Human Oversight",
            actor=f"{payload.action_by} ({payload.approver_role})",
            event_message=f"Executive sign-off granted by {payload.action_by}. Bypassed budget escalation limit with official VP signature.",
            metadata={"approver": payload.action_by, "comments": approval.comments, "po_number": po.po_number},
            status="APPROVED"
        )

    elif action_upper == "REJECT":
        req.status = "REJECTED"
        db.commit()
        audit_service.log_event(
            db=db,
            request_id=req.id,
            event_type="APPROVAL_REJECTED",
            event_title="Human Executive Rejected Decision",
            stage="Human Oversight",
            actor=f"{payload.action_by} ({payload.approver_role})",
            event_message=f"Purchase request rejected by {payload.action_by}. Reason: {payload.comments or 'Executive prerogative'}.",
            metadata={"approver": payload.action_by, "comments": payload.comments},
            status="REJECTED"
        )

    return ApprovalResponse(
        approval_id=approval.id,
        request_id=req.id,
        decision_id=decision.id,
        status=approval.status,
        action_by=approval.action_by,
        comments=approval.comments,
        purchase_order=po_dto
    )
