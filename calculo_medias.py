from __future__ import annotations
from dataclasses import dataclass
from typing import Dict, List


# ─────────────────────────────────────────────────────────────────────────────
# 1.  ELECTRICITY – per-appliance monthly kWh
# ─────────────────────────────────────────────────────────────────────────────
@dataclass
class ApplianceProfile:
    mean_power_w: float  # average power draw while ON  (W)
    hours_per_day: float  # average daily use            (h)

    def kwh_per_month(self, days: int = 30) -> float:
        """Return estimated monthly consumption in kWh."""
        return (self.mean_power_w / 1000) * self.hours_per_day * days


# Typical values – swap for measured data whenever you have it
APPLIANCE_DB: Dict[str, ApplianceProfile] = {
    "AIR-FRIER": ApplianceProfile(1500, 0.5),  # 30 min/day
    "AQUECEDOR": ApplianceProfile(1800, 3),  # space heater
    "CHUVEIRO ELÉTRICO": ApplianceProfile(5500, 0.33),  # 20 min
    "DESKTOP": ApplianceProfile(200, 6),
    "GELADEIRA": ApplianceProfile(150, 24),
    "LAVA LOUÇAS": ApplianceProfile(1200, 0.8),  # 48 min
    "LAVA ROUPAS": ApplianceProfile(600, 1),  # 1h
    "NOTEBOOK": ApplianceProfile(60, 6),
    "TELEVISÃO": ApplianceProfile(100, 4),
}


def calculate_watts(appliances: List[str], days: int = 30) -> Dict[str, float]:
    """
    Return a {appliance: kWh/month} dict for the appliances present.
    Unknown items are ignored (you could raise instead, if you prefer).
    """
    consumption = {}
    for name in appliances:
        prof = APPLIANCE_DB.get(name.upper())
        if prof:
            consumption[name] = round(prof.kwh_per_month(days), 2)

    # sum all the consumption values
    total_consumption = sum(consumption.values())
    return total_consumption


# ─────────────────────────────────────────────────────────────────────────────
# 2.  PROTEIN – weekly kg split between main & secondary
# ─────────────────────────────────────────────────────────────────────────────
PROTEINS = {"CARNE DE PORCO", "CARNE DE BOI", "FRANGO", "SOJA"}  # accepted keys


def calculate_meat(
    main_food: str, secondary_foods: List[str], total_protein_kg_week: float = 3.5
) -> Dict[str, float]:
    """
    Split total_protein_kg_week:
      • 50 % goes to main_food
      • 50 % is divided equally among *valid* secondary proteins that are not the main one
    Foods outside PROTEINS are ignored (they still *reduce* the share for the big 4,
    exactly as you asked).
    """
    main_food = main_food.upper()
    secondary_set = {f.upper() for f in secondary_foods}

    # Filter only recognised protein items
    valid_secondaries = (secondary_set & PROTEINS) - {main_food}

    result: Dict[str, float] = {pf: 0.0 for pf in PROTEINS}

    # 1) main protein – always 50 %
    if main_food in PROTEINS:
        result[main_food] = 0.5 * total_protein_kg_week

    # 2) secondary proteins – share the remaining 50 %
    if valid_secondaries and len(secondary_set) > 0:
        share_each = 0.5 * total_protein_kg_week / len(secondary_set)
        for item in valid_secondaries:
            result[item] = share_each

    # 3) values rounded to two decimals for display
    return {k: round(v, 2) for k, v in result.items()}


# ─────────────────────────────────────────────────────────────────────────────
# 3.  EXAMPLE
# ─────────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    # Appliances chosen by the visitor…
    user_appliances = ["GELADEIRA", "AIR-FRIER", "NOTEBOOK"]
    print("Monthly kWh:", calculate_watts(user_appliances))

    # Protein choices: main = beef, secondary = pork + chicken
    print(
        "Weekly protein kg:",
        calculate_meat(
            main_food="CARNE DE BOI", secondary_foods=["CARNE DE PORCO", "FRANGO"]
        ),
    )
