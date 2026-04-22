<div align="center">

<img src="https://img.shields.io/badge/Python-3.13-3776AB?style=for-the-badge&logo=python&logoColor=white"/>
<img src="https://img.shields.io/badge/scikit--learn-ML-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white"/>
<img src="https://img.shields.io/badge/XGBoost-Model-189AB4?style=for-the-badge"/>
<img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white"/>
<img src="https://img.shields.io/badge/WebSocket-Live%20Stream-6DB33F?style=for-the-badge"/>
<img src="https://img.shields.io/badge/React-Dashboard-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>

# 🔐 AI-Based Encrypted Traffic Analysis System

### *Detecting cyber threats in encrypted network traffic — without breaking the encryption.*

> A real-time Intrusion Detection System (IDS) powered by Machine Learning that classifies network traffic as **BENIGN or ATTACK** by analysing flow-level behavioural features — not packet content.

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Why This Matters](#-why-this-matters)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Machine Learning Models](#-machine-learning-models)
- [Dataset](#-dataset)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [How It Works](#-how-it-works)
- [Installation & Setup](#-installation--setup)
- [Team](#-team)

---

## 🧠 Overview

Modern cyber attacks increasingly hide inside **encrypted traffic** (HTTPS, TLS). Traditional firewalls and Deep Packet Inspection (DPI) tools are blind to these threats because they cannot read encrypted content.

This system solves that by analysing **traffic behaviour** — not content. It captures live network packets, extracts statistical flow features, and passes them through trained ML models to detect threats in real time — all displayed on a live web dashboard.

---

## 🚨 Why This Matters

| Traditional IDS | This System |
|---|---|
| Reads packet content (breaks with encryption) | Analyses flow-level statistics (encryption-safe) |
| Rule-based, static signatures | ML-based, learns patterns |
| Offline / batch analysis | Real-time detection + live dashboard |
| No explainability | SHAP-powered model explanations |

> **Encrypted traffic is now over 95% of internet traffic.** Standard tools are becoming obsolete. This system is built for the modern threat landscape.

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     LIVE NETWORK TRAFFIC                    │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              capture/ — Packet Capture Layer                │
│   packet_capture.py  →  flow_builder.py                     │
│   (Scapy / pyshark)     (Flow feature extraction)           │
└─────────────────────┬───────────────────────────────────────┘
                      │  Flow-level feature vectors
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              detection/ — ML Detection Engine               │
│   model_loader.py  →  predictor.py  →  risk_engine.py       │
│   (Load models)       (Run inference)   (Risk scoring)      │
└─────────────────────┬───────────────────────────────────────┘
                      │  Predictions + Risk Scores
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              services/ — Detection & Stream Services        │
│   detection_service.py     stream_service.py                │
│   (Orchestrate pipeline)   (Push data to frontend)          │
└─────────────────────┬───────────────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
┌──────────────────┐   ┌──────────────────────────────────────┐
│   api/ — REST    │   │   frontend/ — Live Dashboard         │
│   predict.py     │   │   React + Chart.js                   │
│   explain.py     │   │   Real-time alerts, traffic graphs,  │
│   websocket.py   │   │   threat classification display      │
└──────────────────┘   └──────────────────────────────────────┘
```

---

## 📁 Project Structure

```
encrypted-traffic-ai/
│
├── 📂 api/                        # REST API + WebSocket endpoints
│   ├── predict.py                 # /predict — run ML inference on traffic
│   ├── explain.py                 # /explain — SHAP-based explanations
│   └── websocket.py               # WebSocket handler for live streaming
│
├── 📂 capture/                    # Network packet capture layer
│   ├── packet_capture.py          # Live packet sniffing
│   └── flow_builder.py            # Converts packets → flow feature vectors
│
├── 📂 data/                       # Training datasets (CICIDS 2017)
│   ├── cicids2017_cleaned.csv     # Cleaned + merged dataset
│   ├── flows.csv / flows_cleaned.csv
│   ├── merged.csv / test.csv
│   └── [Day-specific ISCX CSV files]
│
├── 📂 detection/                  # Core ML detection logic
│   ├── model_loader.py            # Loads trained models from /models
│   ├── predictor.py               # Runs predictions on feature vectors
│   └── risk_engine.py             # Converts predictions → risk scores
│
├── 📂 frontend/                   # React live monitoring dashboard
│   └── [React components, charts, alert UI]
│
├── 📂 logs/                       # System and detection logs
│
├── 📂 models/                     # Trained ML model files
│   ├── random_forest.pkl          # Random Forest classifier
│   ├── xgboost.pkl                # XGBoost classifier
│   ├── isolation_forest.pkl       # Unsupervised anomaly detector
│   ├── anomaly_iforest.joblib     # Isolation Forest (joblib format)
│   ├── supervised_rf.joblib       # Supervised Random Forest (joblib)
│   ├── trained_models.pkl         # Combined model bundle
│   ├── label_encoder.pkl          # Attack label encoder
│   └── feature_cols.pkl           # Feature column definitions
│
├── 📂 reports/
│   └── shap_summary.png           # SHAP feature importance plot
│
├── 📂 services/                   # Background services
│   ├── detection_service.py       # End-to-end detection pipeline
│   └── stream_service.py          # Live data streaming to frontend
│
├── 📂 src/                        # Core ML source utilities
│   ├── features.py                # Feature engineering logic
│   ├── infer.py                   # Inference helper functions
│   ├── explain.py                 # SHAP explanation utilities
│   └── live_capture.py            # Live capture integration
│
├── dashboard.py                   # Plotly/Dash monitoring dashboard
├── dashboard.js                   # JS dashboard entry point
├── main.py                        # Application entry point
├── train_models.py                # ML model training script
└── requirements.txt               # Python dependencies
```

---

## 🤖 Machine Learning Models

The system uses an **ensemble of three ML models** trained on the CICIDS 2017 benchmark dataset:

### 1. 🌲 Random Forest Classifier
- **File:** `models/random_forest.pkl` / `models/supervised_rf.joblib`
- **Type:** Supervised classification
- **Task:** Multi-class attack type classification
- **Strength:** High accuracy, robust to noise, handles feature importance well

### 2. ⚡ XGBoost Classifier
- **File:** `models/xgboost.pkl`
- **Type:** Supervised gradient boosting
- **Task:** Encrypted traffic threat classification
- **Strength:** Fast inference, excellent on tabular flow features, handles class imbalance

### 3. 🔍 Isolation Forest
- **File:** `models/isolation_forest.pkl` / `models/anomaly_iforest.joblib`
- **Type:** Unsupervised anomaly detection
- **Task:** Detects zero-day or unknown attack patterns
- **Strength:** Does not need labelled data, catches novel threats

### Supporting Artefacts
| File | Purpose |
|---|---|
| `feature_cols.pkl` | Defines which features the models expect |
| `label_encoder.pkl` | Maps numeric predictions → attack class names |
| `reports/shap_summary.png` | SHAP values showing top features driving detections |

---

## 📊 Dataset

**CICIDS 2017 — Canadian Institute for Cybersecurity Intrusion Detection Dataset**

| Day File | Attack Types Included |
|---|---|
| `Monday-WorkingHours` | Benign only (baseline) |
| `Tuesday-WorkingHours` | FTP-Patator, SSH-Patator |
| `Wednesday-workingHours` | DoS Slowloris, Heartbleed |
| `Thursday-Morning-WebAttacks` | XSS, SQL Injection, Brute Force |
| `Thursday-Afternoon-Infilteration` | Infiltration |
| `Friday-Morning` | Botnet, Port Scan |
| `Friday-Afternoon-DDos` | DDoS |
| `Friday-Afternoon-PortScan` | Port Scan |

- **Cleaned dataset:** `cicids2017_cleaned.csv`
- **Feature count:** 78 flow-level features per traffic sample
- **Preprocessing:** Handled in `src/features.py` and `train_models.py`

> ⚠️ Dataset files are excluded from this repository due to size. Download from [CICIDS 2017 Official Page](https://www.unb.ca/cic/datasets/ids-2017.html) and place in `/data`.

---

## ✨ Key Features

- 🔴 **Real-time traffic capture** — live packet sniffing via `capture/packet_capture.py`
- 🧬 **Flow feature extraction** — 78 statistical features extracted per flow via `flow_builder.py`
- 🤖 **ML ensemble detection** — Random Forest + XGBoost + Isolation Forest working together
- 📡 **WebSocket streaming** — live predictions pushed to frontend with zero polling delay
- 📊 **Live dashboard** — React frontend with real-time charts, alert feed, and threat status
- 🧠 **Explainable AI** — SHAP values explain *why* a flow was flagged as suspicious
- ⚠️ **Risk scoring** — `risk_engine.py` converts raw predictions into human-readable risk levels
- 🗂️ **REST API** — `/predict` and `/explain` endpoints for programmatic access

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Language** | Python 3.13 |
| **ML / Training** | scikit-learn, XGBoost, SHAP |
| **Packet Capture** | Scapy / pyshark |
| **Backend API** | FastAPI |
| **Real-time Streaming** | WebSockets |
| **Frontend Dashboard** | React, Chart.js |
| **Model Storage** | joblib, pickle |
| **Dataset** | CICIDS 2017 (Canadian Institute for Cybersecurity) |
| **Visualisation** | Plotly / Dash (`dashboard.py`) |

---

## ⚙️ How It Works

```
Step 1 → Live packets captured from network interface
           └── capture/packet_capture.py

Step 2 → Packets assembled into flows, features extracted
           └── capture/flow_builder.py → src/features.py

Step 3 → Feature vectors fed into ML models
           └── detection/model_loader.py → detection/predictor.py

Step 4 → Risk score computed and alert generated
           └── detection/risk_engine.py

Step 5 → Result pushed via WebSocket to frontend
           └── api/websocket.py → services/stream_service.py

Step 6 → Live dashboard displays threat classification
           └── frontend/ React dashboard
```

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.13+
- Node.js (for frontend)
- Npcap / libpcap (for packet capture)

### 1. Clone the repository
```bash
git clone https://github.com/Shreyansh2434/AI-Based-Encrypted-Traffic-Analysis-System.git
cd AI-Based-Encrypted-Traffic-Analysis-System/encrypted-traffic-ai
```

### 2. Set up virtual environment
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Add dataset
Download [CICIDS 2017](https://www.unb.ca/cic/datasets/ids-2017.html) and place CSVs in `/data/`

### 5. Train models
```bash
python train_models.py
```

### 6. Run the system
```bash
python main.py
```

### 7. Launch dashboard
```bash
python dashboard.py
# Or open frontend/ in a browser (React)
```

---

## 👥 Team

| Member | Role |
|---|---|
| **Shreyansh** | Team Lead · ML Model Training & Testing (`train_models.py`, `src/`, `models/`) |
| **Pranay** | IDS / Detection Service (`detection/`, `services/detection_service.py`) |
| **Aakarshan** | Backend · API · WebSocket · System Integration (`api/`, `services/stream_service.py`, `main.py`) |
| **Shreya** | Frontend · Live Dashboard · UI (`frontend/`, `dashboard.py`, `dashboard.js`) |

---

## 📄 License

This project was developed as a final year major project for academic purposes.

---

<div align="center">

**Built with 🔐 security, 🤖 intelligence, and ☕ caffeine**

*University Major Project — 2025*

</div>
