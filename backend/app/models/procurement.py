import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.database import Base

class ProcurementRequest(Base):
    __tablename__ = "procurement_requests"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String(50), nullable=False, index=True)
    item_name = Column(String(200), nullable=False)
    title = Column(String(250), nullable=True)
    quantity = Column(Integer, nullable=False, default=1)
    budget_per_unit = Column(Float, nullable=False, default=0.0)
    total_budget = Column(Float, nullable=False, default=0.0)
    delivery_days = Column(Integer, nullable=False, default=7)
    priority = Column(String(20), nullable=False, default="Medium")
    raw_request = Column(Text, nullable=False)
    status = Column(String(50), nullable=False, default="ANALYZED") # ANALYZED, ESCALATED, APPROVED, REJECTED, PO_ISSUED
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    constraints = relationship("ExtractedConstraint", back_populates="request", cascade="all, delete-orphan")
    evaluations = relationship("VendorEvaluation", back_populates="request", cascade="all, delete-orphan")
    decision = relationship("Decision", back_populates="request", uselist=False, cascade="all, delete-orphan")
    approval = relationship("Approval", back_populates="request", uselist=False, cascade="all, delete-orphan")
    purchase_order = relationship("PurchaseOrder", back_populates="request", uselist=False, cascade="all, delete-orphan")
    audit_events = relationship("AuditEvent", back_populates="request", cascade="all, delete-orphan")

class ExtractedConstraint(Base):
    __tablename__ = "constraints"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    request_id = Column(String(36), ForeignKey("procurement_requests.id"), nullable=False, index=True)
    constraint_type = Column(String(20), nullable=False) # HARD, SOFT, AMBIGUITY
    name = Column(String(100), nullable=False)
    value = Column(String(200), nullable=False)
    is_mandatory = Column(Boolean, default=True)
    source = Column(String(50), default="AI_EXTRACTION")
    confidence = Column(Float, default=1.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    request = relationship("ProcurementRequest", back_populates="constraints")
