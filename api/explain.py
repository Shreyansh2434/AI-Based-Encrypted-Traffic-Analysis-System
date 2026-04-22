from fastapi import APIRouter
import pandas as pd
import shap
from detection.model_loader import get_model

router = APIRouter()

@router.post("/explain")
async def explain(sample: dict):

    model = get_model()

    df = pd.DataFrame([sample])

    explainer = shap.TreeExplainer(model)

    shap_values = explainer.shap_values(df)

    return {
        "features": df.columns.tolist(),
        "shap_values": shap_values[0].tolist()
    }