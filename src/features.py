import pandas as pd
import numpy as np

FEATURE_COLUMNS = [
    "duration",
    "fwd_pkts",
    "bwd_pkts",
    "fwd_bytes",
    "bwd_bytes",
    "pkt_len_mean",
    "pkt_len_std",
    "iat_mean",
    "iat_std",
    "flow_rate",
    "byte_rate",
    "pkt_ratio",
    "byte_ratio",
]

def load_flow_data(csv_path: str) -> pd.DataFrame:
    df = pd.read_csv(csv_path)
    return df

def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    for col in FEATURE_COLUMNS:
        if col not in df.columns:
            df[col] = 0.0

    for col in FEATURE_COLUMNS:
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0.0)

    if "label" in df.columns:
        df["label"] = df["label"].astype(str)

    return df

def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    df["flow_rate"] = df["fwd_pkts"] + df["bwd_pkts"]
    df["byte_rate"] = df["fwd_bytes"] + df["bwd_bytes"]

    df["pkt_ratio"] = (df["fwd_pkts"] + 1) / (df["bwd_pkts"] + 1)
    df["byte_ratio"] = (df["fwd_bytes"] + 1) / (df["bwd_bytes"] + 1)

    df = df.replace([np.inf, -np.inf], 0.0).fillna(0.0)
    return df

def get_feature_matrix(df: pd.DataFrame):
    df = clean_data(df)
    df = engineer_features(df)

    X = df[FEATURE_COLUMNS].values
    y = df["label"].values if "label" in df.columns else None
    return X, y, FEATURE_COLUMNS, df