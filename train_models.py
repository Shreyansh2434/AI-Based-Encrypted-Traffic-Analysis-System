"""
train_models.py
===============
Encrypted Traffic AI Detection Platform — ML Training Pipeline
Trains 3 models and saves them to models/

Models:
  1. RandomForestClassifier   — fast, interpretable, high accuracy baseline
  2. XGBoostClassifier        — best for tabular network flow data, handles imbalance well
  3. IsolationForest          — unsupervised anomaly detector for zero-day / unknown threats

Dataset:
  CICIDS2017-compatible CSV (CICFlowMeter output).
  Expected label column: ' Label'  (note leading space — CIC convention).
  Benign rows stay as "BENIGN"; everything else is an attack.

Usage:
  pip install scikit-learn xgboost imbalanced-learn joblib pandas numpy

  # Train on single dataset
  python train_models.py --dataset path/to/dataset.csv

  # Train on all CSV files in data/ folder (auto-discovery)
  python train_models.py --dataset all

  # Skip datasets with 0 attacks — only trains on datasets with both benign + attack traffic
"""

import sys
import io

# Force UTF-8 output on Windows
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

import argparse
import warnings
import time
import os
import glob

import numpy as np
import pandas as pd
import joblib

from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.metrics import (
    classification_report, confusion_matrix,
    roc_auc_score, f1_score, accuracy_score
)
from sklearn.feature_selection import SelectFromModel
from sklearn.pipeline import Pipeline

import xgboost as xgb
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline

warnings.filterwarnings("ignore")

# --- Config ------------------------------------------------------------------
MODEL_DIR = "models/"
RANDOM_STATE = 42
TEST_SIZE = 0.2
N_JOBS = -1

# Top CICFlowMeter features most correlated with attack detection
# (based on research: Sharafaldin et al. 2018, feature importance studies)
TOP_FEATURES = [
    " Flow Duration",
    " Total Fwd Packets",
    " Total Backward Packets",
    " Total Length of Fwd Packets",
    " Total Length of Bwd Packets",
    " Fwd Packet Length Max",
    " Fwd Packet Length Min",
    " Fwd Packet Length Mean",
    " Fwd Packet Length Std",
    " Bwd Packet Length Max",
    " Bwd Packet Length Min",
    " Bwd Packet Length Mean",
    " Bwd Packet Length Std",
    " Flow Bytes/s",
    " Flow Packets/s",
    " Flow IAT Mean",
    " Flow IAT Std",
    " Flow IAT Max",
    " Flow IAT Min",
    " Fwd IAT Total",
    " Fwd IAT Mean",
    " Fwd IAT Std",
    " Fwd IAT Max",
    " Fwd IAT Min",
    " Bwd IAT Total",
    " Bwd IAT Mean",
    " Bwd IAT Std",
    " Bwd IAT Max",
    " Bwd IAT Min",
    " Fwd PSH Flags",
    " Fwd URG Flags",
    " Fwd Header Length",
    " Bwd Header Length",
    " Fwd Packets/s",
    " Bwd Packets/s",
    " Min Packet Length",
    " Max Packet Length",
    " Packet Length Mean",
    " Packet Length Std",
    " Packet Length Variance",
    " FIN Flag Count",
    " SYN Flag Count",
    " RST Flag Count",
    " PSH Flag Count",
    " ACK Flag Count",
    " URG Flag Count",
    " CWE Flag Count",
    " ECE Flag Count",
    " Down/Up Ratio",
    " Average Packet Size",
    " Avg Fwd Segment Size",
    " Avg Bwd Segment Size",
    " Fwd Avg Bytes/Bulk",
    " Fwd Avg Packets/Bulk",
    " Fwd Avg Bulk Rate",
    " Bwd Avg Bytes/Bulk",
    " Bwd Avg Packets/Bulk",
    " Bwd Avg Bulk Rate",
    "Subflow Fwd Packets",
    " Subflow Fwd Bytes",
    " Subflow Bwd Packets",
    " Subflow Bwd Bytes",
    "Init_Win_bytes_forward",
    " Init_Win_bytes_backward",
    " act_data_pkt_fwd",
    " min_seg_size_forward",
    "Active Mean",
    " Active Std",
    " Active Max",
    " Active Min",
    "Idle Mean",
    " Idle Std",
    " Idle Max",
    " Idle Min",
]

