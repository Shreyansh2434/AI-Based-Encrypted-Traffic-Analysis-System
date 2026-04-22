"""
capture/flow_builder.py
=======================
Converts raw Scapy packet list → CICIDS-compatible flow feature dict.
Output is compatible with all 3 trained models in predictor.py.
"""

import time
import numpy as np
from collections import defaultdict


def build_flow(packet) -> dict:
    """
    Wrapper for single-packet processing.
    Takes a single Scapy packet and returns CICIDS features.
    Treats the single packet as a one-packet flow.
    """
    if packet is None:
        return _empty_features()
    try:
        return build_flow_features([packet])
    except (AttributeError, ValueError, KeyError, TypeError, IndexError):
        return _empty_features()


def build_flow_features(packets: list) -> dict:
    """
    Convert a list of Scapy packets (same flow) into a feature dict.
    Matches CICIDS2017 feature naming as closely as possible
    from live capture data.

    Parameters
    ----------
    packets : list of Scapy packet objects

    Returns
    -------
    dict of features ready for predict_flow()
    """
    if not packets:
        return _empty_features()

    fwd_pkts, bwd_pkts = [], []
    fwd_bytes_list, bwd_bytes_list = [], []
    timestamps = []
    fin_count = syn_count = rst_count = psh_count = ack_count = urg_count = 0

    # Determine direction by first packet source
    try:
        from scapy.all import IP, TCP, UDP
        src_ip = packets[0][IP].src if packets[0].haslayer(IP) else "0.0.0.0"

        for pkt in packets:
            ts = float(pkt.time)
            timestamps.append(ts)
            pkt_len = len(pkt)

            if pkt.haslayer(IP) and pkt[IP].src == src_ip:
                fwd_pkts.append(pkt)
                fwd_bytes_list.append(pkt_len)
            else:
                bwd_pkts.append(pkt)
                bwd_bytes_list.append(pkt_len)

            # TCP flags
            if pkt.haslayer(TCP):
                flags = pkt[TCP].flags
                if flags & 0x01: fin_count += 1
                if flags & 0x02: syn_count += 1
                if flags & 0x04: rst_count += 1
                if flags & 0x08: psh_count += 1
                if flags & 0x10: ack_count += 1
                if flags & 0x20: urg_count += 1

    except Exception:
        return _empty_features()

    timestamps.sort()
    all_lens = fwd_bytes_list + bwd_bytes_list
    duration = (timestamps[-1] - timestamps[0]) if len(timestamps) > 1 else 0.0

    # Inter-arrival times
    iats = [timestamps[i+1] - timestamps[i] for i in range(len(timestamps)-1)]
    fwd_times = sorted([float(p.time) for p in fwd_pkts])
    bwd_times = sorted([float(p.time) for p in bwd_pkts])
    fwd_iats = [fwd_times[i+1]-fwd_times[i] for i in range(len(fwd_times)-1)]
    bwd_iats = [bwd_times[i+1]-bwd_times[i] for i in range(len(bwd_times)-1)]

    def safe_stat(lst, func):
        return float(func(lst)) if lst else 0.0

    # Initial window sizes
    init_win_fwd = init_win_bwd = 0
    if fwd_pkts and fwd_pkts[0].haslayer("TCP"):
        init_win_fwd = fwd_pkts[0]["TCP"].window
    if bwd_pkts and bwd_pkts[0].haslayer("TCP"):
        init_win_bwd = bwd_pkts[0]["TCP"].window

    flow_bytes_s = (sum(all_lens) / duration) if duration > 0 else 0.0
    flow_pkts_s  = (len(packets) / duration)  if duration > 0 else 0.0

    return {
        # Core flow features
        " Flow Duration"              : duration * 1e6,   # microseconds like CICFlowMeter
        " Total Fwd Packets"          : len(fwd_pkts),
        " Total Backward Packets"     : len(bwd_pkts),
        " Total Length of Fwd Packets": sum(fwd_bytes_list),
        " Total Length of Bwd Packets": sum(bwd_bytes_list),

        # Forward packet lengths
        " Fwd Packet Length Max"      : safe_stat(fwd_bytes_list, max),
        " Fwd Packet Length Min"      : safe_stat(fwd_bytes_list, min),
        " Fwd Packet Length Mean"     : safe_stat(fwd_bytes_list, np.mean),
        " Fwd Packet Length Std"      : safe_stat(fwd_bytes_list, np.std),

        # Backward packet lengths
        " Bwd Packet Length Max"      : safe_stat(bwd_bytes_list, max),
        " Bwd Packet Length Min"      : safe_stat(bwd_bytes_list, min),
        " Bwd Packet Length Mean"     : safe_stat(bwd_bytes_list, np.mean),
        " Bwd Packet Length Std"      : safe_stat(bwd_bytes_list, np.std),

        # Flow rates
        " Flow Bytes/s"               : flow_bytes_s,
        " Flow Packets/s"             : flow_pkts_s,

        # IAT — all
        " Flow IAT Mean"              : safe_stat(iats, np.mean),
        " Flow IAT Std"               : safe_stat(iats, np.std),
        " Flow IAT Max"               : safe_stat(iats, max),
        " Flow IAT Min"               : safe_stat(iats, min),

        # IAT — forward
        " Fwd IAT Total"              : sum(fwd_iats),
        " Fwd IAT Mean"               : safe_stat(fwd_iats, np.mean),
        " Fwd IAT Std"                : safe_stat(fwd_iats, np.std),
        " Fwd IAT Max"                : safe_stat(fwd_iats, max),
        " Fwd IAT Min"                : safe_stat(fwd_iats, min),

        # IAT — backward
        " Bwd IAT Total"              : sum(bwd_iats),
        " Bwd IAT Mean"               : safe_stat(bwd_iats, np.mean),
        " Bwd IAT Std"                : safe_stat(bwd_iats, np.std),
        " Bwd IAT Max"                : safe_stat(bwd_iats, max),
        " Bwd IAT Min"                : safe_stat(bwd_iats, min),

        # Flags
        " Fwd PSH Flags"              : psh_count,
        " Fwd URG Flags"              : urg_count,
        " FIN Flag Count"             : fin_count,
        " SYN Flag Count"             : syn_count,
        " RST Flag Count"             : rst_count,
        " PSH Flag Count"             : psh_count,
        " ACK Flag Count"             : ack_count,
        " URG Flag Count"             : urg_count,
        " CWE Flag Count"             : 0,
        " ECE Flag Count"             : 0,

        # Header lengths (approx)
        " Fwd Header Length"          : len(fwd_pkts) * 20,
        " Bwd Header Length"          : len(bwd_pkts) * 20,

        # Per-direction rates
        " Fwd Packets/s"              : (len(fwd_pkts) / duration) if duration > 0 else 0,
        " Bwd Packets/s"              : (len(bwd_pkts) / duration) if duration > 0 else 0,

        # Overall packet stats
        " Min Packet Length"          : safe_stat(all_lens, min),
        " Max Packet Length"          : safe_stat(all_lens, max),
        " Packet Length Mean"         : safe_stat(all_lens, np.mean),
        " Packet Length Std"          : safe_stat(all_lens, np.std),
        " Packet Length Variance"     : safe_stat(all_lens, np.var),

        # Ratios
        " Down/Up Ratio"              : (len(bwd_pkts) / len(fwd_pkts)) if fwd_pkts else 0,
        " Average Packet Size"        : safe_stat(all_lens, np.mean),
        " Avg Fwd Segment Size"       : safe_stat(fwd_bytes_list, np.mean),
        " Avg Bwd Segment Size"       : safe_stat(bwd_bytes_list, np.mean),

        # Bulk (approximated as 0 for live capture — real bulk requires session tracking)
        " Fwd Avg Bytes/Bulk"         : 0,
        " Fwd Avg Packets/Bulk"       : 0,
        " Fwd Avg Bulk Rate"          : 0,
        " Bwd Avg Bytes/Bulk"         : 0,
        " Bwd Avg Packets/Bulk"       : 0,
        " Bwd Avg Bulk Rate"          : 0,

        # Subflows (approx as total)
        "Subflow Fwd Packets"         : len(fwd_pkts),
        " Subflow Fwd Bytes"          : sum(fwd_bytes_list),
        " Subflow Bwd Packets"        : len(bwd_pkts),
        " Subflow Bwd Bytes"          : sum(bwd_bytes_list),

        # TCP window
        "Init_Win_bytes_forward"      : init_win_fwd,
        " Init_Win_bytes_backward"    : init_win_bwd,
        " act_data_pkt_fwd"           : len([p for p in fwd_pkts if len(p) > 40]),
        " min_seg_size_forward"       : safe_stat(fwd_bytes_list, min),

        # Active / Idle (approximated)
        "Active Mean"                 : safe_stat(iats, np.mean),
        " Active Std"                 : safe_stat(iats, np.std),
        " Active Max"                 : safe_stat(iats, max),
        " Active Min"                 : safe_stat(iats, min),
        "Idle Mean"                   : 0,
        " Idle Std"                   : 0,
        " Idle Max"                   : 0,
        " Idle Min"                   : 0,

        # Compact aliases (backwards compatible with existing flow_builder)
        "duration"                    : duration,
        "fwd_pkts"                    : len(fwd_pkts),
        "bwd_pkts"                    : len(bwd_pkts),
        "fwd_bytes"                   : sum(fwd_bytes_list),
        "bwd_bytes"                   : sum(bwd_bytes_list),
        "pkt_len_mean"                : safe_stat(all_lens, np.mean),
        "pkt_len_std"                 : safe_stat(all_lens, np.std),
        "iat_mean"                    : safe_stat(iats, np.mean),
        "iat_std"                     : safe_stat(iats, np.std),
    }


