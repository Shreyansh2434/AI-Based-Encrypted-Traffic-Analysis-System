"""
Premium Glass Design CSS for Cipher Traffic Analyzer
"""

import streamlit as st

PREMIUM_CSS = """
<style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');

    * {
        font-family: 'Space Mono', monospace;
    }

    /* OVERALL THEME */
    .stApp {
        background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1428 100%);
    }

    body {
        background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1428 100%);
    }

    /* NAVBAR STYLE */
    .navbar-premium {
        background: linear-gradient(90deg, rgba(15, 23, 42, 0.95), rgba(12, 17, 35, 0.85));
        backdrop-filter: blur(20px);
        border-bottom: 1px solid rgba(59, 130, 246, 0.2);
        padding: 16px 32px;
        border-radius: 0 0 16px 16px;
        margin-bottom: 32px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    .navbar-title {
        font-size: 28px;
        font-weight: 900;
        background: linear-gradient(90deg, #3b82f6, #8b5cf6);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0;
        letter-spacing: -1px;
    }

    .navbar-subtitle {
        font-size: 12px;
        color: rgba(148, 163, 184, 0.7);
        letter-spacing: 2px;
        text-transform: uppercase;
        margin: 4px 0 0 0;
    }

    /* SIDEBAR GLASS EFFECT */
    [data-testid="stSidebar"] {
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(12, 17, 35, 0.92)) !important;
        backdrop-filter: blur(25px) !important;
        border-right: 1px solid rgba(59, 130, 246, 0.15) !important;
        box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.05) !important;
    }

    [data-testid="stSidebar"] > div:first-child {
        padding-top: 20px !important;
    }

    /* SIDEBAR HEADINGS */
    [data-testid="stSidebar"] h2 {
        color: #60a5fa !important;
        font-size: 14px !important;
        font-weight: 800 !important;
        text-transform: uppercase !important;
        letter-spacing: 2px !important;
        margin-top: 32px !important;
        margin-bottom: 16px !important;
    }

    /* RADIO BUTTONS */
    [data-testid="stSidebar"] .stRadio {
        margin-bottom: 20px;
    }

    [data-testid="stSidebar"] .stRadio > div {
        gap: 12px;
    }

    [data-testid="stSidebar"] .stRadio label {
        padding: 12px 16px;
        border-radius: 8px;
        background: rgba(30, 41, 59, 0.5);
        border: 1px solid rgba(59, 130, 246, 0.15);
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 13px;
        font-weight: 600;
        color: rgba(203, 213, 225, 0.8);
    }

    [data-testid="stSidebar"] .stRadio label:hover {
        background: rgba(30, 41, 59, 0.8);
        border-color: rgba(59, 130, 246, 0.3);
        color: #cbd5e1;
    }

    [data-testid="stSidebar"] .stRadio label[aria-checked="true"] {
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.1));
        border-color: rgba(59, 130, 246, 0.4);
        color: #3b82f6;
        font-weight: 700;
    }

    /* MAIN CONTENT */
    h1 {
        color: #3b82f6 !important;
        font-weight: 900 !important;
        font-size: 40px !important;
        margin-bottom: 8px !important;
    }

    h2 {
        color: #60a5fa !important;
        font-weight: 800 !important;
        font-size: 24px !important;
        margin-top: 28px !important;
        margin-bottom: 16px !important;
    }

    h3 {
        color: #cbd5e1 !important;
        font-weight: 700 !important;
    }

    /* CARDS & CONTAINERS */
    .glass-card {
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(20, 30, 50, 0.6));
        backdrop-filter: blur(20px);
        border: 1px solid rgba(59, 130, 246, 0.15);
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        margin-bottom: 20px;
    }

    .stMetric {
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(20, 30, 50, 0.4)) !important;
        border: 1px solid rgba(59, 130, 246, 0.15) !important;
        border-radius: 10px !important;
        padding: 20px !important;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1) !important;
    }

    .stMetricDelta {
        color: #3b82f6 !important;
    }

    /* BUTTONS */
    .stButton > button {
        background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
        border: 1px solid rgba(59, 130, 246, 0.3) !important;
        border-radius: 8px !important;
        color: white !important;
        font-weight: 700 !important;
        font-size: 13px !important;
        letter-spacing: 0.5px !important;
        padding: 12px 24px !important;
        transition: all 0.3s ease !important;
        text-transform: uppercase !important;
    }

    .stButton > button:hover {
        background: linear-gradient(135deg, #2563eb, #1d4ed8) !important;
        box-shadow: 0 8px 24px rgba(59, 130, 246, 0.35) !important;
        border-color: rgba(59, 130, 246, 0.5) !important;
    }

    /* SLIDERS */
    .stSlider > div > div > div > input {
        background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    }

    /* FILE UPLOADER */
    .stFileUploader {
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(20, 30, 50, 0.4));
        border: 2px dashed rgba(59, 130, 246, 0.3);
        border-radius: 8px;
        padding: 20px;
    }

    /* ALERTS */
    .stSuccess, .stError, .stWarning, .stInfo {
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(20, 30, 50, 0.6));
        border-left: 4px solid transparent;
        border-radius: 8px;
    }

    .stSuccess {
        border-left-color: #22c55e !important;
    }

    .stError {
        border-left-color: #ef4444 !important;
    }

    /* DATAFRAME */
    [data-testid="stDataFrame"] {
        background: transparent !important;
    }

    /* DIVIDER */
    hr {
        border: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.2), transparent);
        margin: 32px 0;
    }

    /* TABS */
    .stTabs [data-baseweb="tab-list"] {
        gap: 8px;
        border-bottom: 1px solid rgba(59, 130, 246, 0.1);
    }

    .stTabs [data-baseweb="tab"] {
        background: transparent;
        border: 1px solid rgba(59, 130, 246, 0.15);
        border-radius: 8px;
        padding: 12px 20px;
        color: rgba(203, 213, 225, 0.7);
        font-weight: 600;
    }

    .stTabs [aria-selected="true"] {
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.1));
        border-color: rgba(59, 130, 246, 0.4);
        color: #3b82f6;
    }

    /* THREAT CARDS */
    .threat-item {
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.5), rgba(20, 30, 50, 0.3));
        border-left: 4px solid;
        border-radius: 6px;
        padding: 12px;
        margin: 8px 0;
        font-size: 12px;
    }

    .threat-critical { border-left-color: #dc2626; }
    .threat-high { border-left-color: #ef4444; }
    .threat-medium { border-left-color: #f97316; }
    .threat-low { border-left-color: #22c55e; }

    /* TEXT */
    p {
        color: rgba(203, 213, 225, 0.9);
        line-height: 1.6;
    }
</style>
"""


def apply_premium_css():
    """Apply premium glass design CSS to Streamlit app"""
    st.markdown(PREMIUM_CSS, unsafe_allow_html=True)