# Fallback compact feature set (matches your existing flow_builder.py output)
COMPACT_FEATURES = [
    "duration", "fwd_pkts", "bwd_pkts", "fwd_bytes", "bwd_bytes",
    "pkt_len_mean", "pkt_len_std", "iat_mean", "iat_std",
]

LABEL_COL_OPTIONS = [" Label", "Label", "label", " label", "Attack Type", "attack_type"]


# --- Helpers -----------------------------------------------------------------

def find_label_column(df):
    for col in LABEL_COL_OPTIONS:
        if col in df.columns:
            return col
    raise ValueError(f"No label column found. Tried: {LABEL_COL_OPTIONS}")


def load_and_clean(path: str, sample_size=None):
    # Auto-resolve path: if not absolute and file doesn't exist, try data/ directory
    if not os.path.isabs(path) and not os.path.exists(path):
        data_path = os.path.join("data", path)
        if os.path.exists(data_path):
            path = data_path

    print(f"\n[1/5] Loading dataset: {path}")
    df = pd.read_csv(path, low_memory=False)
    print(f"      Shape: {df.shape}")

    # Quick sampling for fast training
    if sample_size and len(df) > sample_size:
        df = df.sample(n=sample_size, random_state=RANDOM_STATE)
        print(f"      Sampled to: {df.shape}")

    label_col = find_label_column(df)
    print(f"      Label column: '{label_col}'")

    # Drop rows with inf / NaN
    df.replace([np.inf, -np.inf], np.nan, inplace=True)
    before = len(df)
    df.dropna(inplace=True)
    print(f"      Dropped {before - len(df)} inf/NaN rows. Remaining: {len(df)}")

    # Select features
    available_top = [f for f in TOP_FEATURES if f in df.columns]
    available_compact = [f for f in COMPACT_FEATURES if f in df.columns]

    if len(available_top) >= 10:
        feature_cols = available_top
        print(f"      Using {len(feature_cols)} CICIDS full features")
    elif len(available_compact) >= 4:
        feature_cols = available_compact
        print(f"      Using {len(feature_cols)} compact features (flow_builder output)")
    else:
        # Fallback: use all numeric columns except label
        feature_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        if label_col in feature_cols:
            feature_cols.remove(label_col)
        print(f"      Fallback: using all {len(feature_cols)} numeric columns")

    X = df[feature_cols].astype(float)
    y_raw = df[label_col].astype(str).str.strip()

    # Binary encoding: benign => 0 (BENIGN, Normal Traffic, etc.), attacks => 1
    benign_labels = {"BENIGN", "Normal Traffic", "normal traffic", "benign"}
    y_binary = (~y_raw.isin(benign_labels)).astype(int)
    # Multi-class encoding
    le = LabelEncoder()
    y_multi = le.fit_transform(y_raw)

    print(f"\n      Class distribution (binary):")
    print(f"        Benign : {(y_binary==0).sum():>8,}")
    print(f"        Attack : {(y_binary==1).sum():>8,}")
    print(f"\n      Attack types found: {sorted(y_raw.unique())}")

    return X, y_binary, y_multi, le, feature_cols


def print_metrics(name, y_test, y_pred, y_prob=None):
    print(f"\n{'-'*50}")
    print(f"  {name} — Results")
    print(f"{'-'*50}")
    print(f"  Accuracy : {accuracy_score(y_test, y_pred)*100:.2f}%")
    print(f"  F1 Score : {f1_score(y_test, y_pred, average='weighted'):.4f}")
    if y_prob is not None:
        try:
            auc = roc_auc_score(y_test, y_prob)
            print(f"  ROC-AUC  : {auc:.4f}")
        except Exception:
            pass
    print(f"\n  Classification Report:")
    print(classification_report(y_test, y_pred, target_names=["Benign", "Attack"]))


