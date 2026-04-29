<div align="center">

<br/>

# 🔐 AI-Based Encrypted Traffic Analysis System

### _Detecting cyber threats hidden inside encrypted traffic — without ever breaking the encryption_

<br/>

[![Live Demo](https://img.shields.io/badge/LIVE%20DEMO-VERCEL-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://ai-based-encrypted-traffic-analysis-jade.vercel.app)
[![Backend API](https://img.shields.io/badge/BACKEND%20API-RENDER-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://encrypted-traffic-backend.onrender.com)
[![GitHub](https://img.shields.io/badge/SOURCE%20CODE-GITHUB-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Shreyansh2434/AI-Based-Encrypted-Traffic-Analysis-System)
[![Kaggle](https://img.shields.io/badge/DATASET-KAGGLE-20BEFF?style=for-the-badge&logo=kaggle&logoColor=white)](https://www.kaggle.com/datasets/shreyanshrathaur003/encrypted-traffic-detection-dataset)

<br/>

![Python](https://img.shields.io/badge/Python_3.13-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![XGBoost](https://img.shields.io/badge/XGBoost-FF6600?style=flat-square)
![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=flat-square&logo=scikitlearn&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-Live-6DB33F?style=flat-square)
![SHAP](https://img.shields.io/badge/SHAP-Explainable_AI-blueviolet?style=flat-square)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000?style=flat-square&logo=vercel)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square&logo=render&logoColor=black)

</div>

---

## 📌 Table of Contents

|  #  | Section                                              |
| :-: | ---------------------------------------------------- |
| 01  | [The Problem We Solved](#-the-problem-we-solved)     |
| 02  | [System at a Glance](#-system-at-a-glance)           |
| 03  | [Live Deployment](#-live-deployment)                 |
| 04  | [System Architecture](#-system-architecture)         |
| 05  | [Project Structure](#-project-structure)             |
| 06  | [Machine Learning Engine](#-machine-learning-engine) |
| 07  | [Dataset](#-dataset)                                 |
| 08  | [Feature Engineering](#-feature-engineering)         |
| 09  | [Key Capabilities](#-key-capabilities)               |
| 10  | [Tech Stack](#-tech-stack)                           |
| 11  | [How It Works](#-how-it-works--end-to-end)           |
| 12  | [Installation & Setup](#-installation--setup)        |
| 13  | [Team](#-team)                                       |

---

## 🚨 The Problem We Solved

> **Over 95% of all internet traffic today is encrypted.** Traditional Intrusion Detection Systems read packet content to find threats — but encryption makes that content invisible. Attackers know this. They hide inside HTTPS and TLS tunnels precisely because security tools go blind.

Our system takes a fundamentally different approach — analysing **how** traffic behaves, not **what** it contains:

|                  | Traditional IDS       | This System                 |
| :--------------: | --------------------- | --------------------------- |
|    **Method**    | Reads packet content  | Reads traffic behaviour     |
|  **Encryption**  | Breaks with TLS/HTTPS | Works with encryption       |
|  **Detection**   | Static rule-based     | ML-adaptive, self-learning  |
|     **Mode**     | Offline batch only    | Real-time, sub-second       |
| **Transparency** | Black box             | SHAP-powered explainability |
|  **Zero-days**   | Missed                | Caught by Isolation Forest  |

---

## 📊 System at a Glance

| Attribute            | Detail                                                                                    |
| -------------------- | ----------------------------------------------------------------------------------------- |
| **Project Type**     | Real-time AI-powered Network Intrusion Detection System                                   |
| **Detection Method** | Flow-level behavioural analysis (encryption-safe)                                         |
| **ML Models**        | Random Forest · XGBoost · Isolation Forest (ensemble)                                     |
| **Feature Space**    | 78 statistical flow-level features per traffic sample                                     |
| **Dataset**          | CICIDS 2017 — 8 attack types across 5 days of real traffic                                |
| **Attack Types**     | DDoS · Port Scan · Brute Force · SQL Injection · XSS · Botnet · Heartbleed · Infiltration |
| **Streaming**        | WebSocket — zero-polling, sub-second alert delivery                                       |
| **Explainability**   | SHAP values — human-readable reason for every detection                                   |
| **Frontend**         | Vercel                                                                                    |
| **Backend**          | Render                                                                                    |

---

## 🌐 Live Deployment

| Service                              | URL                                                                                                                                                |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🌐 **Frontend** (React Dashboard)    | [ai-based-encrypted-traffic-analysis-jade.vercel.app](https://ai-based-encrypted-traffic-analysis-jade.vercel.app)                               |
| ⚡ **Backend** (FastAPI + WebSocket) | [encrypted-traffic-backend.onrender.com](https://encrypted-traffic-backend.onrender.com)                                                           |
| 📦 **Source Code**                   | [github.com/Shreyansh2434/AI-Based-Encrypted-Traffic-Analysis-System](https://github.com/Shreyansh2434/AI-Based-Encrypted-Traffic-Analysis-System) |
| 📊 **Dataset** (Kaggle)              | [shreyanshrathaur003/encrypted-traffic-detection-dataset](https://www.kaggle.com/datasets/shreyanshrathaur003/encrypted-traffic-detection-dataset) |

> ⚠️ **Note:** The Render free tier spins down after inactivity. The first request may take 30–50 seconds to wake the backend. Subsequent requests are instant.

---

## 🏗 System Architecture

```
LIVE NETWORK INTERFACE
        │
        ▼
┌─────────────────────────────────────┐
│  LAYER 1 — CAPTURE                  │
│  packet_capture.py → flow_builder.py│
│  Sniff packets     → 78 features    │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  LAYER 2 — DETECTION                │
│  model_loader.py → predictor.py     │
│  Load RF/XGB/IF  → Run inference    │
│                  → risk_engine.py   │
│                    LOW/MED/HIGH/CRIT│
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  LAYER 3 — SERVICES                 │
│  detection_service.py               │
│  stream_service.py                  │
└──────────┬──────────────┬───────────┘
           │              │
           ▼              ▼
┌──────────────┐  ┌──────────────────┐
│  API Layer   │  │  Frontend        │
│  predict.py  │  │  React Dashboard │
│  explain.py  │  │  Live charts     │
│  websocket.py│  │  Alert feed      │
│              │  │  SHAP display    │
│  → Render    │  │  → Vercel        │
└──────────────┘  └──────────────────┘
```

---

## 📁 Project Structure

```
encrypted-traffic-ai/
│
├── api/
│   ├── predict.py          POST /predict — ML inference endpoint
│   ├── explain.py          GET /explain  — SHAP explanation endpoint
│   └── websocket.py        ws://.../ws   — live streaming handler
│
├── capture/
│   ├── packet_capture.py   Live interface sniffing (Scapy / pyshark)
│   └── flow_builder.py     Packets → 78-feature flow vector
│
├── data/                   Training datasets (hosted on Kaggle)
│   ├── cicids2017_cleaned.csv
│   ├── flows.csv / flows_cleaned.csv
│   ├── merged.csv / test.csv
│   └── [8x Day-specific ISCX CSV files]
│
├── detection/
│   ├── model_loader.py     Load serialised models into memory
│   ├── predictor.py        Run ensemble inference
│   └── risk_engine.py      Map confidence → risk level
│
├── frontend/               React live monitoring dashboard → Vercel
│
├── logs/                   Runtime and detection logs
│
├── models/
│   ├── random_forest.pkl
│   ├── xgboost.pkl
│   ├── isolation_forest.pkl
│   ├── anomaly_iforest.joblib
│   ├── supervised_rf.joblib
│   ├── trained_models.pkl
│   ├── label_encoder.pkl
│   └── feature_cols.pkl
│
├── reports/
│   └── shap_summary.png    SHAP feature importance plot
│
├── services/
│   ├── detection_service.py   Full pipeline orchestrator
│   └── stream_service.py      WebSocket broadcast handler
│
├── src/
│   ├── features.py         Feature engineering and selection
│   ├── infer.py            Inference helper utilities
│   ├── explain.py          SHAP computation utilities
│   └── live_capture.py     Live capture integration bridge
│
├── dashboard.py            Plotly / Dash Python dashboard
├── dashboard.js            JS dashboard entry point
├── main.py                 APPLICATION ENTRY POINT
├── train_models.py         Offline model training script
└── requirements.txt        Python dependencies
```

---

## 🤖 Machine Learning Engine

The system deploys a **three-model ensemble** — each model contributes a different detection capability:

### Model 1 — Random Forest

| Property      | Detail                                                      |
| ------------- | ----------------------------------------------------------- |
| **Files**     | `models/random_forest.pkl` · `models/supervised_rf.joblib`  |
| **Type**      | Supervised ensemble classifier                              |
| **Mechanism** | 100+ decision trees voting on each sample                   |
| **Strength**  | High accuracy · Noise-tolerant · Feature importance ranking |
| **Task**      | Multi-class attack type classification                      |

### Model 2 — XGBoost

| Property      | Detail                                                   |
| ------------- | -------------------------------------------------------- |
| **File**      | `models/xgboost.pkl`                                     |
| **Type**      | Supervised gradient boosting                             |
| **Mechanism** | Sequential learners — each one corrects prior errors     |
| **Strength**  | Handles class imbalance · Fast inference on tabular data |
| **Task**      | Encrypted traffic threat classification                  |

### Model 3 — Isolation Forest

| Property      | Detail                                                          |
| ------------- | --------------------------------------------------------------- |
| **Files**     | `models/isolation_forest.pkl` · `models/anomaly_iforest.joblib` |
| **Type**      | Unsupervised anomaly detection                                  |
| **Mechanism** | Isolates anomalies using random partitioning                    |
| **Strength**  | No labelled data needed · Catches zero-day attacks              |
| **Task**      | Detect unknown and novel attack patterns                        |

### Supporting Artefacts

| File                        | Purpose                                           |
| --------------------------- | ------------------------------------------------- |
| `models/feature_cols.pkl`   | Exact 78 features expected at inference time      |
| `models/label_encoder.pkl`  | Maps model integers → human-readable attack names |
| `models/trained_models.pkl` | Combined bundle for single-load deployment        |
| `reports/shap_summary.png`  | Top feature drivers per detection decision        |

---

## 📊 Dataset

**CICIDS 2017 — Canadian Institute for Cybersecurity Intrusion Detection Evaluation Dataset**

Hosted on Kaggle: [shreyanshrathaur003/encrypted-traffic-detection-dataset](https://www.kaggle.com/datasets/shreyanshrathaur003/encrypted-traffic-detection-dataset)

```python
# Load instantly in Python — no manual download needed
import kagglehub
from kagglehub import KaggleDatasetAdapter

df = kagglehub.load_dataset(
    KaggleDatasetAdapter.PANDAS,
    "shreyanshrathaur003/encrypted-traffic-detection-dataset",
    ""
)
print("Records loaded:", df.shape)
```

| Day File                           | Attack Types                      |
| ---------------------------------- | --------------------------------- |
| `Monday-WorkingHours`              | Benign baseline only              |
| `Tuesday-WorkingHours`             | FTP-Patator · SSH-Patator         |
| `Wednesday-workingHours`           | DoS Slowloris · Heartbleed        |
| `Thursday-Morning-WebAttacks`      | XSS · SQL Injection · Brute Force |
| `Thursday-Afternoon-Infilteration` | Network Infiltration              |
| `Friday-Morning`                   | Botnet · Port Scan                |
| `Friday-Afternoon-DDos`            | Distributed Denial of Service     |
| `Friday-Afternoon-PortScan`        | Port Scanning                     |

| Stat                    | Value                                 |
| ----------------------- | ------------------------------------- |
| **Features per sample** | 78 flow-level statistical features    |
| **Master cleaned file** | `cicids2017_cleaned.csv`              |
| **Preprocessing**       | `src/features.py` + `train_models.py` |
| **Total size**          | ~700 MB — hosted on Kaggle            |

---

## ⚙️ Feature Engineering

`src/features.py` and `capture/flow_builder.py` transform raw packet streams into **78 numerical features** per flow:

| Category    | Features                                                       |
| ----------- | -------------------------------------------------------------- |
| **Timing**  | Flow Duration · Packet IAT Mean/Max/Min/Std · Active/Idle Time |
| **Volume**  | Fwd/Bwd Packet Length Mean · Max · Min · Std · Flow Bytes/s    |
| **Rate**    | Flow Packets/s · Fwd/Bwd Packets/s                             |
| **Flags**   | SYN · ACK · FIN · RST · URG · PSH counts                       |
| **Window**  | Init Window Bytes Fwd · Bwd                                    |
| **Headers** | Header lengths · Payload ratios                                |

> Feature columns are frozen in `models/feature_cols.pkl` — guaranteeing identical feature spaces between training and live inference.

---

## ✨ Key Capabilities

| Capability                  | Detail                                                                           |
| --------------------------- | -------------------------------------------------------------------------------- |
| 🔴 **Real-time Capture**    | Live interface sniffing via `packet_capture.py` — continuous, no batch windows   |
| 🔒 **Encryption-Safe**      | Analyses flow behaviour, never packet content — works on HTTPS/TLS natively      |
| 🤖 **Three-Model Ensemble** | RF + XGBoost (supervised) + Isolation Forest (unsupervised zero-day)             |
| 📡 **WebSocket Streaming**  | Alerts appear on dashboard the instant they are generated — zero polling         |
| 🧠 **Explainable AI**       | SHAP values via `api/explain.py` — every detection has a human-readable reason   |
| ⚠️ **Risk Scoring**         | `risk_engine.py` maps predictions to LOW · MEDIUM · HIGH · CRITICAL              |
| 🗂️ **REST API**             | `POST /predict` · `GET /explain` — programmatic access to all detection features |
| 📊 **Live Dashboard**       | React frontend with real-time charts, colour-coded alerts, SHAP display          |

---

## 🛠 Tech Stack

| Layer                 | Technology                   | Purpose                             |
| --------------------- | ---------------------------- | ----------------------------------- |
| **Language**          | Python 3.13                  | Core system language                |
| **ML — Supervised**   | scikit-learn · XGBoost       | Random Forest + XGBoost classifiers |
| **ML — Unsupervised** | scikit-learn IsolationForest | Zero-day anomaly detection          |
| **Explainability**    | SHAP                         | Feature-level model explanations    |
| **Packet Capture**    | Scapy · pyshark              | Live network interface sniffing     |
| **Backend API**       | FastAPI                      | REST endpoints + WebSocket server   |
| **Real-time Stream**  | WebSockets                   | Zero-latency alert delivery         |
| **Frontend**          | React · Chart.js             | Live monitoring dashboard           |
| **Python Dashboard**  | Plotly · Dash                | `dashboard.py` visual layer         |
| **Model Storage**     | joblib · pickle              | `.pkl` + `.joblib` serialisation    |
| **Dataset**           | CICIDS 2017                  | Benchmark cybersecurity dataset     |
| **Frontend Hosting**  | Vercel                       | `frontend/` deployment              |
| **Backend Hosting**   | Render                       | `main.py` FastAPI deployment        |
| **Dataset Hosting**   | Kaggle                       | 700MB+ dataset storage              |

---

## 🔄 How It Works — End to End

| Step  | Module                                                 | What Happens                                                          |
| :---: | ------------------------------------------------------ | --------------------------------------------------------------------- |
| **1** | `capture/packet_capture.py`                            | Listens on live network interface — intercepts every packet           |
| **2** | `capture/flow_builder.py` + `src/features.py`          | Groups packets into flows · Computes 78 statistical features          |
| **3** | `detection/model_loader.py` → `detection/predictor.py` | Loads all 3 models · Runs ensemble inference with confidence scores   |
| **4** | `detection/risk_engine.py`                             | Maps confidence → LOW / MEDIUM / HIGH / CRITICAL · Labels attack type |
| **5** | `services/detection_service.py`                        | Orchestrates steps 1–4 as a continuous background process             |
| **6** | `api/websocket.py` + `services/stream_service.py`      | Pushes each result to connected frontend clients instantly            |
| **7** | `frontend/` + `dashboard.py`                           | Renders live charts · Colour-coded alerts · SHAP explanations         |

---

## 🚀 Installation & Setup

### Prerequisites

| Tool                              | Purpose        |
| --------------------------------- | -------------- |
| Python 3.13+                      | Core runtime   |
| Node.js 18+                       | Frontend build |
| Npcap (Windows) / libpcap (Linux) | Packet capture |

### Clone

```bash
git clone https://github.com/Shreyansh2434/AI-Based-Encrypted-Traffic-Analysis-System.git
cd AI-Based-Encrypted-Traffic-Analysis-System
```

### Python Environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate

pip install -r requirements.txt
```

### Dataset

```bash
pip install kagglehub

python -c "
import kagglehub
from kagglehub import KaggleDatasetAdapter
df = kagglehub.load_dataset(
    KaggleDatasetAdapter.PANDAS,
    'shreyanshrathaur003/encrypted-traffic-detection-dataset', ''
)
print(df.shape)
"
```

### Train Models

```bash
python train_models.py
```

### Run Backend

```bash
python main.py
# FastAPI  → http://localhost:8000
# WebSocket → ws://localhost:8000/ws
```

### Run Frontend

```bash
cd frontend
npm install
npm start
# React dashboard → http://localhost:3000
```

---

## 👥 Team

| Member        | Role                                  | Files                                                                                                                                                                           |
| ------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Shreyansh** | Team Lead · ML Engineer               | `train_models.py` · `src/features.py` · `src/infer.py` · `src/explain.py` · `models/` · `reports/shap_summary.png`                                                              |
| **Pranay**    | IDS Engineer · Detection Pipeline     | `capture/packet_capture.py` · `capture/flow_builder.py` · `detection/model_loader.py` · `detection/predictor.py` · `detection/risk_engine.py` · `services/detection_service.py` |
| **Aakarshan** | Backend Engineer · System Integration | `api/predict.py` · `api/explain.py` · `api/websocket.py` · `services/stream_service.py` · `main.py`                                                                             |
| **Shreya**    | Frontend Engineer · UI/UX             | `frontend/` · `dashboard.py` · `dashboard.js`                                                                                                                                   |

---

## 📄 License

This project was developed as a final year major project for academic purposes at UPES.

---

<div align="center">

<br/>

**Built with 🔐 security · 🤖 intelligence · ☕ caffeine · 🎓 dedication**

_UPES · Final Year Major Project · 2025–2026_

<br/>

[![Live Demo](https://img.shields.io/badge/Try%20the%20Live%20Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://ai-based-encrypted-traffic-analysis-jade.vercel.app)

</div>
