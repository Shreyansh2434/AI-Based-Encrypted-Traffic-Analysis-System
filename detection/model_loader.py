import joblib
from pathlib import Path

_model = None

def get_model():

    global _model

    if _model is None:

        model_path = Path(__file__).resolve().parents[1] / "models" / "trained_models.pkl"

        _model = joblib.load(model_path)

    return _model