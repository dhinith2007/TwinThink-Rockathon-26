import logging
from datetime import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.audit import AuditEvent

logger = logging.getLogger(__name__)

class AuditService:
    """
    Tamper-Evident SHA-256 Hash Chained Audit Service.
    Guarantees cryptographic traceability across the full procurement lifecycle.
    """

    def log_event(
        self,
        db: Session,
        request_id: str,
        event_type: str,
        event_title: str,
        stage: str,
        actor: str,
        event_message: str,
        metadata: Optional[Dict[str, Any]] = None,
        status: str = "COMPLETED",
        timestamp: Optional[datetime] = None
    ) -> AuditEvent:
        if timestamp is None:
            timestamp = datetime.utcnow()

        # Find the latest audit event for this request to chain previous hash
        latest_event = (
            db.query(AuditEvent)
            .filter(AuditEvent.request_id == request_id)
            .order_by(AuditEvent.sequence_order.desc(), AuditEvent.timestamp.desc())
            .first()
        )

        previous_hash = latest_event.event_hash if latest_event else "GENESIS"
        sequence_order = (latest_event.sequence_order + 1) if (latest_event and latest_event.sequence_order is not None) else 1
        timestamp_str = timestamp.isoformat()

        # Compute genuine SHA-256 hash
        event_hash = AuditEvent.calculate_hash(
            request_id=request_id,
            event_type=event_type,
            stage=stage,
            actor=actor,
            message=event_message,
            metadata=metadata or {},
            previous_hash=previous_hash,
            timestamp_str=timestamp_str
        )

        audit_entry = AuditEvent(
            request_id=request_id,
            sequence_order=sequence_order,
            event_type=event_type,
            event_title=event_title,
            stage=stage,
            status=status,
            actor=actor,
            event_message=event_message,
            metadata_json=metadata or {},
            previous_event_hash=previous_hash,
            event_hash=event_hash,
            timestamp=timestamp
        )

        db.add(audit_entry)
        db.commit()
        db.refresh(audit_entry)
        return audit_entry

    def get_events_for_request(self, db: Session, request_id: str) -> List[AuditEvent]:
        return (
            db.query(AuditEvent)
            .filter(AuditEvent.request_id == request_id)
            .order_by(AuditEvent.sequence_order.asc(), AuditEvent.timestamp.asc())
            .all()
        )

audit_service = AuditService()
