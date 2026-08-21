import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.database import Base

class Decision(Base):
    __tablename__ = "decisions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    request_id = Column(String(36), ForeignKey("procurement_requests.id"), nullable=False, unique=True)
    selected_vendor_id = Column(String(36), ForeignKey("vendors.id"), nullable=False)
    
    authorization_status = Column(String(20), nullable=False) # ALLOW, ESCALATE, BLOCK
    confidence_score = Column(Float, default=94.0)
    summary = Column(String(500), nullable=False)
    reasoning_steps = Column(JSON, default=list)
    policy_checks = Column(JSON, default=list) # [{policy_code, title, status, details}]
    tradeoff_analysis = Column(JSON, default=dict)
    alternatives_summary = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

    request = relationship("ProcurementRequest", back_populates="decision")
    vendor = relationship("Vendor")