# --- Model 1: Random Forest (existing, upgraded) -----------------------------

def train_random_forest(X_train, X_test, y_train, y_test):
    print("\n[MODEL 1] RandomForestClassifier")
    print("         > Fast training (no SMOTE, direct fit)")

    t0 = time.time()

    rf = RandomForestClassifier(
        n_estimators=100,
        max_depth=15,
        min_samples_split=10,
        min_samples_leaf=5,
        max_features="sqrt",
        class_weight="balanced",      # handles class imbalance natively
        random_state=RANDOM_STATE,
        n_jobs=N_JOBS,
    )

    rf.fit(X_train, y_train)
    y_pred = rf.predict(X_test)
    y_prob = rf.predict_proba(X_test)[:, 1]

    print_metrics("Random Forest", y_test, y_pred, y_prob)
    print(f"         Training time: {time.time()-t0:.1f}s")

    # Feature importances
    importances = rf.feature_importances_
    top_idx = np.argsort(importances)[::-1][:10]
    print("\n  Top-10 Feature Importances:")
    for i in top_idx:
        print(f"    {X_train.columns[i]:<40} {importances[i]:.4f}")

    return rf


# --- Model 2: XGBoost --------------------------------------------------------

def train_xgboost(X_train, X_test, y_train, y_test):
    print("\n[MODEL 2] XGBoostClassifier")
    print("         > Best for tabular network flow data")
    print("         > Handles class imbalance via scale_pos_weight")

    t0 = time.time()

    # Compute class weight for imbalanced data
    neg = (y_train == 0).sum()
    pos = (y_train == 1).sum()
    scale = neg / pos if pos > 0 else 1.0
    print(f"         scale_pos_weight = {scale:.2f}")

    scaler = StandardScaler()

    xgb_model = xgb.XGBClassifier(
        n_estimators=150,
        max_depth=6,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        scale_pos_weight=scale,
        use_label_encoder=False,
        eval_metric="logloss",
        random_state=RANDOM_STATE,
        n_jobs=N_JOBS,
        tree_method="hist",           # fast histogram-based training
    )

    pipeline = Pipeline([
        ("scaler", scaler),
        ("model", xgb_model),
    ])

    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)
    y_prob = pipeline.predict_proba(X_test)[:, 1]

    print_metrics("XGBoost", y_test, y_pred, y_prob)
    print(f"         Training time: {time.time()-t0:.1f}s")

    # Feature importances
    importances = pipeline.named_steps["model"].feature_importances_
    top_idx = np.argsort(importances)[::-1][:10]
    print("\n  Top-10 Feature Importances:")
    for i in top_idx:
        print(f"    {X_train.columns[i]:<40} {importances[i]:.4f}")

    return pipeline


# --- Model 3: Isolation Forest (Anomaly / Zero-Day) -------------------------

def train_isolation_forest(X_train, X_test, y_test):
    print("\n[MODEL 3] IsolationForest — Unsupervised Anomaly Detector")
    print("         > Detects zero-day / unknown attacks without labels")
    print("         > Trained ONLY on benign traffic")

    t0 = time.time()
    scaler = StandardScaler()

    iso = IsolationForest(
        n_estimators=200,
        contamination=0.05,           # expect ~5% anomalous in real traffic
        max_samples="auto",
        random_state=RANDOM_STATE,
        n_jobs=N_JOBS,
    )

    pipeline = Pipeline([
        ("scaler", scaler),
        ("model", iso),
    ])

    pipeline.fit(X_train)            # unsupervised — no y_train

    # IsolationForest returns -1 (anomaly) or 1 (normal)
    raw_pred = pipeline.predict(X_test)
    y_pred = (raw_pred == -1).astype(int)   # anomaly => 1 (attack), normal => 0

    # Anomaly score (the lower the score, the more anomalous)
    scores = -pipeline.named_steps["model"].score_samples(
        pipeline.named_steps["scaler"].transform(X_test)
    )

    print_metrics("Isolation Forest", y_test, y_pred)
    print(f"         Training time: {time.time()-t0:.1f}s")
    print(f"         Note: Isolation Forest can only report binary output.")
    print(f"         It is best used alongside RF/XGBoost for zero-day coverage.")

    return pipeline


