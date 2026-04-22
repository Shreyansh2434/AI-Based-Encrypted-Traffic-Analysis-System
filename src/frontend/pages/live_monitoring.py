"""
Live Monitoring page for Cipher Traffic Analyzer
"""

import streamlit as st
import numpy as np
from typing import List, Dict
from ..utils import get_severity
from ..components import render_metrics, render_threat_list, render_risk_timeline, render_threat_distribution


def render_live_monitoring(threats: List[Dict]):
    """
    Render the Live Monitoring mode page

    Args:
        threats: List of current threat data
    """

    st.markdown("## Live Threat Monitoring")

    col_start, col_stop, col_count = st.columns(3)

    with col_start:
        if st.button("START CAPTURE", use_container_width=True):
            st.session_state.live_mode = True

    with col_stop:
        if st.button("STOP CAPTURE", use_container_width=True):
            st.session_state.live_mode = False

    with col_count:
        show_count = st.slider("Show Threats", 5, 50, 15, label_visibility="collapsed")

    # Calculate metrics
    total = len(threats)
    critical = sum(1 for t in threats if t["risk_score"] >= 80)
    high = sum(1 for t in threats if 60 <= t["risk_score"] < 80)
    avg_risk = int(np.mean([t["risk_score"] for t in threats])) if threats else 0
    unique_ips = len(set(t["source_ip"] for t in threats))
    total_mb = int(sum(t["bytes"] for t in threats) / 1_000_000) if threats else 0

    # Render metrics
    metrics = {
        "Total Threats": f"{total:,}",
        "Critical": str(critical),
        "High Risk": str(high),
        "Avg Risk": str(avg_risk),
        "Unique IPs": str(unique_ips),
        "Data Volume": f"{total_mb} MB"
    }
    render_metrics(metrics, num_cols=6)

    st.markdown("")

    # Status alert
    if critical > 0:
        st.error(f"ALERT: {critical} critical threats detected")
    else:
        st.success(f"Network secure. Risk level: {100 - avg_risk}%")

    st.markdown("")

    # Charts
    col_chart1, col_chart2 = st.columns(2)

    with col_chart1:
        risks = [t["risk_score"] for t in threats[-100:]] if threats else [0]
        render_risk_timeline(risks)

    with col_chart2:
        threat_dist = {}
        for t in threats:
            threat_dist[t["threat_type"]] = threat_dist.get(t["threat_type"], 0) + 1
        if threat_dist:
            render_threat_distribution(threat_dist)

    st.markdown("")

    # Threat list
    render_threat_list(threats, show_count)
