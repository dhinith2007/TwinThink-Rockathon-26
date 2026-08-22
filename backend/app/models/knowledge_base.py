import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_code = Column(String(50), unique=True, nullable=False, index=True) # e.g. PROD-LAP-001
    product_name = Column(String(200), nullable=False, index=True) # e.g. Dell Latitude 5440 14"
    category = Column(String(100), nullable=False, index=True) # Laptops, Office Chairs, Keyboards, Monitors, Laptop Stands, Mice, Docking Stations, Servers
    brand = Column(String(100), nullable=False, index=True) # Dell, Lenovo, HP, Apple, LG, Logitech, ErgoPro, Steelcase, etc.
    model = Column(String(100), nullable=False)
    description = Column(String(500), nullable=True)
    base_price = Column(Float, nullable=False) # benchmark price
    specifications = Column(JSON, default=dict) # {"ram": "16GB DDR5", "storage": "512GB SSD", "cpu": "i5-1345U", ...}
    features = Column(JSON, default=list) # ["wireless", "bluetooth", "ergonomic", "4k", "usb-c", ...]
    created_at = Column(DateTime, default=datetime.utcnow)

    offers = relationship("VendorOffer", back_populates="product", cascade="all, delete-orphan")


class VendorOffer(Base):
    __tablename__ = "vendor_offers"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    vendor_id = Column(String(36), ForeignKey("vendors.id"), nullable=False, index=True)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False, index=True)
    
    price = Column(Float, nullable=False) # Quoted price for this product
    stock = Column(Integer, nullable=False, default=50) # Current available inventory
    delivery_days = Column(Integer, nullable=False, default=5) # SLA lead time in days
    warranty_years = Column(Integer, default=2)
    warranty_text = Column(String(100), default="2 Years Onsite ProSupport")
    return_policy = Column(String(200), default="30-day DOA zero-penalty replacement")
    is_available = Column(Boolean, default=True)
    last_updated = Column(DateTime, default=datetime.utcnow)

    vendor = relationship("Vendor")
    product = relationship("Product", back_populates="offers")