# --- Save models -------------------------------------------------------------

def save_models(rf_pipeline, xgb_pipeline, iso_pipeline, le, feature_cols):
    os.makedirs(MODEL_DIR, exist_ok=True)

    joblib.dump(rf_pipeline,  MODEL_DIR + "random_forest.pkl")
    joblib.dump(xgb_pipeline, MODEL_DIR + "xgboost.pkl")
    joblib.dump(iso_pipeline, MODEL_DIR + "isolation_forest.pkl")
    joblib.dump(le,           MODEL_DIR + "label_encoder.pkl")
    joblib.dump(feature_cols, MODEL_DIR + "feature_cols.pkl")

    # Backwards-compatible alias (your existing code uses trained_models.pkl)
    joblib.dump(rf_pipeline,  MODEL_DIR + "trained_models.pkl")

    print(f"\n[5/5] Models saved to '{MODEL_DIR}':")
    print(f"      random_forest.pkl     — primary detection model")
    print(f"      xgboost.pkl           — secondary high-accuracy model")
    print(f"      isolation_forest.pkl  — zero-day / anomaly model")
    print(f"      label_encoder.pkl     — attack type encoder")
    print(f"      feature_cols.pkl      — ordered feature list for inference")
    print(f"      trained_models.pkl    — alias => random_forest.pkl")


# --- Main ---------------------------------------------------------------------

def get_csv_files(data_dir="data"):
    """Get all CSV files in data directory."""
    pattern = os.path.join(data_dir, "*.csv")
    files = sorted(glob.glob(pattern))
    return files


def is_valid_dataset(path: str) -> tuple:
    """
    Check if dataset is valid for training (has both benign and attack traffic).
    Returns (is_valid, num_benign, num_attack, attack_label)
    """
    try:
        df = pd.read_csv(path, low_memory=False)
        label_col = find_label_column(df)

        # Drop inf/NaN
        df.replace([np.inf, -np.inf], np.nan, inplace=True)
        df.dropna(inplace=True)

        # Check classes
        benign_count = (df[label_col] == "BENIGN").sum()
        attack_count = len(df) - benign_count

        is_valid = benign_count > 0 and attack_count > 0
        attack_types = df[label_col].unique()
        attack_label = [t for t in attack_types if t != "BENIGN"][0] if len(attack_types) > 1 else None

        return is_valid, benign_count, attack_count, attack_label
    except Exception as e:
        return False, 0, 0, None


