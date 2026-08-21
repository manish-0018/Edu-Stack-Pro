import pandas as pd
import numpy as np
import json
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier, GradientBoostingRegressor, GradientBoostingClassifier
from sklearn.tree import DecisionTreeRegressor, DecisionTreeClassifier
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.metrics import accuracy_score, precision_recall_fscore_support

def train_models():
    print("Starting ML Model training pipeline with comparison...")
    
    # Generate data if missing
    if not os.path.exists('synthetic_dataset.csv'):
        print("synthetic_dataset.csv not found. Running generate_data.py first.")
        from generate_data import main as run_gen
        run_gen()

    df = pd.read_csv('synthetic_dataset.csv')
    
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
    
    risk_mapping = {"LOW": 0, "MODERATE": 1, "HIGH": 2}
    y_clf = df['risk_level'].map(risk_mapping)
    
    # Train/Test Split
    X_train, X_test, y_reg_train, y_reg_test, y_clf_train, y_clf_test = train_test_split(
        X, y_reg, y_clf, test_size=0.2, random_state=42
    )
    
    # ─── 1. Regressor Comparison ───
    reg_models = {
        "Random Forest Regressor": RandomForestRegressor(n_estimators=100, random_state=42),
        "Decision Tree Regressor": DecisionTreeRegressor(random_state=42),
        "Gradient Boosting Regressor": GradientBoostingRegressor(random_state=42),
        "Linear Regression": LinearRegression()
    }
    
    reg_comparison = []
    best_reg_name = None
    best_reg_r2 = -float('inf')
    best_reg_model = None
    
    for name, model in reg_models.items():
        model.fit(X_train, y_reg_train)
        preds = model.predict(X_test)
        mae = float(mean_absolute_error(y_reg_test, preds))
        rmse = float(np.sqrt(mean_squared_error(y_reg_test, preds)))
        r2 = float(r2_score(y_reg_test, preds))
        
        reg_comparison.append({
            "model_name": name,
            "mae": mae,
            "rmse": rmse,
            "r2_score": r2
        })
        
        if r2 > best_reg_r2:
            best_reg_r2 = r2
            best_reg_name = name
            best_reg_model = model

    # ─── 2. Classifier Comparison ───
    clf_models = {
        "Random Forest Classifier": RandomForestClassifier(n_estimators=100, random_state=42),
        "Decision Tree Classifier": DecisionTreeClassifier(random_state=42),
        "Gradient Boosting Classifier": GradientBoostingClassifier(random_state=42),
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42)
    }
    
    clf_comparison = []
    best_clf_name = None
    best_clf_f1 = -float('inf')
    best_clf_model = None
    
    for name, model in clf_models.items():
        model.fit(X_train, y_clf_train)
        preds = model.predict(X_test)
        acc = float(accuracy_score(y_clf_test, preds))
        prec, rec, f1, _ = precision_recall_fscore_support(y_clf_test, preds, average='macro')
        
        clf_comparison.append({
            "model_name": name,
            "accuracy": acc,
            "precision": float(prec),
            "recall": float(rec),
            "f1_score": float(f1)
        })
        
        if float(f1) > best_clf_f1:
            best_clf_f1 = float(f1)
            best_clf_name = name
            best_clf_model = model

    # Save the selected best models
    joblib.dump(best_reg_model, 'performance_regressor.joblib')
    joblib.dump(best_clf_model, 'risk_classifier.joblib')
    
    # Calculate feature importances from best Regressor if available (or fallback to RF)
    feature_importance_dict = {}
    if hasattr(best_reg_model, 'feature_importances_'):
        importances = best_reg_model.feature_importances_
        feature_importance_dict = {f: float(imp) for f, imp in zip(features, importances)}
    else:
        # Fallback to RF Regressor for importances
        rf = reg_models["Random Forest Regressor"]
        importances = rf.feature_importances_
        feature_importance_dict = {f: float(imp) for f, imp in zip(features, importances)}
        
    metrics = {
        "model_name": f"EduStack Pro Intelligent Engine ({best_reg_name} + {best_clf_name})",
        "training_date": pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S"),
        "dataset_size": len(df),
        "features_used": features,
        "regression": {
            "model": best_reg_name,
            "mae": float(mean_absolute_error(y_reg_test, best_reg_model.predict(X_test))),
            "rmse": float(np.sqrt(mean_squared_error(y_reg_test, best_reg_model.predict(X_test)))),
            "r2_score": float(r2_score(y_reg_test, best_reg_model.predict(X_test)))
        },
        "classification": {
            "model": best_clf_name,
            "accuracy": float(accuracy_score(y_clf_test, best_clf_model.predict(X_test))),
            "precision": float(precision_recall_fscore_support(y_clf_test, best_clf_model.predict(X_test), average='macro')[0]),
            "recall": float(precision_recall_fscore_support(y_clf_test, best_clf_model.predict(X_test), average='macro')[1]),
            "f1_score": float(precision_recall_fscore_support(y_clf_test, best_clf_model.predict(X_test), average='macro')[2])
        },
        "feature_importances": feature_importance_dict,
        "regression_comparison": reg_comparison,
        "classification_comparison": clf_comparison
    }
    
    with open('model_metrics.json', 'w') as f:
        json.dump(metrics, f, indent=2)
        
    print("Models trained and serialized successfully!")
    print(f"Selected Regressor: {best_reg_name} (R2 Score: {best_reg_r2:.4f})")
    print(f"Selected Classifier: {best_clf_name} (F1-Score: {best_clf_f1:.4f})")

if __name__ == '__main__':
    train_models()
