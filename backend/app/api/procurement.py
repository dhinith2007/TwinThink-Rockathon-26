from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.procurement import (
    ProcurementAnalyzeRequest,
    ProcurementResponse,
    SimulateRelaxationRequest,
    SimulateRelaxationResponse,
    AuditEventDTO,
    BatchProcurementRequest,
    BatchProcurementResponse,
    NegotiationResponse
)
from app.services.procurement_service import procurement_service
from app.services.audit_service import audit_service

router = APIRouter(prefix="/procurement", tags=["Procurement"])

@router.post("/analyze", response_model=ProcurementResponse)
async def analyze_procurement(req: ProcurementAnalyzeRequest, db: Session = Depends(get_db)):
    """
    Submits a natural language procurement intent, extracts constraints with hybrid AI,
    evaluates multi-source suppliers, runs policy firewall rules, and creates an audit-logged decision packet.
    """
    try:
        return await procurement_service.analyze_procurement(db, req)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Procurement analysis error: {str(e)}"
        )

@router.post("/batch", response_model=BatchProcurementResponse)
async def analyze_batch_procurement(batch_req: BatchProcurementRequest, db: Session = Depends(get_db)):
    """
    Executes multi-brief procurement batch (Ravi Scenario).
    Processes multiple requisition briefs (e.g. Laptops, Chairs, Monitors) across enterprise suppliers.
    """
    try:
        return await procurement_service.analyze_batch_procurement(db, batch_req)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Batch procurement error: {str(e)}"
        )

@router.post("/{request_id}/negotiate", response_model=NegotiationResponse)
async def negotiate_procurement(request_id: str, db: Session = Depends(get_db)):
    """
    Simulates real-time commercial negotiation and warranty/price confirmation between ProcuraAI and selected supplier.
    """
    try:
        return await procurement_service.negotiate_procurement(db, request_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Negotiation simulation error: {str(e)}"
        )

@router.get("/{request_id}", response_model=ProcurementResponse)
def get_procurement(request_id: str, db: Session = Depends(get_db)):
    """
    Rehydrates full procurement workflow state for a given request ID on refresh.
    """
    res = procurement_service.get_procurement_by_id(db, request_id)
    if not res:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Procurement request '{request_id}' not found."
        )
    return res

@router.post("/{request_id}/simulate-relaxation", response_model=SimulateRelaxationResponse)
def simulate_constraint_relaxation(
    request_id: str,
    payload: SimulateRelaxationRequest,
    db: Session = Depends(get_db)
):
    """
    Simulates real-time constraint relaxation for the Delivery SLA slider.
    """
    return procurement_service.simulate_relaxation(db, request_id, payload.delivery_days)

@router.get("/{request_id}/audit", response_model=List[AuditEventDTO])
def get_audit_trail(request_id: str, db: Session = Depends(get_db)):
    """
    Retrieves the complete cryptographic SHA-256 hash-chained audit trail.
    """
    records = audit_service.get_events_for_request(db, request_id)
    if not records:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No audit records found for request '{request_id}'."
        )
    return [
        AuditEventDTO(
            id=a.id,
            timestamp=a.timestamp.strftime("%I:%M:%S %p"),
            event_type=a.event_type,
            title=a.event_title,
            stage=a.stage,
            status=a.status,
            actor=a.actor,
            summary=a.event_message,
            details=a.metadata_json or {},
            event_hash=a.event_hash,
            previous_event_hash=a.previous_event_hash
        )
        for a in records
    ]