def main_single(dataset_path: str, sample_size=None):
    """Train on a single dataset."""
    # 1. Load
    X, y_binary, y_multi, le, feature_cols = load_and_clean(dataset_path, sample_size=sample_size)

    # Skip if only 1 class
    if len(np.unique(y_binary)) < 2:
        print(f"\n[SKIP] Dataset has only 1 class (benign traffic only, no attacks).")
        return False

    # 2. Split
    print(f"\n[2/5] Splitting data: {int((1-TEST_SIZE)*100)}% train / {int(TEST_SIZE*100)}% test")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_binary, test_size=TEST_SIZE, random_state=RANDOM_STATE, stratify=y_binary
    )
    print(f"      Train: {len(X_train):,} | Test: {len(X_test):,}")

    # Benign-only subset for IsolationForest
    X_train_benign = X_train[y_train == 0]
    print(f"      Benign-only (for IsoForest): {len(X_train_benign):,}")

    # 3. Train
    print("\n[3/5] Training models...")
    rf_pipeline  = train_random_forest(X_train, X_test, y_train, y_test)
    xgb_pipeline = train_xgboost(X_train, X_test, y_train, y_test)
    iso_pipeline = train_isolation_forest(X_train_benign, X_test, y_test)

    # 4. Ensemble quick comparison
    print("\n[4/5] Ensemble comparison (majority vote RF + XGB):")
    rf_pred  = rf_pipeline.predict(X_test)
    xgb_pred = xgb_pipeline.predict(X_test)
    ensemble = ((rf_pred + xgb_pred) >= 1).astype(int)  # either flags => alert
    print_metrics("RF + XGB Ensemble", y_test, ensemble)

    # 5. Save
    save_models(rf_pipeline, xgb_pipeline, iso_pipeline, le, feature_cols)
    print("\n[OK] All models trained and saved. Ready to use with predictor.py")
    return True


def main_batch():
    """Train on all valid CSV files in data/ directory."""
    csv_files = get_csv_files("data")

    if not csv_files:
        print("ERROR: No CSV files found in data/ directory")
        return

    print(f"[FOUND] {len(csv_files)} CSV files in data/")
    print("\n" + "="*70)
    print("VALIDATION PHASE: Checking datasets for training suitability")
    print("="*70)

    valid_datasets = []
    skipped_datasets = []

    for csv_file in csv_files:
        filename = os.path.basename(csv_file)
        is_valid, benign, attack, label = is_valid_dataset(csv_file)

        if is_valid:
            valid_datasets.append(csv_file)
            print(f"[OK]   {filename:<50} Benign: {benign:>7,}  Attack: {attack:>7,}  ({label})")
        else:
            skipped_datasets.append((filename, benign, attack))
            print(f"[SKIP] {filename:<50} WARNING: Only benign traffic ({benign:>7,} samples)")

    print("\n" + "="*70)
    print(f"TRAINING PHASE: {len(valid_datasets)} datasets ready for training")
    print("="*70)

    if not valid_datasets:
        print("ERROR: No datasets with both benign and attack traffic found.")
        return

    for i, csv_file in enumerate(valid_datasets, 1):
        filename = os.path.basename(csv_file)
        print(f"\n{'─'*70}")
        print(f"[{i}/{len(valid_datasets)}] {filename}")
        print(f"{'─'*70}")

        try:
            success = main_single(csv_file)
            if success:
                print(f"[DONE] Successfully trained on {filename}")
        except Exception as e:
            print(f"[ERROR] Training failed on {filename}: {e}")

    print("\n" + "="*70)
    print("TRAINING COMPLETE")
    print("="*70)
    if skipped_datasets:
        print(f"\n[SKIPPED] {len(skipped_datasets)} benign-only datasets:")
        for filename, benign, attack in skipped_datasets:
            print(f"    - {filename} ({benign:,} benign, 0 attacks)")


def main():
    parser = argparse.ArgumentParser(
        description="Train 3 ML models for Encrypted Traffic AI",
        epilog="Examples:\n"
               "  python train_models.py --dataset data/Monday.csv\n"
               "  python train_models.py --dataset data/Monday.csv --quick-demo\n"
               "  python train_models.py --dataset all  # Train on all CSVs in data/",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument(
        "--dataset",
        required=True,
        help="Path to dataset CSV, or 'all' to train on all CSVs in data/ folder"
    )
    parser.add_argument(
        "--quick-demo",
        action="store_true",
        help="Sample to 100k rows for fast demo training (default: use full dataset)"
    )
    args = parser.parse_args()

    # Check if batch mode
    if args.dataset.lower() == "all":
        main_batch()
    else:
        sample_size = 100000 if args.quick_demo else None
        main_single(args.dataset, sample_size=sample_size)


if __name__ == "__main__":
    main()