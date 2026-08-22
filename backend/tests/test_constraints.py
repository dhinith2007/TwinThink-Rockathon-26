import pytest
from app.services.ai_service import ai_service

@pytest.mark.asyncio
async def test_dell_laptop_constraint_extraction():
    prompt = "Buy 10 Dell Latitude 5440 laptops under ₹45,000 each with 16GB RAM and delivery within 7 days. Prefer Dell with at least 2 years warranty."
    result = await ai_service.extract_intent_and_constraints(prompt)

    assert result["quantity"] == 10
    assert result["budget_per_unit"] == 45000.0
    assert result["total_budget"] == 450000.0
    assert result["delivery_days"] == 7
    assert "Dell" in result["item_name"]
    
    # Check hard constraints
    assert len(result["hard_constraints"]) >= 1
    assert any("ram" in h["name"].lower() or "memory" in h["name"].lower() or "budget" in h["name"].lower() for h in result["hard_constraints"])

    # Check soft preferences
    assert len(result["soft_preferences"]) >= 1
    assert any("brand" in s["name"].lower() or "dell" in s["name"].lower() or "warranty" in s["name"].lower() for s in result["soft_preferences"])

@pytest.mark.asyncio
async def test_monitor_constraint_extraction():
    prompt = "Need 15 4K monitors under 28k each within 5 days"
    result = await ai_service.extract_intent_and_constraints(prompt)

    assert result["quantity"] == 15
    assert result["budget_per_unit"] == 28000.0
    assert result["total_budget"] == 420000.0
    assert result["delivery_days"] == 5
