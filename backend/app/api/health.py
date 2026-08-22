from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db, check_db_health, is_sqlite
from app.models.vendor import Vendor
from app.models.policy import PolicyRule
from app.schemas.health import HealthResponse
from app.core.config import settings

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("", response_model=HealthResponse)
def get_health(db: Session = Depends(get_db)):
    db_check = check_db_health()
    db_status = db_check["status"]
    db_type = db_check.get("type", "sqlite")

    vendors_count = db.query(Vendor).filter(Vendor.is_active == True).count() if db_status == "connected" else 0
    policies_count = db.query(PolicyRule).filter(PolicyRule.is_active == True).count() if db_status == "connected" else 0

    overall_status = "healthy" if db_status == "connected" else "degraded"
    mode = "offline" if is_sqlite or db_type == "sqlite" else "live"

    ai_engine_status = "ready (OpenRouter AI)" if settings.OPENROUTER_API_KEY else "ready (Deterministic Parser)"

    return HealthResponse(
        status=overall_status,
        mode=mode,
        api="healthy",
        database=db_status,
        database_type="Supabase PostgreSQL" if db_type == "postgresql" else "Local SQLite",
        ai_engine=ai_engine_status,
        vendor_engine=f"online ({vendors_count} suppliers indexed across 2 channels)",
        active_vendors_count=vendors_count,
        active_policies_count=policies_count,
        timestamp=datetime.utcnow().isoformat()
    )
