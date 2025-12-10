import json
import random

foods = {}
base_foods = [
    "dosa", "rice", "chapati", "idli", "poha", "upma", "oatmeal", "paratha",
    "veg_curry", "chicken_curry", "paneer_dish", "egg_dish", "fish_fry",
    "salad", "sandwich", "smoothie", "protein_shake", "soup", "biryani"
]

for i in range(1, 501):
    food_name = f"{random.choice(base_foods)}_{i}"
    foods[food_name] = {
        "calories": random.randint(40, 450),
        "carb": round(random.uniform(0, 60), 1),
        "protein": round(random.uniform(0, 35), 1),
        "fat": round(random.uniform(0, 30), 1)
    }

with open("nutrition_lookup.json", "w") as f:
    json.dump(foods, f, indent=2)

print("✅ nutrition_lookup.json with 500 items created")
