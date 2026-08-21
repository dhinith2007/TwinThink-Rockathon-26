from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.vendor import Vendor

router = APIRouter(prefix="/vendors", tags=["Vendors"])

@router.get("")
def list_vendors(db: Session = Depends(get_db)):
    """Lists all active supplier profiles with risk indices and specifications."""
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
            "risk_level": v.risk_level,
            "risk_score": v.risk_score,
            "normalized_specs": v.normalized_specs or {},
            "risk_breakdown": v.risk_breakdown or {}
        }
        for v in vendors
    ]
