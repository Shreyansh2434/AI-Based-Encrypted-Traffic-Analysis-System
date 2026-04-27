from detection.predictor import predict_flow


def detect_flow(flow, mode: str = "ensemble"):
    """
    Detect threats in a single network flow.

    Parameters
    ----------
    flow : dict
        Network flow features dict (from flow_builder.py)
    mode : str
        Prediction mode: "rf" | "xgb" | "ensemble" | "anomaly" | "full"
        Default: "ensemble"

    Returns
    -------
    dict with keys: prediction, risk_score, severity, rf_prob, xgb_prob,
                    anomaly_flag, model_used
    """
    return predict_flow(flow, mode=mode)