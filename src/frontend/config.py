"""
Page configuration for Streamlit dashboard
"""

import streamlit as st


def setup_page_config():
    """Initialize Streamlit page configuration"""
    st.set_page_config(
        page_title="Cipher Traffic Analyzer",
        layout="wide",
        initial_sidebar_state="expanded",
    )
