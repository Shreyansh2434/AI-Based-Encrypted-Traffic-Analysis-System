"""
Utility functions for dashboard operations
"""

import numpy as np
import pandas as pd
from datetime import datetime
from typing import Dict, Tuple


def generate_threat() -> Dict:
    """Generate synthetic threat data for demo/testing"""
    risk = np.random.randint(10, 95)
    return {
        "timestamp": datetime.now().strftime("%H:%M:%S"),
        "source_ip": f"192.168.{np.random.randint(1,255)}.{np.random.randint(1,255)}",
        "dest_ip": f"10.0.{np.random.randint(1,255)}.{np.random.randint(1,255)}",
        "threat_type": np.random.choice(["Botnet C2", "DDoS Attack", "Brute Force", "Data Exfil", "Zero-Day"]),
        "risk_score": risk,
        "packets": np.random.randint(50, 5000),
        "bytes": np.random.randint(1000, 500000),
        "protocol": np.random.choice(["TCP", "UDP", "ICMP"]),
    }


def normalize_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """
    Normalize CSV columns to standard format

    Args:
        df: Input dataframe to normalize

    Returns:
        Normalized dataframe with standard column names
    """
    df = df.copy()

    # Column mapping
    col_mapping = {
        'flow duration': 'duration',
        'total fwd packets': 'fwd_pkts',
        'total backward packets': 'bwd_pkts',
        'total length of fwd packets': 'fwd_bytes',
        'total length of bwd packets': 'bwd_bytes',
        'duration': 'duration',
        'fwd_pkts': 'fwd_pkts',
        'bwd_pkts': 'bwd_pkts',
        'source ip': 'source_ip',
        'destination ip': 'dest_ip',
        'protocol': 'protocol',
        'label': 'threat_type',
        'class': 'threat_type',
        'attack type': 'threat_type',
    }

    # Normalize column names
    df.columns = [col.lower().strip() for col in df.columns]

    for old, new in col_mapping.items():
        if old in df.columns and new not in df.columns:
            df[new] = df[old]

    # Generate risk_score if missing
    if 'risk_score' not in df.columns:
        if 'threat_type' in df.columns:
            threat_col = df['threat_type'].astype(str).str.lower()
            df['risk_score'] = threat_col.apply(
                lambda x: 75 if 'attack' in x.lower() or 'malicious' in x.lower()
                         else 25
            )
            df['risk_score'] = df['risk_score'] + np.random.randint(-10, 10, len(df))
        elif 'label' in df.columns:
            threat_col = df['label'].astype(str).str.lower()
            df['risk_score'] = threat_col.apply(
                lambda x: 75 if 'attack' in x.lower() or 'malicious' in x.lower()
                         else 25
            )
            df['risk_score'] = df['risk_score'] + np.random.randint(-10, 10, len(df))
        else:
            df['risk_score'] = np.random.randint(20, 90, len(df))

    # Fill missing required columns
    if 'source_ip' not in df.columns:
        df['source_ip'] = [f"192.168.1.{np.random.randint(1,255)}" for _ in range(len(df))]

    if 'dest_ip' not in df.columns:
        df['dest_ip'] = [f"10.0.0.{np.random.randint(1,255)}" for _ in range(len(df))]

    if 'threat_type' not in df.columns:
        df['threat_type'] = np.where(df['risk_score'] > 60, 'Attack', 'Normal')

    return df[['source_ip', 'dest_ip', 'threat_type', 'risk_score']]


def get_severity(risk: int) -> Tuple[str, str]:
    """
    Get threat severity level and color code

    Args:
        risk: Risk score (0-100)

    Returns:
        Tuple of (severity_level, color_code)
    """
    if risk >= 80:
        return "CRITICAL", "#dc2626"
    elif risk >= 60:
        return "HIGH", "#ef4444"
    elif risk >= 40:
        return "MEDIUM", "#f97316"
    else:
        return "LOW", "#22c55e"
