import csv
import random

NUM_ROWS = 1000
FILE_NAME = "real_health_data.csv"

def calculate_obesity_risk(bmi, activity, junk, family):
    if bmi >= 30 or (bmi >= 27 and junk >= 2 and family == 1):
        return 2  # HIGH
    elif bmi >= 25 or family == 1:
        return 1  # MEDIUM
    else:
        return 0  # LOW

with open(FILE_NAME, "w", newline="") as file:
    writer = csv.writer(file)
    writer.writerow([
        "bmi", "age", "gender", "family_history",
        "activity_level", "sleep_time",
        "junk_food_freq", "obesity_risk"
    ])

    for _ in range(NUM_ROWS):
        age = random.randint(18, 70)
        gender = random.randint(0, 1)
        family_history = random.randint(0, 1)
        activity_level = random.randint(0, 2)

        # Sleep depends weakly on age
        sleep_time = round(random.uniform(5.0, 9.0), 1)

        junk_food_freq = random.randint(0, 3)

        # BMI GENERATION (biased by lifestyle)
        bmi_base = random.uniform(18, 24)

        if activity_level == 0:
            bmi_base += random.uniform(3, 8)
        elif activity_level == 1:
            bmi_base += random.uniform(1, 4)

        if junk_food_freq >= 2:
            bmi_base += random.uniform(1, 5)

        bmi = round(min(bmi_base, 45), 1)

        obesity_risk = calculate_obesity_risk(
            bmi, activity_level, junk_food_freq, family_history
        )

        writer.writerow([
            bmi, age, gender, family_history,
            activity_level, sleep_time,
            junk_food_freq, obesity_risk
        ])

print("✅ real_health_data.csv with 500 rows generated")
