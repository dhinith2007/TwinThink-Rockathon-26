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
    hard_names = [h["name"] for h in result["hard_constraints"]]
    assert any("Budget" in n for n in hard_names)
    assert any("Quantity" in n for n in hard_names)
    assert any("Memory" in n for n in hard_names)
    assert any("Delivery" in n for n in hard_names)

    # Check soft preferences
    soft_names = [s["name"] for s in result["soft_preferences"]]
    assert any("Brand" in n for n in soft_names)
    assert any("Warranty" in n for n in soft_names)

    # Check ambiguities
    amb_names = [a["name"] for a in result["ambiguities"]]
    assert any("Operating System" in n for n in amb_names)

@pytest.mark.asyncio
async def test_monitor_constraint_extraction():
    prompt = "Need 15 4K monitors under 28k each within 5 days"
    result = await ai_service.extract_intent_and_constraints(prompt)

    assert result["quantity"] == 15
    assert result["budget_per_unit"] == 28000.0
    assert result["total_budget"] == 420000.0
    assert result["delivery_days"] == 5
