"""
api/predict.py
==============
Updated POST /predict endpoint — supports all 3 models
"""

import io
import logging
import numpy as np
import pandas as pd
from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List

from detection.predictor import predict, model_status

logger = logging.getLogger(__name__)
router = APIRouter()


class PredictionResult(BaseModel):
    prediction   : str
    risk_score   : float
    severity     : str
    rf_prob      : Optional[float] = None
    xgb_prob     : Optional[float] = None
    anomaly_flag : Optional[bool]  = None
    model_used   : str


class PredictResponse(BaseModel):
    data         : List[PredictionResult]
    total_flows  : int
    attack_count : int
    benign_count : int
    avg_risk     : float
    critical_count : int
    high_count   : int
    model_mode   : str


@router.post("/predict", response_model=PredictResponse)
async def predict_endpoint(
    file: UploadFile = File(...),
    mode: str = Query(
        default="ensemble",
        description="Model mode: rf | xgb | ensemble | anomaly | full"
    ),
):
    """
    Accepts a CICIDS-format CSV.
    Returns per-flow predictions with multi-model risk scoring.

    mode options:
      rf       — RandomForest only
      xgb      — XGBoost only
      ensemble — RF + XGBoost majority vote (recommended)
      anomaly  — IsolationForest zero-day detection
      full     — All three models combined (most thorough)
    """
    if not file.filename.endswith(".csv"):
        logger.warning(f"Invalid file type: {file.filename}")
        raise HTTPException(status_code=400, detail="Only CSV files are accepted.")

    try:
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode("utf-8")), low_memory=False)
    except UnicodeDecodeError as e:
        logger.error(f"Failed to decode CSV: {e}")
        raise HTTPException(status_code=400, detail="Failed to parse CSV: invalid encoding")
    except (pd.errors.ParserError, pd.errors.EmptyDataError, ValueError) as e:
        logger.error(f"Failed to parse CSV: {e}")
        raise HTTPException(status_code=400, detail=f"CSV parsing error: {str(e)[:100]}")

    if df.empty:
        logger.warning("Uploaded CSV is empty")
        raise HTTPException(status_code=400, detail="Uploaded CSV is empty.")

    # Replace inf values
    df.replace([float("inf"), float("-inf")], float("nan"), inplace=True)
    df.dropna(inplace=True)

    if df.empty:
        logger.warning("No valid rows after cleaning CSV")
        raise HTTPException(status_code=400, detail="No valid rows after cleaning.")

    try:
        raw_results = predict(df, mode=mode)
    except KeyError as e:
        logger.error(f"Missing feature in prediction: {e}")
        raise HTTPException(status_code=400, detail=f"Missing required feature: {e}")
    except (ValueError, TypeError) as e:
        logger.error(f"Prediction validation error: {e}")
        raise HTTPException(status_code=400, detail=f"Data validation error: {str(e)[:100]}")
    except Exception as e:
        logger.error(f"Prediction error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal prediction error")

    attack_count   = sum(1 for r in raw_results if r["prediction"] == "attack")
    benign_count   = len(raw_results) - attack_count
    avg_risk       = float(np.mean([r["risk_score"] for r in raw_results]))
    critical_count = sum(1 for r in raw_results if r["severity"] == "Critical")
    high_count     = sum(1 for r in raw_results if r["severity"] == "High")

    logger.info(f"Prediction completed: {len(raw_results)} flows, {attack_count} attacks, mode={mode}")

    return PredictResponse(
        data           = [PredictionResult(**r) for r in raw_results],
        total_flows    = len(raw_results),
        attack_count   = attack_count,
        benign_count   = benign_count,
        avg_risk       = round(avg_risk, 2),
        critical_count = critical_count,
        high_count     = high_count,
        model_mode     = mode,
    )


@router.get("/models/status")
async def models_status_endpoint():
    """Returns which models are loaded and the recommended mode."""
    return model_status()