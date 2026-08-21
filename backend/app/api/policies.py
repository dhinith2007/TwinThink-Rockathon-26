from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.policy import PolicyRule

router = APIRouter(prefix="/policies", tags=["Policies"])

@router.get("")
def list_policies(db: Session = Depends(get_db)):
    """Lists all active corporate firewall governance rules."""
    policies = db.query(PolicyRule).filter(PolicyRule.is_active == True).all()
    return [
        {
            "id": p.id,
            "policy_code": p.policy_code,
            "title": p.title,
            "category": p.category,
            "rule_description": p.rule_description,
            "policy_type": p.policy_type,
            "threshold_value": p.threshold_value,
            "impact": p.impact
        }
        for p in policies
    ]
