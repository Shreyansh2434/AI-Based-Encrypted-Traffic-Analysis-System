import joblib
import pandas as pd
import shap
import numpy as np

try:
    from src.features import get_feature_matrix
except ImportError:
    from features import get_feature_matrix


MODEL_PATH = "models/supervised_rf.joblib"
bundle = joblib.load(MODEL_PATH)
model = bundle["model"]

rf_model = model.named_steps["model"]
explainer = shap.TreeExplainer(rf_model)


def get_shap_values(df):
    X, _, feature_names, _ = get_feature_matrix(df)
    shap_values = explainer.shap_values(X[:100])
    return shap_values, X[:100], feature_names


def explain_single(df, index=0):
    import numpy as np

    X, _, feature_names, _ = get_feature_matrix(df)

    shap_values = explainer.shap_values(X)

    if isinstance(shap_values, list):
        values = shap_values[1][index]
    else:
        values = shap_values[index]

    explanation = {}

    for f, v in zip(feature_names, values):
        if isinstance(v, (list, np.ndarray)):
            explanation[f] = float(np.mean(v))
        else:
            explanation[f] = float(v)

    explanation = dict(
        sorted(explanation.items(), key=lambda x: abs(x[1]), reverse=True)
    )

    risk_score = min(100, int(sum(abs(v) for v in explanation.values()) * 10))

    return explanation, risk_score
