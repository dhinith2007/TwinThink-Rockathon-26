import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, DateTime, JSON
from app.db.database import Base

class PolicyRule(Base):
    __tablename__ = "policies"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    policy_code = Column(String(20), unique=True, nullable=False) # e.g. POL-001
    title = Column(String(200), nullable=False)
    category = Column(String(100), nullable=False) # Financial, Quality, Category, Boundary
    rule_description = Column(String(500), nullable=False)
    policy_type = Column(String(50), nullable=False) # BUDGET_THRESHOLD, VENDOR_RELIABILITY, APPROVED_CATEGORY, ITEM_BUDGET_CAP, NEGOTIATION_TOLERANCE
    threshold_value = Column(String(500), nullable=False)
    operator = Column(String(50), nullable=False) # LTE, GTE, EQ, IN_LIST
    impact = Column(String(200), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
