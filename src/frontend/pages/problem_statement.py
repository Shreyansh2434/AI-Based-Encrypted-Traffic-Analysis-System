"""
Problem Statement page for Cipher Traffic Analyzer
"""

import streamlit as st


def render_problem_statement():
    """Render the Problem Statement mode page"""

    st.markdown("## The Challenge")

    col1, col2 = st.columns(2)

    with col1:
        st.markdown("<div class=\"glass-card\">", unsafe_allow_html=True)
        st.markdown("**The Problem:** Modern attacks hide in encrypted HTTPS traffic")
        st.markdown("""
        - Packet inspection is ineffective
        - Decryption is expensive & invasive
        - Privacy & regulatory concerns
        - Attackers exploit this blind spot
        """)
        st.markdown("</div>", unsafe_allow_html=True)

    with col2:
        st.markdown("<div class=\"glass-card\">", unsafe_allow_html=True)
        st.markdown("**The Solution:** ML-based detection on network metadata")
        st.markdown("""
        - Analyze packet patterns & timing
        - No decryption required
        - Detects known & zero-day threats
        - Used by Darktrace & Cisco
        """)
        st.markdown("</div>", unsafe_allow_html=True)

    st.markdown("---")

    st.markdown("## System Architecture")

    col1, col2, col3, col4 = st.columns(4)

    with col1:
        st.markdown("<div class=\"glass-card\">", unsafe_allow_html=True)
        st.markdown("**Frontend**\n\nStreamlit UI\nReal-time dashboard\nThreat visualization")
        st.markdown("</div>", unsafe_allow_html=True)

    with col2:
        st.markdown("<div class=\"glass-card\">", unsafe_allow_html=True)
        st.markdown("**API Layer**\n\nFastAPI\nREST + WebSocket\nBatch & streaming")
        st.markdown("</div>", unsafe_allow_html=True)

    with col3:
        st.markdown("<div class=\"glass-card\">", unsafe_allow_html=True)
        st.markdown("**ML Engine**\n\nRandom Forest\nAnomaly detection\nRisk scoring")
        st.markdown("</div>", unsafe_allow_html=True)

    with col4:
        st.markdown("<div class=\"glass-card\">", unsafe_allow_html=True)
        st.markdown("**Capture Layer**\n\nScapy sniffer\nFlow extraction\nFeature engineering")
        st.markdown("</div>", unsafe_allow_html=True)

    st.markdown("---")

    st.markdown("## Why This Works")

    col1, col2 = st.columns(2)

    with col1:
        st.markdown("""
        **Technical Advantages**
        - Handles encrypted HTTPS
        - Detects zero-days (anomaly detection)
        - 2ms inference latency
        - 95%+ accuracy
        """)

    with col2:
        st.markdown("""
        **Business Advantages**
        - No licensing costs
        - Privacy respecting
        - GDPR/PCI compliant
        - Enterprise deployable
        """)
