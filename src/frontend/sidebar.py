"""
Sidebar navigation component for Cipher Traffic Analyzer dashboard
"""

import streamlit as st


def render_sidebar(title: str = "NAVIGATION",
                  options: list = None) -> str:
    """
    Render the sidebar navigation

    Args:
        title: Sidebar section title
        options: List of navigation options

    Returns:
        Selected mode/page
    """
    if options is None:
        options = [
            "Problem Statement",
            "Live Monitoring",
            "Batch Analysis",
            "Model Details",
            "Performance Testing"
        ]

    with st.sidebar:
        st.markdown(f"## {title}")

        selected_mode = st.radio(
            "Select Mode",
            options,
            label_visibility="collapsed"
        )

        return selected_mode
