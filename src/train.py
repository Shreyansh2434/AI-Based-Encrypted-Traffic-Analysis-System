import os
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, IsolationForest, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.metrics import classification_report, accuracy_score, f1_score, roc_auc_score
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

try:
    from src.features import get_feature_matrix
except ImportError:
    from features import get_feature_matrix


MODEL_DIR = "models"
LOG_DIR = "logs"
os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs(LOG_DIR, exist_ok=True)


def evaluate_model(name, model, X_test, y_test):
    preds = model.predict(X_test)
    proba = model.predict_proba(X_test) if hasattr(model, "predict_proba") else None

    acc = accuracy_score(y_test, preds)
    f1 = f1_score(y_test, preds, average="weighted")

    auc = None
    if proba is not None and len(set(y_test)) == 2:
        try:
            auc = roc_auc_score(y_test, proba[:, 1])
        except:
            pass

    print(f"\n🔥 {name.upper()} RESULTS")
    print("Accuracy:", acc)
    print("F1:", f1)
    print(classification_report(y_test, preds))
    if auc:
        print("AUC:", auc)

    return acc, f1, auc


def train_supervised(csv_path: str):
    df = pd.read_csv(csv_path)
    X, y, feature_names, _ = get_feature_matrix(df)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    models = {
        "rf": Pipeline([
            ("scaler", StandardScaler()),
            ("model", RandomForestClassifier(
                n_estimators=400,
                max_depth=20,
                class_weight="balanced",
                n_jobs=-1,
                random_state=42
            ))
        ]),
        "gb": Pipeline([
            ("scaler", StandardScaler()),
            ("model", GradientBoostingClassifier())
        ]),
        "svm": Pipeline([
            ("scaler", StandardScaler()),
            ("model", SVC(probability=True))
        ])
    }

    results_log = []
    best_model = None
    best_score = 0

    for name, model in models.items():
        model.fit(X_train, y_train)

        acc, f1, auc = evaluate_model(name, model, X_test, y_test)

        score = f1
        results_log.append([name, acc, f1, auc])

        if score > best_score:
            best_score = score
            best_model = model
            best_name = name

    results_df = pd.DataFrame(results_log, columns=["model", "accuracy", "f1", "auc"])
    results_df.to_csv(os.path.join(LOG_DIR, "model_comparison.csv"), index=False)

    print(f"\n🏆 Best Model: {best_name}")

    joblib.dump(
        {"model": best_model, "feature_names": feature_names},
        os.path.join(MODEL_DIR, "supervised_rf.joblib")
    )

    print("✅ Best model saved.")


def train_anomaly(csv_path: str, benign_label: str = "benign"):
    df = pd.read_csv(csv_path)
    X, y, feature_names, _ = get_feature_matrix(df)

    if y is None:
        raise ValueError("Anomaly training needs a label column.")

    benign_mask = (y == benign_label)
    X_benign = X[benign_mask]

    iso = IsolationForest(
        n_estimators=400,
        contamination=0.03,
        n_jobs=-1,
        random_state=42
    )

    iso.fit(X_benign)

    joblib.dump(
        {
            "model": iso,
            "feature_names": feature_names,
            "benign_label": benign_label
        },
        os.path.join(MODEL_DIR, "anomaly_iforest.joblib")
    )

    print("✅ Anomaly model saved.")


if __name__ == "__main__":
    train_supervised("data/flows_cleaned.csv")
    train_anomaly("data/flows_cleaned.csv", benign_label="benign")