import pandas as pd
import numpy as np

# Set random seed for reproducibility
np.random.seed(42)

n_samples = 1000

# Generate features
attendance_pct = np.random.uniform(45.0, 100.0, n_samples)
assignment_completion_rate = np.clip(attendance_pct / 100.0 + np.random.normal(0, 0.1, n_samples), 0.0, 1.0)
average_assignment_marks = np.clip(assignment_completion_rate * 100.0 - np.random.uniform(0, 15, n_samples), 0.0, 100.0)
average_quiz_marks = np.clip(attendance_pct * 0.9 - np.random.uniform(0, 20, n_samples), 0.0, 100.0)
mid_sem_score = np.clip(average_quiz_marks * 0.95 + np.random.normal(0, 5, n_samples), 0.0, 100.0)
learning_activity_score = np.clip(attendance_pct * 0.8 + np.random.uniform(0, 20, n_samples), 0.0, 100.0)

# Calculate target: expected final semester grade %
# Weighted formula with noise
predicted_grade_pct = (
    attendance_pct * 0.25 +
    assignment_completion_rate * 15.0 +
    average_assignment_marks * 0.25 +
    average_quiz_marks * 0.15 +
    mid_sem_score * 0.20
)
predicted_grade_pct = np.clip(predicted_grade_pct + np.random.normal(0, 3, n_samples), 30.0, 100.0)

# Determine risk level based on rules
risk_level = []
for att, grade in zip(attendance_pct, predicted_grade_pct):
    if att < 60.0 or grade < 50.0:
        risk_level.append("HIGH")
    elif att < 75.0 or grade < 70.0:
        risk_level.append("MODERATE")
    else:
        risk_level.append("LOW")

# Create DataFrame
df = pd.DataFrame({
    'attendance_pct': attendance_pct,
    'assignment_completion_rate': assignment_completion_rate,
    'average_assignment_marks': average_assignment_marks,
    'average_quiz_marks': average_quiz_marks,
    'mid_sem_score': mid_sem_score,
    'learning_activity_score': learning_activity_score,
    'predicted_grade_pct': predicted_grade_pct,
    'risk_level': risk_level
})

# Save to CSV
df.to_csv('synthetic_dataset.csv', index=False)
print("Successfully generated synthetic_dataset.csv with 1000 records.")
