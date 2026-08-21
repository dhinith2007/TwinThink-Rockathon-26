import uuid
import json
import hashlib
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from app.db.database import Base

class AuditEvent(Base):
    __tablename__ = "audit_events"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    request_id = Column(String(36), ForeignKey("procurement_requests.id"), nullable=False, index=True)
    event_type = Column(String(50), nullable=False) # REQUEST_CREATED, CONSTRAINTS_EXTRACTED, VENDORS_EVALUATED, etc.
    event_title = Column(String(200), nullable=False)
    stage = Column(String(50), nullable=False) # Intent, Constraint, Sourcing, Policy, Approval, PO
    status = Column(String(20), default="COMPLETED") # COMPLETED, ESCALATED, BLOCKED, APPROVED
    actor = Column(String(100), nullable=False) # User, AI Engine, Policy Engine, Human Executive
    event_message = Column(Text, nullable=False)
    metadata_json = Column(JSON, default=dict)
    
    # Genuine SHA-256 Hash Chain
    previous_event_hash = Column(String(64), nullable=True)
    event_hash = Column(String(64), nullable=False)
    
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

    request = relationship("ProcurementRequest", back_populates="audit_events")

    @staticmethod
    def calculate_hash(
        request_id: str,
        event_type: str,
        stage: str,
        actor: str,
        message: str,
        metadata: dict,
        previous_hash: str,
        timestamp_str: str
    ) -> str:
        """Computes a canonical SHA-256 hash for genuine tamper-evident auditing."""
        payload = {
            "request_id": request_id,
            "event_type": event_type,
            "stage": stage,
            "actor": actor,
            "message": message,
            "metadata": metadata or {},
            "previous_hash": previous_hash or "GENESIS",
            "timestamp": timestamp_str
        }
        canonical_str = json.dumps(payload, sort_keys=True, separators=(',', ':'))
        return hashlib.sha256(canonical_str.encode('utf-8')).hexdigest()
