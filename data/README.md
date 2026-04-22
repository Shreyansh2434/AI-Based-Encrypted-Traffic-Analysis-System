# Dataset — Encrypted Traffic Detection Dataset

Raw data files are hosted on Kaggle due to size (700MB+).

## Kaggle Dataset
https://www.kaggle.com/datasets/shreyanshrathaur003/encrypted-traffic-detection-dataset

---

## Option A — Load directly in Python (Recommended)

pip install kagglehub

import kagglehub
from kagglehub import KaggleDatasetAdapter

df = kagglehub.load_dataset(
  KaggleDatasetAdapter.PANDAS,
  "shreyanshrathaur003/encrypted-traffic-detection-dataset",
  ""
)

---

## Option B — Download via Kaggle API

pip install kaggle
kaggle datasets download -d shreyanshrathaur003/encrypted-traffic-detection-dataset -p data/ --unzip

---

## Option C — Manual Download
1. Go to the Kaggle link above
2. Click Download
3. Extract all CSV files into this /data folder

---

## Files in This Dataset
- cicids2017_cleaned.csv
- flows.csv
- flows_cleaned.csv
- merged.csv
- test.csv
- Monday-WorkingHours.pcap_ISCX.csv
- Tuesday-WorkingHours.pcap_ISCX.csv
- Wednesday-workingHours.pcap_ISCX.csv
- Thursday-WorkingHours-Morning-WebAttacks.pcap_ISCX.csv
- Thursday-WorkingHours-Afternoon-Infilteration.pcap_ISCX.csv
- Friday-WorkingHours-Morning.pcap_ISCX.csv
- Friday-WorkingHours-Afternoon-DDos.pcap_ISCX.csv
- Friday-WorkingHours-Afternoon-PortScan.pcap_ISCX.csv
