from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.vendor import Vendor
from app.models.knowledge_base import Product, VendorOffer
from app.services.vendor_source_service import vendor_source_service

router = APIRouter(prefix="/vendors", tags=["Vendors"])

@router.get("")
def list_vendors(db: Session = Depends(get_db)):
    """Lists all active supplier profiles with risk indices, region, and channel source."""
    vendors = db.query(Vendor).filter(Vendor.is_active == True).all()
    return [
        {
            "id": v.id,
            "vendor_code": v.vendor_code,
            "name": v.name,
            "short_name": v.short_name,
            "category": v.category,
            "price": v.price,
            "price_display": f"₹{v.price:,.0f}",
            "delivery_days": v.delivery_days,
            "reliability_score": v.reliability_score,
            "seller_rating": v.seller_rating,
            "warranty": v.warranty_text,
            "stock_available": v.stock_available,
            "region": v.region or "APAC",
            "source_channel": v.source_channel or "Enterprise Direct Tier-1 Catalog",
            "preferred_supplier": getattr(v, "preferred_supplier", False),
            "risk_level": v.risk_level,
            "risk_score": v.risk_score,
            "normalized_specs": v.normalized_specs or {},
            "risk_breakdown": v.risk_breakdown or {}
        }
        for v in vendors
    ]

@router.get("/knowledge-insights")
def get_knowledge_insights(db: Session = Depends(get_db)):
    """Returns real-time procurement knowledge base metrics and sourcing channel stats."""
    return vendor_source_service.get_knowledge_insights(db)

@router.get("/offers")
def discover_offers(
    category: Optional[str] = Query(None, description="Category or natural language alias"),
    budget_per_unit: Optional[float] = Query(None, description="Per unit target budget in INR"),
    db: Session = Depends(get_db)
):
    """Discovers competing offers across Source A (Enterprise Direct) and Source B (B2B Marketplace)."""
    return vendor_source_service.discover_offers(db, category, budget_per_unit)

@router.get("/search")
def search_vendors(
    category: Optional[str] = Query(None, description="Category filter (Laptops, Monitors, Office Furniture, etc.)"),
    channel: Optional[str] = Query(None, description="Source channel filter"),
    db: Session = Depends(get_db)
):
    """Dynamically searches and filters vendors across multiple catalog sources."""
    query = db.query(Vendor).filter(Vendor.is_active == True)
    if category:
        canonical = vendor_source_service.normalize_category(category)
        query = query.filter(Vendor.category.ilike(f"%{canonical}%"))
    if channel:
        query = query.filter(Vendor.source_channel.ilike(f"%{channel}%"))
    
    vendors = query.all()
    return [
        {
            "id": v.id,
            "vendor_code": v.vendor_code,
            "name": v.name,
            "short_name": v.short_name,
            "category": v.category,
            "price": v.price,
            "price_display": f"₹{v.price:,.0f}",
            "delivery_days": v.delivery_days,
            "reliability_score": v.reliability_score,
            "seller_rating": v.seller_rating,
            "warranty": v.warranty_text,
            "stock_available": v.stock_available,
            "region": v.region or "APAC",
            "source_channel": v.source_channel or "Enterprise Direct Tier-1 Catalog",
            "preferred_supplier": getattr(v, "preferred_supplier", False),
            "risk_level": v.risk_level,
            "risk_score": v.risk_score,
            "normalized_specs": v.normalized_specs or {},
            "risk_breakdown": v.risk_breakdown or {}
        }
        for v in vendors
    ]
