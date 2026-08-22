from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class ProcurementAnalyzeRequest(BaseModel):
    raw_request: str = Field(..., description="Natural language buying intent prompt")
    item_name: Optional[str] = None
    quantity: Optional[int] = None
    budget_per_unit: Optional[float] = None
    delivery_days: Optional[int] = None
    priority: Optional[str] = "Medium"
    session_id: Optional[str] = None

class ConstraintItem(BaseModel):
    id: Optional[str] = None
    name: str
    value: str
    constraint_type: str # HARD, SOFT, AMBIGUITY
    is_mandatory: bool = True
    confidence: float = 1.0
    source: str = "AI_EXTRACTION"

class ExtractedConstraintsDTO(BaseModel):
    hard_constraints: List[ConstraintItem]
    soft_preferences: List[ConstraintItem]
    ambiguities: List[ConstraintItem]

class RiskBreakdownItem(BaseModel):
    level: str
    score: int
    note: str

class VendorDTO(BaseModel):
    id: str
    vendor_code: str
    name: str
    short_name: str
    category: str
    unit_price: float
    unit_price_display: str
    total_price: float
    total_price_display: str
    delivery_days: int
    delivery_display: str
    reliability_score: float
    seller_rating: Optional[str] = None
    warranty: str
    stock_available: int
    region: Optional[str] = "APAC"
    source_channel: Optional[str] = "Enterprise Direct Tier-1 Catalog"
    overall_risk: str
    risk_score_num: float
    is_recommended: bool = False
    rank: int
    normalized_specs: Dict[str, Any] = {}
    risk_breakdown: Dict[str, RiskBreakdownItem] = {}
    why_selected: Optional[List[str]] = None
    why_not_rejected: Optional[List[str]] = None

class PolicyCheckDTO(BaseModel):
    policy_code: str
    title: str
    category: str
    status: str # PASSED, ESCALATED, BLOCKED, ACTIVE
    details: str
    impact: Optional[str] = None

class DecisionPacketDTO(BaseModel):
    id: str
    request_id: str
    session_id: str
    selected_vendor: str
    unit_cost: float
    total_cost: float
    target_budget: float
    savings_amount: float
    delivery_window: str
    overall_risk_level: str
    agent_confidence: float
    authorization_status: str # ALLOW, ESCALATE, BLOCK
    escalation_reason: Optional[str] = None
    agent_recommendation: str
    alternatives_summary: List[Dict[str, Any]] = []
    tradeoff_analysis: Dict[str, Any] = {}

class AuditEventDTO(BaseModel):
    id: str
    timestamp: str
    event_type: str
    title: str
    stage: str
    status: str
    actor: str
    summary: str
    details: Dict[str, Any] = {}
    event_hash: str
    previous_event_hash: Optional[str] = None

class ProcurementResponse(BaseModel):
    request_id: str
    session_id: str
    title: str
    item_name: str
    quantity: int
    budget_per_unit: float
    total_budget: float
    delivery_days: int
    priority: str
    raw_request: str
    status: str
    constraints: ExtractedConstraintsDTO
    vendors: List[VendorDTO]
    recommended_vendor: Optional[VendorDTO] = None
    decision: DecisionPacketDTO
    policy_checks: List[PolicyCheckDTO]
    reasoning_steps: List[str]
    audit_events: List[AuditEventDTO]
    purchase_order: Optional[Dict[str, Any]] = None
    sourcing_summary: Optional[Dict[str, Any]] = None
    ai_funnel: Optional[Dict[str, Any]] = None

class SimulateRelaxationRequest(BaseModel):
    delivery_days: int = Field(..., ge=1, le=30)
    budget_per_unit: Optional[float] = None

class SimulateRelaxationResponse(BaseModel):
    delivery_days: int
    compliant_vendors_count: int
    total_evaluated_vendors: int
    flexibility_score: int
    sla_assessment: str
    updated_vendors: List[VendorDTO]

class BatchBriefItem(BaseModel):
    raw_request: str
    item_name: Optional[str] = None
    category: Optional[str] = None
    quantity: Optional[int] = 1
    budget_per_unit: Optional[float] = None
    delivery_days: Optional[int] = 7
    priority: Optional[str] = "Medium"

class BatchProcurementRequest(BaseModel):
    session_id: Optional[str] = None
    batch_title: Optional[str] = "Multi-Item Enterprise Procurement Batch"
    requests: List[BatchBriefItem]

class BatchItemSummary(BaseModel):
    request_id: str
    title: str
    item_name: str
    category: str
    quantity: int
    total_budget: float
    total_cost: float
    savings: float
    status: str
    authorization_status: str # ALLOW, ESCALATE, BLOCK
    recommended_vendor: str
    po_number: Optional[str] = None

class BatchProcurementResponse(BaseModel):
    batch_id: str
    session_id: str
    batch_title: str
    total_requests: int
    total_spend: float
    total_savings: float
    completed_count: int
    escalated_count: int
    overall_status: str
    items: List[BatchItemSummary]
    audit_summary: str

class NegotiationResponse(BaseModel):
    request_id: str
    vendor_name: str
    dialogue: List[Dict[str, Any]]
    concession_achieved: str
    savings_amount: float
    confirmed_terms: Dict[str, Any]
    status: str
