from typing import Dict, Any, Optional
from pydantic import BaseModel

class HealthResponse(BaseModel):
    status: str
    mode: str = "live" # "live" (Supabase/PostgreSQL) or "offline" (SQLite)
    api: str
    database: str
    database_type: str
    ai_engine: str
    vendor_engine: str
    active_vendors_count: int
    active_policies_count: int
    timestamp: str
