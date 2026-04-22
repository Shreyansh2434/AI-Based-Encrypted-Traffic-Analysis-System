"""
detection/predictor.py
======================
Encrypted Traffic AI Detection Platform — Multi-Model Predictor

Supports:
  • RandomForest    — primary classifier
  • XGBoost         — secondary classifier
  • IsolationForest — zero-day anomaly detector

Prediction modes:
  • "rf"       → Random Forest only
  • "xgb"      → XGBoost only
  • "ensemble" → RF + XGBoost majority vote (default, highest accuracy)
  • "anomaly"  → IsolationForest only
  • "full"     → Ensemble + IsolationForest combined score
"""

import os
import logging
import numpy as np
import pandas as pd
import joblib

logger = logging.getLogger(__name__)
MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "models")

# ─── Severity thresholds ──────────────────────────────────────────────────────
def risk_to_severity(score: float) -> str:
    if score >= 80:
        return "Critical"
    if score >= 60:
        return "High"
    if score >= 35:
        return "Medium"
    return "Low"


# ─── Model Registry ───────────────────────────────────────────────────────────
class ModelRegistry:
    """Loads and caches all trained models lazily."""

    def __init__(self):
        self._rf   = None
        self._xgb  = None
        self._iso  = None
        self._cols = None

    def _path(self, filename):
        return os.path.join(MODEL_DIR, filename)

    @property
    def rf(self):
        if self._rf is None:
            self._rf = joblib.load(self._path("random_forest.pkl"))
        return self._rf

    @property
    def xgb(self):
        if self._xgb is None:
            self._xgb = joblib.load(self._path("xgboost.pkl"))
        return self._xgb

    @property
    def iso(self):
        if self._iso is None:
            self._iso = joblib.load(self._path("isolation_forest.pkl"))
        return self._iso

    @property
    def feature_cols(self):
        if self._cols is None:
            self._cols = joblib.load(self._path("feature_cols.pkl"))
        return self._cols

    def available_models(self):
        found = []
        for name, fname in [("rf", "random_forest.pkl"), ("xgb", "xgboost.pkl"), ("iso", "isolation_forest.pkl")]:
            if os.path.exists(self._path(fname)):
                found.append(name)
        return found


registry = ModelRegistry()


# ─── Feature alignment ────────────────────────────────────────────────────────
def align_features(df: pd.DataFrame, expected_cols: list) -> pd.DataFrame:
    """
    Aligns incoming DataFrame columns to what the model expects.
    Adds zero-filled columns for any missing features.
    Drops extra columns.
    """
    for col in expected_cols:
        if col not in df.columns:
            df[col] = 0.0
    return df[expected_cols].astype(float)


# ─── Core prediction ──────────────────────────────────────────────────────────
def predict(df: pd.DataFrame, mode: str = "ensemble") -> list:
    """
    Predict on a DataFrame of network flow features.

    Parameters
    ----------
    df   : DataFrame with flow features (CICIDS or compact format)
    mode : "rf" | "xgb" | "ensemble" | "anomaly" | "full"

    Returns
    -------
    List of dicts, one per row:
      {
        "prediction"   : "attack" | "benign",
        "risk_score"   : float (0-100),
        "severity"     : str,
        "rf_prob"      : float | None,
        "xgb_prob"     : float | None,
        "anomaly_flag" : bool | None,
        "model_used"   : str,
      }
    """
    available = registry.available_models()

    # Align features
    try:
        expected = registry.feature_cols
        X = align_features(df.copy(), expected)
    except (FileNotFoundError, KeyError, ValueError, AttributeError):
        logger.warning("Feature alignment failed, falling back to numeric columns")
        X = df.select_dtypes(include=[np.number]).copy()

    results = []
    rf_probs    = None
    xgb_probs   = None
    iso_flags   = None

    if mode in ("rf", "ensemble", "full") and "rf" in available:
        try:
            rf_probs = registry.rf.predict_proba(X)[:, 1]
        except Exception as e:
            logger.warning(f"RF prediction failed: {e}")

    if mode in ("xgb", "ensemble", "full") and "xgb" in available:
        try:
            xgb_probs = registry.xgb.predict_proba(X)[:, 1]
        except Exception as e:
            logger.warning(f"XGB prediction failed: {e}")

    if mode in ("anomaly", "full") and "iso" in available:
        try:
            raw = registry.iso.predict(X)
            iso_flags = (raw == -1)
        except Exception as e:
            logger.warning(f"IsoForest prediction failed: {e}")

    for i in range(len(X)):
        rf_p  = float(rf_probs[i])  if rf_probs  is not None else None
        xgb_p = float(xgb_probs[i]) if xgb_probs is not None else None
        iso_f = bool(iso_flags[i])  if iso_flags  is not None else None

        if mode == "rf" and rf_p is not None:
            risk_score = rf_p * 100
            model_used = "RandomForest"
        elif mode == "xgb" and xgb_p is not None:
            risk_score = xgb_p * 100
            model_used = "XGBoost"
        elif mode == "ensemble":
            probs = [p for p in [rf_p, xgb_p] if p is not None]
            risk_score = (sum(probs) / len(probs)) * 100 if probs else 50.0
            model_used = "RF+XGB Ensemble"
        elif mode == "anomaly" and iso_f is not None:
            risk_score = 85.0 if iso_f else 15.0
            model_used = "IsolationForest"
        elif mode == "full":
            w_rf  = 0.4 if rf_p  is not None else 0
            w_xgb = 0.4 if xgb_p is not None else 0
            w_iso = 0.2 if iso_f is not None else 0
            total_w = w_rf + w_xgb + w_iso or 1
            score = 0
            if rf_p  is not None: score += rf_p  * w_rf
            if xgb_p is not None: score += xgb_p * w_xgb
            if iso_f is not None: score += (0.85 if iso_f else 0.15) * w_iso
            risk_score = (score / total_w) * 100
            model_used = "Full Ensemble (RF+XGB+ISO)"
        else:
            probs = [p for p in [rf_p, xgb_p] if p is not None]
            risk_score = (sum(probs) / len(probs)) * 100 if probs else 50.0
            model_used = "Fallback"

        risk_score = float(np.clip(risk_score, 0, 100))
        prediction = "attack" if risk_score >= 40 else "benign"
        severity   = risk_to_severity(risk_score)

        results.append({
            "prediction"   : prediction,
            "risk_score"   : round(risk_score, 2),
            "severity"     : severity,
            "rf_prob"      : round(rf_p, 4)  if rf_p  is not None else None,
            "xgb_prob"     : round(xgb_p, 4) if xgb_p is not None else None,
            "anomaly_flag" : iso_f,
            "model_used"   : model_used,
        })

    return results


def predict_flow(flow_dict: dict, mode: str = "ensemble") -> dict:
    """Predict a single flow dict — used by real-time WebSocket pipeline."""
    df = pd.DataFrame([flow_dict])
    results = predict(df, mode=mode)
    return results[0] if results else {
        "prediction": "benign", "risk_score": 0, "severity": "Low",
        "rf_prob": None, "xgb_prob": None, "anomaly_flag": None,
        "model_used": "none",
    }


def model_status() -> dict:
    """Returns model availability info for /health endpoint."""
    available = registry.available_models()
    return {
        "models_loaded"    : available,
        "random_forest"    : "rf"  in available,
        "xgboost"          : "xgb" in available,
        "isolation_forest" : "iso" in available,
        "recommended_mode" : "full"     if len(available) == 3 else
                             "ensemble" if "rf" in available and "xgb" in available else
                             available[0] if available else "none",
    }