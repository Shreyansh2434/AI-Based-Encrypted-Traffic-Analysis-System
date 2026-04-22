<div align="center">

<br/>

```
██████████████████████████████████████████████████████████████████
█                                                                █
█        ██████╗ ██████╗ ██╗   ██╗██████╗ ████████╗            █
█       ██╔════╝██╔══██╗╚██╗ ██╔╝██╔══██╗╚══██╔══╝            █
█       ██║     ██████╔╝ ╚████╔╝ ██████╔╝   ██║                █
█       ██║     ██╔══██╗  ╚██╔╝  ██╔═══╝    ██║                █
█       ╚██████╗██║  ██║   ██║   ██║        ██║                █
█        ╚═════╝╚═╝  ╚═╝   ╚═╝   ╚═╝        ╚═╝                █
█                                                                █
█           AI-BASED ENCRYPTED TRAFFIC ANALYSIS SYSTEM          █
█                                                                █
██████████████████████████████████████████████████████████████████
```

<br/>

### ◈ &nbsp; *Detecting cyber threats hidden inside encrypted traffic — without ever breaking the encryption* &nbsp; ◈

<br/>

[![Live Demo](https://img.shields.io/badge/◈%20LIVE%20DEMO-VERCEL-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://ai-based-encrypted-traffic-analysis-system-8z0vsgldo.vercel.app)
&nbsp;
[![Backend API](https://img.shields.io/badge/◈%20BACKEND%20API-RENDER-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://encrypted-traffic-backend.onrender.com)
&nbsp;
[![GitHub](https://img.shields.io/badge/◈%20SOURCE%20CODE-GITHUB-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Shreyansh2434/AI-Based-Encrypted-Traffic-Analysis-System)
&nbsp;
[![Kaggle](https://img.shields.io/badge/◈%20DATASET-KAGGLE-20BEFF?style=for-the-badge&logo=kaggle&logoColor=white)](https://www.kaggle.com/datasets/shreyanshrathaur003/encrypted-traffic-detection-dataset)

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

<br/>

---

</div>

<br/>

## ◈ &nbsp; Table of Contents

| # | Section |
|---|---------|
| 01 | [The Problem We Solved](#-the-problem-we-solved) |
| 02 | [System at a Glance](#-system-at-a-glance) |
| 03 | [Live Deployment](#-live-deployment) |
| 04 | [System Architecture](#-system-architecture) |
| 05 | [Project Structure](#-project-structure) |
| 06 | [Machine Learning Engine](#-machine-learning-engine) |
| 07 | [Dataset](#-dataset) |
| 08 | [Feature Engineering](#-feature-engineering) |
| 09 | [Key Capabilities](#-key-capabilities) |
| 10 | [Tech Stack](#-tech-stack) |
| 11 | [How It Works — End to End](#-how-it-works--end-to-end) |
| 12 | [Installation & Setup](#-installation--setup) |
| 13 | [Team](#-team) |

<br/>

---

<br/>

## ◈ &nbsp; The Problem We Solved

<br/>

> *"Over **95% of all internet traffic today is encrypted**. Traditional Intrusion Detection Systems read packet content to find threats — but encryption makes that content invisible. Attackers know this. They hide inside HTTPS and TLS tunnels precisely because security tools go blind."*

<br/>

Our system takes a fundamentally different approach:

```
  ┌─────────────────────────────────────────────────────────────────┐
  │                                                                 │
  │   TRADITIONAL IDS          THIS SYSTEM                        │
  │   ──────────────           ───────────                         │
  │                                                                 │
  │   Reads packet content  →  Reads traffic BEHAVIOUR             │
  │   Breaks with TLS/HTTPS →  Works WITH encryption               │
  │   Static rule-based     →  ML-adaptive, self-learning          │
  │   Offline batch only    →  Real-time, sub-second               │
  │   Black box decisions   →  SHAP-powered explainability         │
  │   Misses zero-days      →  Isolation Forest for unknowns       │
  │                                                                 │
  └─────────────────────────────────────────────────────────────────┘
```

Instead of reading *what* is being sent, we analyse *how* it is being sent — flow duration, packet rates, byte distributions, flag patterns. These behavioural fingerprints expose threats even when content is fully encrypted.

<br/>

---

<br/>

## ◈ &nbsp; System at a Glance

<br/>

| Attribute | Detail |
|-----------|--------|
| **Project Type** | Real-time AI-powered Network Intrusion Detection System |
| **Detection Method** | Flow-level behavioural analysis (encryption-safe) |
| **ML Models** | Random Forest · XGBoost · Isolation Forest (ensemble) |
| **Feature Space** | 78 statistical flow-level features per traffic sample |
| **Dataset** | CICIDS 2017 — 8 attack types across 5 days of real traffic |
| **Attack Types** | DDoS · Port Scan · Brute Force · SQL Injection · XSS · Botnet · Heartbleed · Infiltration |
| **Streaming** | WebSocket — zero-polling, sub-second alert delivery |
| **Explainability** | SHAP values — human-readable reason for every detection |
| **Frontend** | Vercel → `https://ai-based-encrypted-traffic-analysis-system-8z0vsgldo.vercel.app` |
| **Backend** | Render → `https://encrypted-traffic-backend.onrender.com` |

<br/>

---

<br/>

## ◈ &nbsp; Live Deployment

<br/>

```
  ╔══════════════════════════════════════════════════════════════════╗
  ║                                                                  ║
  ║   🌐  FRONTEND  (React Live Dashboard)                          ║
  ║   https://ai-based-encrypted-traffic-analysis-                  ║
  ║   system-8z0vsgldo.vercel.app                                   ║
  ║                                                                  ║
  ║   ⚡  BACKEND  (FastAPI + WebSocket)                            ║
  ║   https://encrypted-traffic-backend.onrender.com                ║
  ║                                                                  ║
  ║   📦  SOURCE CODE                                               ║
  ║   https://github.com/Shreyansh2434/                             ║
  ║   AI-Based-Encrypted-Traffic-Analysis-System                    ║
  ║                                                                  ║
  ║   📊  DATASET  (Kaggle)                                         ║
  ║   https://www.kaggle.com/datasets/shreyanshrathaur003/          ║
  ║   encrypted-traffic-detection-dataset                           ║
  ║                                                                  ║
  ╚══════════════════════════════════════════════════════════════════╝
```

> ⚠️ **Note:** The Render free tier spins down after inactivity. The first request may take 30–50 seconds to wake the backend. Subsequent requests are instant.

<br/>

---

<br/>

## ◈ &nbsp; System Architecture

<br/>

```
  ╔══════════════════════════════════════════════════════════════════╗
  ║                   LIVE NETWORK INTERFACE                        ║
  ║              (Real packets · Real threats · Real time)          ║
  ╚══════════════════════════╦═══════════════════════════════════════╝
                             ║
                             ▼
  ╔══════════════════════════════════════════════════════════════════╗
  ║              LAYER 1 — CAPTURE  (capture/)                      ║
  ║                                                                  ║
  ║   packet_capture.py  ──────────►  flow_builder.py               ║
  ║   Live packet sniffing            78-feature vector per flow     ║
  ║   (Scapy / pyshark)               Duration · Rate · Flags ···   ║
  ╚══════════════════════════╦═══════════════════════════════════════╝
                             ║  feature vector [78 floats]
                             ▼
  ╔══════════════════════════════════════════════════════════════════╗
  ║              LAYER 2 — DETECTION  (detection/)                  ║
  ║                                                                  ║
  ║   model_loader.py  ──►  predictor.py  ──►  risk_engine.py       ║
  ║   Load RF/XGB/IF        Run ensemble       Score: LOW →          ║
  ║   from models/          inference          CRITICAL              ║
  ╚══════════════════════════╦═══════════════════════════════════════╝
                             ║  { label, confidence, risk_score }
                             ▼
  ╔══════════════════════════════════════════════════════════════════╗
  ║              LAYER 3 — SERVICES  (services/)                    ║
  ║                                                                  ║
  ║   detection_service.py  ──────►  stream_service.py              ║
  ║   Orchestrate full pipeline      Broadcast via WebSocket         ║
  ╚════════════╦═══════════════════════════════╦═════════════════════╝
               ║                               ║
               ▼                               ▼
  ╔════════════════════════╗      ╔═════════════════════════════════╗
  ║   LAYER 4a — API       ║      ║   LAYER 4b — FRONTEND           ║
  ║   (api/)               ║      ║   (frontend/ + dashboard.py)    ║
  ║                        ║      ║                                 ║
  ║   predict.py           ║      ║   React Dashboard               ║
  ║   POST /predict        ║      ║   Live charts · Alert feed      ║
  ║                        ║      ║   Risk indicators · SHAP UI     ║
  ║   explain.py           ║      ║                                 ║
  ║   GET /explain         ║      ║   Hosted → Vercel               ║
  ║                        ║      ╚═════════════════════════════════╝
  ║   websocket.py         ║
  ║   ws://backend/ws      ║      Hosted → Render
  ╚════════════════════════╝
```

<br/>

---

<br/>

## ◈ &nbsp; Project Structure

<br/>

```
encrypted-traffic-ai/
│
├── ◈ api/                              REST API + WebSocket layer
│   ├── predict.py                      POST /predict — ML inference endpoint
│   ├── explain.py                      GET /explain — SHAP explanation endpoint
│   └── websocket.py                    ws://.../ws — live streaming handler
│
├── ◈ capture/                          Network packet capture layer
│   ├── packet_capture.py               Live interface sniffing (Scapy/pyshark)
│   └── flow_builder.py                 Packet → 78-feature flow vector
│
├── ◈ data/                             Training datasets (hosted on Kaggle)
│   ├── cicids2017_cleaned.csv          Master cleaned dataset
│   ├── flows.csv / flows_cleaned.csv   Extracted & cleaned flow records
│   ├── merged.csv / test.csv           Combined & held-out splits
│   └── [Day-*.pcap_ISCX.csv ×8]       Original CICIDS 2017 daily files
│
├── ◈ detection/                        Core ML detection engine
│   ├── model_loader.py                 Load serialised models into memory
│   ├── predictor.py                    Run ensemble inference
│   └── risk_engine.py                  Map confidence → risk level
│
├── ◈ frontend/                         React live monitoring dashboard
│   └── [components · charts · alerts]  Deployed → Vercel
│
├── ◈ logs/                             Runtime and detection logs
│
├── ◈ models/                           Serialised trained model artefacts
│   ├── random_forest.pkl               Supervised RF classifier
│   ├── xgboost.pkl                     XGBoost classifier
│   ├── isolation_forest.pkl            Unsupervised anomaly detector
│   ├── anomaly_iforest.joblib          Isolation Forest (joblib format)
│   ├── supervised_rf.joblib            Random Forest (joblib format)
│   ├── trained_models.pkl              Combined ensemble bundle
│   ├── label_encoder.pkl               Integer → attack class name
│   └── feature_cols.pkl                78 feature column definitions
│
├── ◈ reports/
│   └── shap_summary.png                SHAP feature importance plot
│
├── ◈ services/                         Background orchestration
│   ├── detection_service.py            Full pipeline runner
│   └── stream_service.py               WebSocket broadcast handler
│
├── ◈ src/                              Core ML utility library
│   ├── features.py                     Feature engineering & selection
│   ├── infer.py                        Inference helper utilities
│   ├── explain.py                      SHAP computation utilities
│   └── live_capture.py                 Live capture integration bridge
│
├── dashboard.py                        Plotly/Dash Python dashboard
├── dashboard.js                        JS dashboard entry point
├── main.py                             ◈ APPLICATION ENTRY POINT
├── train_models.py                     Offline model training script
└── requirements.txt                    Python dependencies
```

<br/>

---

<br/>

## ◈ &nbsp; Machine Learning Engine

<br/>

The system deploys a **three-model ensemble** — each model contributes a different detection capability:

<br/>

```
  ┌─────────────────────────────────────────────────────────────────┐
  │   MODEL 1 — RANDOM FOREST                                      │
  │   ─────────────────────────────────────────────────────────    │
  │   Files:     models/random_forest.pkl                          │
  │              models/supervised_rf.joblib                       │
  │   Type:      Supervised ensemble classifier                    │
  │   Mechanism: 100+ decision trees voting on each sample         │
  │   Strength:  High accuracy · Noise-tolerant · Feature-ranked   │
  │   Task:      Multi-class attack type classification            │
  ├─────────────────────────────────────────────────────────────────┤
  │   MODEL 2 — XGBOOST                                            │
  │   ─────────────────────────────────────────────────────────    │
  │   File:      models/xgboost.pkl                                │
  │   Type:      Supervised gradient boosting                      │
  │   Mechanism: Sequential learners — each corrects prior errors  │
  │   Strength:  Handles class imbalance · Fast inference          │
  │   Task:      Encrypted traffic threat classification           │
  ├─────────────────────────────────────────────────────────────────┤
  │   MODEL 3 — ISOLATION FOREST                                   │
  │   ─────────────────────────────────────────────────────────    │
  │   Files:     models/isolation_forest.pkl                       │
  │              models/anomaly_iforest.joblib                     │
  │   Type:      Unsupervised anomaly detection                    │
  │   Mechanism: Isolates anomalies via random partitioning        │
  │   Strength:  No labelled data needed · Catches zero-days       │
  │   Task:      Detect unknown / novel attack patterns            │
  └─────────────────────────────────────────────────────────────────┘
```

<br/>

| Artefact | Purpose |
|----------|---------|
| `models/feature_cols.pkl` | Exact 78 features expected at inference time |
| `models/label_encoder.pkl` | Maps model integers → human-readable attack names |
| `models/trained_models.pkl` | Combined bundle for single-load deployment |
| `reports/shap_summary.png` | Top feature drivers of every detection decision |

<br/>

---

<br/>

## ◈ &nbsp; Dataset

<br/>

**CICIDS 2017 — Canadian Institute for Cybersecurity Intrusion Detection Evaluation Dataset**

Hosted on Kaggle: [shreyanshrathaur003/encrypted-traffic-detection-dataset](https://www.kaggle.com/datasets/shreyanshrathaur003/encrypted-traffic-detection-dataset)

<br/>

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

<br/>

| Day File | Attack Types |
|----------|-------------|
| `Monday-WorkingHours` | Benign baseline only |
| `Tuesday-WorkingHours` | FTP-Patator · SSH-Patator |
| `Wednesday-workingHours` | DoS Slowloris · Heartbleed |
| `Thursday-Morning-WebAttacks` | XSS · SQL Injection · Brute Force |
| `Thursday-Afternoon-Infilteration` | Network Infiltration |
| `Friday-Morning` | Botnet · Port Scan |
| `Friday-Afternoon-DDos` | Distributed Denial of Service |
| `Friday-Afternoon-PortScan` | Port Scanning |

<br/>

| Stat | Value |
|------|-------|
| Features per sample | 78 flow-level statistical features |
| Master cleaned file | `cicids2017_cleaned.csv` |
| Preprocessing | `src/features.py` + `train_models.py` |
| Size | ~700 MB — hosted on Kaggle |

<br/>

---

<br/>

## ◈ &nbsp; Feature Engineering

<br/>

`src/features.py` and `capture/flow_builder.py` transform raw packet streams into **78 numerical features** per flow:

```
  PACKET STREAM  →  FLOW FEATURES (78 dimensions)
  ─────────────     ──────────────────────────────────────────────
  Raw bytes         Flow Duration
  TCP flags         Fwd/Bwd Packet Length (Mean · Max · Min · Std)
  IP headers        Packet IAT (Inter-Arrival Time) statistics
  Port numbers      Active / Idle time ratios
  Timestamps        SYN · ACK · FIN · RST · URG flag counts
  Seq numbers       Flow Bytes/s · Flow Packets/s
                    Init Window Bytes (Fwd · Bwd)
                    Header lengths · Payload ratios · and more
```

Feature columns are frozen in `models/feature_cols.pkl` — guaranteeing identical feature spaces between training and live inference.

<br/>

---

<br/>

## ◈ &nbsp; Key Capabilities

<br/>

```
  ◈  REAL-TIME PACKET CAPTURE
     Live interface sniffing via capture/packet_capture.py
     Continuous — no batch windows, no delays

  ◈  ENCRYPTION-SAFE DETECTION
     Analyses flow behaviour, never packet content
     Works on HTTPS · TLS · QUIC traffic natively

  ◈  THREE-MODEL ENSEMBLE
     Random Forest + XGBoost (supervised) +
     Isolation Forest (unsupervised zero-day detection)

  ◈  WEBSOCKET STREAMING
     api/websocket.py → stream_service.py
     Alerts appear on dashboard the instant they are generated
     No polling · No refresh · Zero latency pipeline

  ◈  EXPLAINABLE AI (XAI)
     SHAP values via api/explain.py + src/explain.py
     Every detection comes with a human-readable reason

  ◈  RISK SCORING ENGINE
     detection/risk_engine.py maps confidence scores to
     LOW · MEDIUM · HIGH · CRITICAL risk levels

  ◈  REST API
     POST /predict  — single sample inference
     GET  /explain  — SHAP-based decision explanation

  ◈  LIVE REACT DASHBOARD
     Real-time charts · Colour-coded alert feed
     Risk indicators · SHAP summary display
     Deployed → Vercel
```

<br/>

---

<br/>

## ◈ &nbsp; Tech Stack

<br/>

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Language** | Python 3.13 | Core system language |
| **ML — Supervised** | scikit-learn, XGBoost | Random Forest + XGBoost classifiers |
| **ML — Unsupervised** | scikit-learn IsolationForest | Zero-day anomaly detection |
| **Explainability** | SHAP | Feature-level model explanations |
| **Packet Capture** | Scapy / pyshark | Live network interface sniffing |
| **Backend API** | FastAPI | REST endpoints + WebSocket server |
| **Real-time Stream** | WebSockets | Zero-latency alert delivery |
| **Frontend** | React, Chart.js | Live monitoring dashboard |
| **Python Dashboard** | Plotly, Dash | `dashboard.py` visual layer |
| **Model Serialisation** | joblib, pickle | `.pkl` + `.joblib` model storage |
| **Dataset** | CICIDS 2017 | Benchmark cybersecurity dataset |
| **Frontend Hosting** | Vercel | `frontend/` deployment |
| **Backend Hosting** | Render | `main.py` FastAPI deployment |
| **Dataset Hosting** | Kaggle | 700MB+ dataset storage |

<br/>

---

<br/>

## ◈ &nbsp; How It Works — End to End

<br/>

```
  ══════════════════════════════════════════════════════════════════
   STEP 1  ◈  CAPTURE
  ══════════════════════════════════════════════════════════════════
   capture/packet_capture.py
   └── Listens on live network interface
   └── Intercepts every packet entering/leaving the system

  ══════════════════════════════════════════════════════════════════
   STEP 2  ◈  FEATURE EXTRACTION
  ══════════════════════════════════════════════════════════════════
   capture/flow_builder.py  +  src/features.py
   └── Groups packets into bidirectional flows
   └── Computes 78 statistical features per flow
   └── Validates against feature_cols.pkl schema

  ══════════════════════════════════════════════════════════════════
   STEP 3  ◈  MODEL INFERENCE
  ══════════════════════════════════════════════════════════════════
   detection/model_loader.py  →  detection/predictor.py
   └── Loads RF + XGBoost + Isolation Forest from models/
   └── Runs feature vector through all three models
   └── Aggregates predictions with confidence scores

  ══════════════════════════════════════════════════════════════════
   STEP 4  ◈  RISK SCORING
  ══════════════════════════════════════════════════════════════════
   detection/risk_engine.py
   └── Maps confidence → LOW / MEDIUM / HIGH / CRITICAL
   └── Labels attack type (DDoS · PortScan · XSS · etc.)

  ══════════════════════════════════════════════════════════════════
   STEP 5  ◈  PIPELINE ORCHESTRATION
  ══════════════════════════════════════════════════════════════════
   services/detection_service.py
   └── Manages steps 1–4 as a continuous background process

  ══════════════════════════════════════════════════════════════════
   STEP 6  ◈  STREAMING
  ══════════════════════════════════════════════════════════════════
   api/websocket.py  +  services/stream_service.py
   └── Pushes each result to all connected WebSocket clients
   └── Frontend receives alert with zero polling delay

  ══════════════════════════════════════════════════════════════════
   STEP 7  ◈  DISPLAY
  ══════════════════════════════════════════════════════════════════
   frontend/  (React)  +  dashboard.py  (Plotly/Dash)
   └── Renders live traffic charts
   └── Displays colour-coded alert feed
   └── Shows SHAP explanation per detection
   └── Updates in real time — no refresh needed
```

<br/>

---

<br/>

## ◈ &nbsp; Installation & Setup

<br/>

### Prerequisites

```
  Python 3.13+      →  Core runtime
  Node.js 18+       →  Frontend build
  Npcap / libpcap   →  Packet capture (Windows: Npcap · Linux: libpcap)
```

### 1 — Clone

```bash
git clone https://github.com/Shreyansh2434/AI-Based-Encrypted-Traffic-Analysis-System.git
cd AI-Based-Encrypted-Traffic-Analysis-System
```

### 2 — Python environment

```bash
python -m venv venv
# Windows:  venv\Scripts\activate
# Linux:    source venv/bin/activate

pip install -r requirements.txt
```

### 3 — Dataset

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

### 4 — Train models

```bash
python train_models.py
# Outputs: models/random_forest.pkl · xgboost.pkl
#          isolation_forest.pkl · label_encoder.pkl · feature_cols.pkl
```

### 5 — Run backend

```bash
python main.py
# FastAPI → http://localhost:8000
# WebSocket → ws://localhost:8000/ws
```

### 6 — Run frontend

```bash
cd frontend
npm install
npm start
# React dashboard → http://localhost:3000
```

<br/>

---

<br/>

## ◈ &nbsp; Team

<br/>

```
  ╔══════════════════════════════════════════════════════════════════╗
  ║                                                                  ║
  ║   SHREYANSH  ◈  Team Lead · ML Engineer                        ║
  ║   ────────────────────────────────────────────────────────────  ║
  ║   train_models.py · src/features.py · src/infer.py             ║
  ║   src/explain.py · models/ · reports/shap_summary.png          ║
  ║   CICIDS 2017 preprocessing · RF + XGBoost + IForest training  ║
  ║   SHAP explainability · Model evaluation & serialisation        ║
  ║                                                                  ║
  ╠══════════════════════════════════════════════════════════════════╣
  ║                                                                  ║
  ║   PRANAY  ◈  IDS Engineer · Detection Pipeline                 ║
  ║   ────────────────────────────────────────────────────────────  ║
  ║   capture/packet_capture.py · capture/flow_builder.py          ║
  ║   detection/model_loader.py · detection/predictor.py           ║
  ║   detection/risk_engine.py · services/detection_service.py     ║
  ║   Live packet sniffing · Feature extraction · Risk scoring      ║
  ║                                                                  ║
  ╠══════════════════════════════════════════════════════════════════╣
  ║                                                                  ║
  ║   AAKARSHAN  ◈  Backend Engineer · System Integration          ║
  ║   ────────────────────────────────────────────────────────────  ║
  ║   api/predict.py · api/explain.py · api/websocket.py           ║
  ║   services/stream_service.py · main.py                         ║
  ║   FastAPI REST endpoints · WebSocket live streaming            ║
  ║   System orchestration · Render deployment                     ║
  ║                                                                  ║
  ╠══════════════════════════════════════════════════════════════════╣
  ║                                                                  ║
  ║   SHREYA  ◈  Frontend Engineer · UI/UX                         ║
  ║   ────────────────────────────────────────────────────────────  ║
  ║   frontend/ · dashboard.py · dashboard.js                      ║
  ║   React live dashboard · Plotly/Dash visualisation             ║
  ║   Real-time alert feed · SHAP display · Vercel deployment       ║
  ║                                                                  ║
  ╚══════════════════════════════════════════════════════════════════╝
```

<br/>

---

<br/>

## ◈ &nbsp; License

This project was developed as a final year major project for academic purposes at UPES.

<br/>

---

<br/>

<div align="center">

```
  ◈ ──────────────────────────────────────────────────────── ◈
  │                                                          │
  │      Built with  🔐 security  ·  🤖 intelligence        │
  │                  ☕ caffeine  ·  🎓 dedication            │
  │                                                          │
  │           UPES  ·  Final Year Major Project              │
  │                      2025 – 2026                         │
  │                                                          │
  ◈ ──────────────────────────────────────────────────────── ◈
```

[![Live Demo](https://img.shields.io/badge/◈%20Try%20the%20Live%20Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://ai-based-encrypted-traffic-analysis-system-8z0vsgldo.vercel.app)

</div>
