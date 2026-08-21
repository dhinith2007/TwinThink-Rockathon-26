import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.database import Base

class Approval(Base):
    __tablename__ = "approvals"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    request_id = Column(String(36), ForeignKey("procurement_requests.id"), nullable=False, unique=True)
    decision_id = Column(String(36), ForeignKey("decisions.id"), nullable=False)
    
    status = Column(String(20), nullable=False, default="PENDING") # PENDING, APPROVED, REJECTED, MODIFIED
    action_by = Column(String(100), default="Human Executive")
    approver_role = Column(String(100), default="VP Engineering / Procurement")
    comments = Column(Text, nullable=True)
    approved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    request = relationship("ProcurementRequest", back_populates="approval")
