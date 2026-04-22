import pandas as pd
import numpy as np

def clean_cic_dataset(input_path, output_path):
    df = pd.read_csv(input_path, low_memory=False)

    # Strip column names
    df.columns = df.columns.str.strip()

    # Remove duplicate label columns
    if 'Label' in df.columns and 'label' in df.columns:
        df.drop(columns=['label'], inplace=True)

    # Rename Label → label
    if 'Label' in df.columns:
        df.rename(columns={'Label': 'label'}, inplace=True)

    # Remove infinite values
    df = df.replace([np.inf, -np.inf], np.nan)

    # Drop NaN
    df = df.dropna()

    # Convert labels
    df['label'] = df['label'].apply(lambda x: 'benign' if str(x).upper() == 'BENIGN' else 'attack')

    # Select only required columns (SAFE SELECTION)
    selected_features = [
        'Flow Duration',
        'Total Fwd Packets',
        'Total Backward Packets',
        'Total Length of Fwd Packets',
        'Total Length of Bwd Packets',
        'Fwd Packet Length Mean',
        'Fwd Packet Length Std',
        'Flow IAT Mean',
        'Flow IAT Std',
        'label'
    ]

    # Keep only available columns
    df = df[[col for col in selected_features if col in df.columns]]

    # Rename properly (match only existing columns)
    rename_map = {
        'Flow Duration': 'duration',
        'Total Fwd Packets': 'fwd_pkts',
        'Total Backward Packets': 'bwd_pkts',
        'Total Length of Fwd Packets': 'fwd_bytes',
        'Total Length of Bwd Packets': 'bwd_bytes',
        'Fwd Packet Length Mean': 'pkt_len_mean',
        'Fwd Packet Length Std': 'pkt_len_std',
        'Flow IAT Mean': 'iat_mean',
        'Flow IAT Std': 'iat_std',
        'label': 'label'
    }

    df.rename(columns=rename_map, inplace=True)

    df.to_csv(output_path, index=False)

    print("✅ Cleaned dataset saved to:", output_path)