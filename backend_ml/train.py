import pandas as pd
import numpy as np
import json
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
import joblib

def train_models():
    print("Starting ML Model training pipeline...")
    
    # Load dataset
    if not os.path.exists('synthetic_dataset.csv'):
        raise FileNotFoundError("synthetic_dataset.csv not found. Run generate_data.py first.")
        
    df = pd.read_csv('synthetic_dataset.csv')
    
    # Define features and targets
    features = [
        'attendance_pct', 
        'assignment_completion_rate', 
        'average_assignment_marks', 
        'average_quiz_marks', 
        'mid_sem_score',
        'learning_activity_score'
    ]
    
    X = df[features]
    y_reg = df['predicted_grade_pct']
    
    # Map risk level to integer classes
    risk_mapping = {"LOW": 0, "MODERATE": 1, "HIGH": 2}
    y_clf = df['risk_level'].map(risk_mapping)
    
    # Train/Test Split
    X_train, X_test, y_reg_train, y_reg_test, y_clf_train, y_clf_test = train_test_split(
        X, y_reg, y_clf, test_size=0.2, random_state=42
    )
    
    # ---- 1. Train Performance Regressor ----
    print("Training Performance Regressor...")
    regressor = RandomForestRegressor(n_estimators=100, random_state=42)
    regressor.fit(X_train, y_reg_train)
    
    reg_preds = regressor.predict(X_test)
    mae = mean_absolute_error(y_reg_test, reg_preds)
    rmse = np.sqrt(mean_squared_error(y_reg_test, reg_preds))
    r2 = r2_score(y_reg_test, reg_preds)
    
    # ---- 2. Train Risk Classifier ----
    print("Training Risk Classifier...")
    classifier = RandomForestClassifier(n_estimators=100, random_state=42)
    classifier.fit(X_train, y_clf_train)
    
    clf_preds = classifier.predict(X_test)
    accuracy = accuracy_score(y_clf_test, clf_preds)
    precision, recall, f1, _ = precision_recall_fscore_support(y_clf_test, clf_preds, average='macro')
    
    # Get feature importances
    importances = regressor.feature_importances_
    feature_importance_dict = {f: float(imp) for f, imp in zip(features, importances)}
    
    # Save metrics
    metrics = {
        "model_name": "EduStack Pro Multi-Task Intelligence Engine",
        "training_date": pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S"),
        "dataset_size": len(df),
        "features_used": features,
        "regression": {
            "mae": float(mae),
            "rmse": float(rmse),
            "r2_score": float(r2)
        },
        "classification": {
            "accuracy": float(accuracy),
            "precision": float(precision),
            "recall": float(recall),
            "f1_score": float(f1)
        },
        "feature_importances": feature_importance_dict
    }
    
    with open('model_metrics.json', 'w') as f:
        json.dump(metrics, f, indent=2)
        
    # Serialize Models
    joblib.dump(regressor, 'performance_regressor.joblib')
    joblib.dump(classifier, 'risk_classifier.joblib')
    
    print("Models trained and serialized successfully!")
    print(f"Regression MAE: {mae:.2f}% | R2 Score: {r2:.4f}")
    print(f"Classification Accuracy: {accuracy:.4f} | F1-Score: {f1:.4f}")

if __name__ == '__main__':
    train_models()
