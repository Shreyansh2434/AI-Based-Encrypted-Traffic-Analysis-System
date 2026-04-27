"""
Batch Analysis page for Cipher Traffic Analyzer
"""

import streamlit as st
import pandas as pd
import plotly.graph_objects as go
import numpy as np
from datetime import datetime
from ..utils import normalize_dataframe, generate_threat
from ..components import render_metrics


def render_batch_analysis():
    """Render the Batch Analysis mode page"""

    st.markdown("## Batch Threat Analysis")

    uploaded_file = st.file_uploader("Upload CSV File", type=["csv"])

    use_demo = st.checkbox("Use Demo Dataset")

    if uploaded_file or use_demo:

        try:
            if uploaded_file:
                df = pd.read_csv(uploaded_file)
                df = normalize_dataframe(df)
            else:
                demo_threats = [generate_threat() for _ in range(1000)]
                df = pd.DataFrame(demo_threats)

            st.success(f"Loaded {len(df):,} flows")

            # Calculate metrics
            total = len(df)
            critical = sum(1 for _, row in df.iterrows() if row["risk_score"] >= 80)
            high = sum(1 for _, row in df.iterrows() if 60 <= row["risk_score"] < 80)
            avg_risk = int(df["risk_score"].mean())
            unique_ips = len(set(list(df["source_ip"]) + list(df["dest_ip"])))

            metrics = {
                "Total Flows": f"{total:,}",
                "Critical": str(critical),
                "High Risk": str(high),
                "Avg Risk": str(avg_risk),
                "Unique IPs": str(unique_ips),
                "Threats": str(critical + high)
            }
            render_metrics(metrics, num_cols=6)

            st.markdown("")

            # Charts
            col_chart1, col_chart2 = st.columns(2)

            with col_chart1:
                fig = go.Figure()
                fig.add_trace(go.Histogram(
                    x=df["risk_score"], nbinsx=30, marker_color='#3b82f6'
                ))
                fig.update_layout(
                    title="Risk Distribution", xaxis_title="Risk Score", yaxis_title="Count",
                    template="plotly_dark", paper_bgcolor="#0f172a", plot_bgcolor="#0a0e27",
                    height=350, margin=dict(l=40, r=20, t=40, b=40)
                )
                st.plotly_chart(fig, use_container_width=True)

            with col_chart2:
                threat_counts = df["threat_type"].value_counts()
                fig = go.Figure()
                fig.add_trace(go.Bar(
                    x=threat_counts.index, y=threat_counts.values, marker_color='#f97316'
                ))
                fig.update_layout(
                    title="Threat Types", xaxis_title="Type", yaxis_title="Count",
                    template="plotly_dark", paper_bgcolor="#0f172a", plot_bgcolor="#0a0e27",
                    height=350, margin=dict(l=40, r=20, t=40, b=40)
                )
                st.plotly_chart(fig, use_container_width=True)

            st.markdown("")

            # High-risk flows table
            high_risk_df = df[df["risk_score"] > 60].sort_values("risk_score", ascending=False).head(20)
            st.markdown("## High-Risk Flows")
            st.dataframe(high_risk_df, use_container_width=True)

            # Download button
            csv = df.to_csv(index=False)
            st.download_button(
                "Download Results", csv,
                f"cipher_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
                "text/csv", use_container_width=True
            )

        except Exception as e:
            st.error(f"Error processing file: {str(e)}")