def _empty_features() -> dict:
    """Returns a zero-filled feature dict for empty/failed flows."""
    # Return all 72 CICIDS features with zeros to match align_features expectations
    return {
        # Core flow features
        " Flow Duration"              : 0.0,
        " Total Fwd Packets"          : 0.0,
        " Total Backward Packets"     : 0.0,
        " Total Length of Fwd Packets": 0.0,
        " Total Length of Bwd Packets": 0.0,
        # Forward packet lengths
        " Fwd Packet Length Max"      : 0.0,
        " Fwd Packet Length Min"      : 0.0,
        " Fwd Packet Length Mean"     : 0.0,
        " Fwd Packet Length Std"      : 0.0,
        # Backward packet lengths
        " Bwd Packet Length Max"      : 0.0,
        " Bwd Packet Length Min"      : 0.0,
        " Bwd Packet Length Mean"     : 0.0,
        " Bwd Packet Length Std"      : 0.0,
        # Flow rates
        " Flow Bytes/s"               : 0.0,
        " Flow Packets/s"             : 0.0,
        # IAT — all
        " Flow IAT Mean"              : 0.0,
        " Flow IAT Std"               : 0.0,
        " Flow IAT Max"               : 0.0,
        " Flow IAT Min"               : 0.0,
        # IAT — forward
        " Fwd IAT Total"              : 0.0,
        " Fwd IAT Mean"               : 0.0,
        " Fwd IAT Std"                : 0.0,
        " Fwd IAT Max"                : 0.0,
        " Fwd IAT Min"                : 0.0,
        # IAT — backward
        " Bwd IAT Total"              : 0.0,
        " Bwd IAT Mean"               : 0.0,
        " Bwd IAT Std"                : 0.0,
        " Bwd IAT Max"                : 0.0,
        " Bwd IAT Min"                : 0.0,
        # Flags
        " Fwd PSH Flags"              : 0.0,
        " Fwd URG Flags"              : 0.0,
        " FIN Flag Count"             : 0.0,
        " SYN Flag Count"             : 0.0,
        " RST Flag Count"             : 0.0,
        " PSH Flag Count"             : 0.0,
        " ACK Flag Count"             : 0.0,
        " URG Flag Count"             : 0.0,
        " CWE Flag Count"             : 0.0,
        " ECE Flag Count"             : 0.0,
        # Header lengths
        " Fwd Header Length"          : 0.0,
        " Bwd Header Length"          : 0.0,
        # Per-direction rates
        " Fwd Packets/s"              : 0.0,
        " Bwd Packets/s"              : 0.0,
        # Overall packet stats
        " Min Packet Length"          : 0.0,
        " Max Packet Length"          : 0.0,
        " Packet Length Mean"         : 0.0,
        " Packet Length Std"          : 0.0,
        " Packet Length Variance"     : 0.0,
        # Ratios
        " Down/Up Ratio"              : 0.0,
        " Average Packet Size"        : 0.0,
        " Avg Fwd Segment Size"       : 0.0,
        " Avg Bwd Segment Size"       : 0.0,
        # Bulk
        " Fwd Avg Bytes/Bulk"         : 0.0,
        " Fwd Avg Packets/Bulk"       : 0.0,
        " Fwd Avg Bulk Rate"          : 0.0,
        " Bwd Avg Bytes/Bulk"         : 0.0,
        " Bwd Avg Packets/Bulk"       : 0.0,
        " Bwd Avg Bulk Rate"          : 0.0,
        # Subflows
        "Subflow Fwd Packets"         : 0.0,
        " Subflow Fwd Bytes"          : 0.0,
        " Subflow Bwd Packets"        : 0.0,
        " Subflow Bwd Bytes"          : 0.0,
        # TCP window
        "Init_Win_bytes_forward"      : 0.0,
        " Init_Win_bytes_backward"    : 0.0,
        " act_data_pkt_fwd"           : 0.0,
        " min_seg_size_forward"       : 0.0,
        # Active / Idle
        "Active Mean"                 : 0.0,
        " Active Std"                 : 0.0,
        " Active Max"                 : 0.0,
        " Active Min"                 : 0.0,
        "Idle Mean"                   : 0.0,
        " Idle Std"                   : 0.0,
        " Idle Max"                   : 0.0,
        " Idle Min"                   : 0.0,
        # Compact aliases
        "duration"                    : 0.0,
        "fwd_pkts"                    : 0.0,
        "bwd_pkts"                    : 0.0,
        "fwd_bytes"                   : 0.0,
        "bwd_bytes"                   : 0.0,
        "pkt_len_mean"                : 0.0,
        "pkt_len_std"                 : 0.0,
        "iat_mean"                    : 0.0,
        "iat_std"                     : 0.0,
    }