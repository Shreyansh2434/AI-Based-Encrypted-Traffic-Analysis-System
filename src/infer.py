import joblib
import pandas as pd

try:
    from src.features import get_feature_matrix
except ImportError:
    from features import get_feature_matrix


SUPERVISED_MODEL_PATH = "models/supervised_rf.joblib"
ANOMALY_MODEL_PATH = "models/anomaly_iforest.joblib"

supervised_bundle = joblib.load(SUPERVISED_MODEL_PATH)
supervised_model = supervised_bundle["model"]

anomaly_bundle = joblib.load(ANOMALY_MODEL_PATH)
anomaly_model = anomaly_bundle["model"]


def hybrid_decision(row):
    if row["predicted_class"] == "attack":
        return "Known Attack"
    elif row["anomaly_flag"] == -1 and row["anomaly_score"] < -0.2:
        return "Zero-Day Threat"
    else:
        return "Normal"


def compute_risk(row):
    score = 0

    if row["predicted_class"] == "attack":
        score += 50

    if row["anomaly_flag"] == -1:
        score += 30

    score += abs(row["anomaly_score"]) * 20

    return min(100, int(score))


def severity(score):
    if score > 80:
        return "🔴 Critical"
    elif score > 50:
        return "🟠 High"
    elif score > 20:
        return "🟡 Medium"
    else:
        return "🟢 Low"


def predict_flows(input_data):
    if isinstance(input_data, pd.DataFrame):
        df = input_data.copy()
    else:
        df = pd.read_csv(input_data)

    X, _, feature_names, processed_df = get_feature_matrix(df)

    class_preds = supervised_model.predict(X)
    class_probs = supervised_model.predict_proba(X) if hasattr(supervised_model, "predict_proba") else None

    anomaly_scores = anomaly_model.decision_function(X)
    anomaly_flags = anomaly_model.predict(X)

    results = processed_df.copy()
    results["predicted_class"] = class_preds
    results["anomaly_score"] = anomaly_scores
    results["anomaly_flag"] = anomaly_flags

    if class_probs is not None:
        for idx, cls in enumerate(supervised_model.classes_):
            results[f"prob_{cls}"] = class_probs[:, idx]

    results["final_decision"] = results.apply(hybrid_decision, axis=1)
    results["risk_score"] = results.apply(compute_risk, axis=1)
    results["severity"] = results["risk_score"].apply(severity)

    return results


if __name__ == "__main__":
    result = predict_flows("data/test.csv")
    print(result.head())