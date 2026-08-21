import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.database import Base

class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    request_id = Column(String(36), ForeignKey("procurement_requests.id"), nullable=False, unique=True)
    vendor_id = Column(String(36), ForeignKey("vendors.id"), nullable=False)
    
    po_number = Column(String(50), unique=True, nullable=False, index=True) # e.g. PO-2026-8942
    item_name = Column(String(200), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    total_amount = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    status = Column(String(20), default="ISSUED") # ISSUED, DISPATCHED, DELIVERED
    vendor_name = Column(String(200), nullable=False)
    delivery_address = Column(String(250), default="Tower B, Tech Park, Bangalore")
    payment_terms = Column(String(100), default="Net 30 Days")
    metadata_json = Column(JSON, default=dict)
    issued_at = Column(DateTime, default=datetime.utcnow)

    request = relationship("ProcurementRequest", back_populates="purchase_order")
    vendor = relationship("Vendor")
