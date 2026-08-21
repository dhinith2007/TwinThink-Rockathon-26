from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db, check_db_health
from app.models.vendor import Vendor
from app.models.policy import PolicyRule
from app.schemas.health import HealthResponse
from app.core.config import settings

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("", response_model=HealthResponse)
def get_health(db: Session = Depends(get_db)):
    db_check = check_db_health()
    db_status = db_check["status"]

    vendors_count = db.query(Vendor).filter(Vendor.is_active == True).count() if db_status == "connected" else 0
    policies_count = db.query(PolicyRule).filter(PolicyRule.is_active == True).count() if db_status == "connected" else 0

    overall_status = "healthy" if db_status == "connected" else "degraded"

    ai_engine_status = "ready (OpenRouter)" if settings.OPENROUTER_API_KEY else "ready (Deterministic Fallback)"

    return HealthResponse(
        status=overall_status,
        api="healthy",
        database=db_status,
        database_type=db_check.get("type", "sqlite"),
        ai_engine=ai_engine_status,
        vendor_engine="ready (3 indexed suppliers, multi-objective matrix)",
        active_vendors_count=vendors_count,
        active_policies_count=policies_count,
        timestamp=datetime.utcnow().isoformat()
    )
