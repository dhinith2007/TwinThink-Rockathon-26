import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.database import Base

class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    vendor_code = Column(String(20), unique=True, nullable=False, index=True) # e.g. VEN-001
    name = Column(String(200), nullable=False)
    short_name = Column(String(50), nullable=False)
    category = Column(String(100), nullable=False, default="IT Hardware")
    price = Column(Float, nullable=False)
    delivery_days = Column(Integer, nullable=False)
    reliability_score = Column(Float, nullable=False) # e.g. 94.0
    seller_rating = Column(String(100), nullable=True)
    warranty_years = Column(Integer, default=2)
    warranty_text = Column(String(100), default="2 Years Onsite")
    risk_level = Column(String(20), default="Low") # Low, Medium, High
    risk_score = Column(Float, default=14.0) # 0-100 (lower is better)
    stock_available = Column(Integer, default=50)
    region = Column(String(100), default="Asia-Pacific (APAC)")
    source_channel = Column(String(100), default="Enterprise Direct Tier-1 Catalog") # Enterprise Direct vs B2B Marketplace
    preferred_supplier = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    normalized_specs = Column(JSON, default=dict)
    risk_breakdown = Column(JSON, default=dict)

class VendorEvaluation(Base):
    __tablename__ = "vendor_evaluations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    request_id = Column(String(36), ForeignKey("procurement_requests.id"), nullable=False, index=True)
    vendor_id = Column(String(36), ForeignKey("vendors.id"), nullable=False)
    
    price_score = Column(Float, nullable=False) # 0-100
    delivery_score = Column(Float, nullable=False) # 0-100
    reliability_score = Column(Float, nullable=False) # 0-100
    risk_score = Column(Float, nullable=False) # 0-100
    constraint_compliance = Column(Float, nullable=False) # 0-100
    overall_score = Column(Float, nullable=False) # weighted sum 0-100
    rank = Column(Integer, nullable=False)
    
    is_recommended = Column(Boolean, default=False)
    recommendation_note = Column(String(500), nullable=True)
    rejection_reasons = Column(JSON, default=list) # "Why Not?" engine trace
    why_selected = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

    request = relationship("ProcurementRequest", back_populates="evaluations")
    vendor = relationship("Vendor")
