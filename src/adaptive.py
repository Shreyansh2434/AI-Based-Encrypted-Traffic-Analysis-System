import joblib
import pandas as pd

MODEL_PATH = "models/supervised_rf.joblib"

def update_model(new_data, threshold=80):
    bundle = joblib.load(MODEL_PATH)
    model = bundle["model"]

    X = new_data.drop(columns=["predicted_class"], errors="ignore")
    y = new_data["predicted_class"]

    model.fit(X, y)

    joblib.dump(bundle, MODEL_PATH)

    return "Model updated"