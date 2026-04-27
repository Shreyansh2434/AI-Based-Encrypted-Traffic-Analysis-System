"""
Navbar component for Cipher Traffic Analyzer dashboard
"""

import streamlit as st


def render_navbar(title: str = "CIPHER TRAFFIC ANALYZER",
                 subtitle: str = "Encrypted Network Threat Detection • Real-Time Analysis"):
    """
    Render the premium navbar component

    Args:
        title: Main navbar title
        subtitle: Subtitle/description text
    """
    st.markdown(f"""
<div class="navbar-premium">
    <h1 class="navbar-title">{title}</h1>
    <p class="navbar-subtitle">{subtitle}</p>
</div>
""", unsafe_allow_html=True)
