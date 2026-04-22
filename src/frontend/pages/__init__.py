"""
Dashboard pages/modes for Cipher Traffic Analyzer
"""

from .problem_statement import render_problem_statement
from .live_monitoring import render_live_monitoring
from .batch_analysis import render_batch_analysis
from .model_details import render_model_details
from .performance_testing import render_performance_testing

__all__ = [
    "render_problem_statement",
    "render_live_monitoring",
    "render_batch_analysis",
    "render_model_details",
    "render_performance_testing",
]
