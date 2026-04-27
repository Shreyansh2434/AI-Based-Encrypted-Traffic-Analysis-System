"""
Reusable UI components for dashboard
"""

import streamlit as st
import plotly.graph_objects as go
from typing import List, Dict


def render_metrics(metrics_dict: Dict[str, str], num_cols: int = 6):
    """
    Render metric cards in a row

    Args:
        metrics_dict: Dictionary of metric_name -> metric_value
        num_cols: Number of columns to span
    """
    cols = st.columns(num_cols)

    for i, (label, value) in enumerate(metrics_dict.items()):
        with cols[i % num_cols]:
            st.metric(label, value)


def render_threat_item(threat: Dict, threat_class: str = "threat-critical"):
    """
    Render a single threat item card

    Args:
        threat: Threat data dictionary
        threat_class: CSS class for styling
    """
    st.markdown(f"""
    <div class="threat-item {threat_class}">
    <strong>{threat.get('threat_type', 'Unknown')}</strong> | {threat.get('source_ip', 'N/A')} → {threat.get('dest_ip', 'N/A')} | {threat.get('severity', 'UNKNOWN')} ({threat.get('risk_score', 0)})<br>
    {threat.get('protocol', 'N/A')} | {threat.get('packets', 0):,} packets | {threat.get('timestamp', 'N/A')}
    </div>
    """, unsafe_allow_html=True)


def render_threat_list(threats: List[Dict], show_count: int = 15):
    """
    Render a list of threat items

    Args:
        threats: List of threat dictionaries
        show_count: Number of threats to display
    """
    st.markdown("## Latest Threats")

    for threat in threats[-show_count:][::-1]:
        risk = threat.get('risk_score', 0)
        threat_class = "threat-critical" if risk >= 80 else \
                      "threat-high" if risk >= 60 else \
                      "threat-medium" if risk >= 40 else "threat-low"

        severity = "CRITICAL" if risk >= 80 else \
                  "HIGH" if risk >= 60 else \
                  "MEDIUM" if risk >= 40 else "LOW"

        threat_display = {**threat, "severity": severity}
        render_threat_item(threat_display, threat_class)


def render_glass_card(content: str):
    """
    Render content in a glass-styled card

    Args:
        content: HTML or markdown content to display
    """
    st.markdown(f'<div class="glass-card">{content}</div>', unsafe_allow_html=True)


def render_risk_timeline(risks: List[float], title: str = "Risk Timeline"):
    """
    Render risk timeline chart using Plotly

    Args:
        risks: List of risk scores
        title: Chart title
    """
    fig = go.Figure()
    fig.add_trace(go.Scatter(
        y=risks, mode='lines', name='Risk',
        line=dict(color='#3b82f6', width=2),
        fill='tozeroy', fillcolor='rgba(59, 130, 246, 0.2)'
    ))
    fig.update_layout(
        title=title, xaxis_title="Time", yaxis_title="Risk Score",
        template="plotly_dark", paper_bgcolor="#0f172a", plot_bgcolor="#0a0e27",
        height=350, margin=dict(l=40, r=20, t=40, b=40), showlegend=False
    )
    st.plotly_chart(fig, use_container_width=True)


def render_threat_distribution(threat_dist: Dict, title: str = "Threat Types"):
    """
    Render threat type distribution pie chart

    Args:
        threat_dist: Dictionary of threat_type -> count
        title: Chart title
    """
    fig = go.Figure(data=[go.Pie(
        labels=list(threat_dist.keys()), values=list(threat_dist.values()),
        hole=0.3, marker=dict(colors=['#3b82f6', '#f97316', '#ef4444', '#8b5cf6', '#22c55e'])
    )])
    fig.update_layout(
        title=title, template="plotly_dark", paper_bgcolor="#0f172a",
        plot_bgcolor="#0a0e27", height=350, margin=dict(l=40, r=20, t=40, b=40)
    )
    st.plotly_chart(fig, use_container_width=True)
