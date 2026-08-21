import pytest
from app.models.audit import AuditEvent

def test_audit_hash_chain_tamper_evidence():
    req_id = "PROC-TEST-001"
    
    # Event 1 (Genesis)
    hash_1 = AuditEvent.calculate_hash(
        request_id=req_id,
        event_type="REQUEST_CREATED",
        stage="Intent",
        actor="User",
        message="Request created",
        metadata={"qty": 10},
        previous_hash="GENESIS",
        timestamp_str="2026-08-20T10:00:00"
    )
    assert len(hash_1) == 64 # Valid SHA-256 hex string

    # Event 2 (Chained to Event 1)
    hash_2 = AuditEvent.calculate_hash(
        request_id=req_id,
        event_type="CONSTRAINTS_EXTRACTED",
        stage="Constraint",
        actor="AI Engine",
        message="Constraints extracted",
        metadata={"hard": 4},
        previous_hash=hash_1,
        timestamp_str="2026-08-20T10:00:02"
    )
    assert len(hash_2) == 64
    assert hash_2 != hash_1

    # Tamper Simulation: Altering Event 1 changes its hash and invalidates the chain
    tampered_hash_1 = AuditEvent.calculate_hash(
        request_id=req_id,
        event_type="REQUEST_CREATED",
        stage="Intent",
        actor="User",
        message="Request tampered with higher budget",
        metadata={"qty": 10},
        previous_hash="GENESIS",
        timestamp_str="2026-08-20T10:00:00"
    )
    assert tampered_hash_1 != hash_1
