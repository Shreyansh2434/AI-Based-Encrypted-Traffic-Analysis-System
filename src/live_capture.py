import pandas as pd
import time
from collections import defaultdict
from scapy.all import sniff, IP, TCP, UDP

flows = {}

def flow_key(pkt):
    if IP not in pkt:
        return None
    ip = pkt[IP]
    proto = ip.proto

    if TCP in pkt or UDP in pkt:
        sport = pkt.sport
        dport = pkt.dport
    else:
        sport, dport = 0, 0

    forward = (ip.src, ip.dst, sport, dport, proto)
    backward = (ip.dst, ip.src, dport, sport, proto)

    return forward if forward in flows else backward if backward in flows else forward


def init_flow(pkt):
    return {
        "start": time.time(),
        "last": time.time(),
        "fwd_pkts": 0,
        "bwd_pkts": 0,
        "fwd_bytes": 0,
        "bwd_bytes": 0,
        "fwd_lengths": [],
        "bwd_lengths": [],
        "iat": [],
        "last_time": time.time(),
        "flags": {
            "syn": 0,
            "ack": 0,
            "fin": 0,
            "rst": 0
        }
    }


def process_packet(pkt):
    key = flow_key(pkt)
    if key is None:
        return

    now = time.time()

    if key not in flows:
        flows[key] = init_flow(pkt)

    flow = flows[key]

    pkt_len = len(pkt)

    # direction
    if pkt[IP].src == key[0]:
        flow["fwd_pkts"] += 1
        flow["fwd_bytes"] += pkt_len
        flow["fwd_lengths"].append(pkt_len)
    else:
        flow["bwd_pkts"] += 1
        flow["bwd_bytes"] += pkt_len
        flow["bwd_lengths"].append(pkt_len)

    # IAT
    flow["iat"].append(now - flow["last_time"])
    flow["last_time"] = now
    flow["last"] = now

    # TCP Flags
    if TCP in pkt:
        flags = pkt[TCP].flags
        if flags & 0x02: flow["flags"]["syn"] += 1
        if flags & 0x10: flow["flags"]["ack"] += 1
        if flags & 0x01: flow["flags"]["fin"] += 1
        if flags & 0x04: flow["flags"]["rst"] += 1


def extract_features():
    records = []

    for key, f in flows.items():
        duration = f["last"] - f["start"]

        total_pkts = f["fwd_pkts"] + f["bwd_pkts"]
        total_bytes = f["fwd_bytes"] + f["bwd_bytes"]

        if total_pkts < 2:
            continue

        record = {
            "duration": duration if duration > 0 else 1,

            "fwd_pkts": f["fwd_pkts"],
            "bwd_pkts": f["bwd_pkts"],

            "fwd_bytes": f["fwd_bytes"],
            "bwd_bytes": f["bwd_bytes"],

            "flow_pkts": total_pkts,
            "flow_bytes": total_bytes,

            "pkt_len_mean": (sum(f["fwd_lengths"] + f["bwd_lengths"]) / total_pkts),

            "pkt_len_std": pd.Series(f["fwd_lengths"] + f["bwd_lengths"]).std() or 0,

            "fwd_pkt_len_mean": (sum(f["fwd_lengths"]) / len(f["fwd_lengths"])) if f["fwd_lengths"] else 0,
            "bwd_pkt_len_mean": (sum(f["bwd_lengths"]) / len(f["bwd_lengths"])) if f["bwd_lengths"] else 0,

            "iat_mean": (sum(f["iat"]) / len(f["iat"])) if f["iat"] else 0,
            "iat_std": pd.Series(f["iat"]).std() if f["iat"] else 0,

            "syn_count": f["flags"]["syn"],
            "ack_count": f["flags"]["ack"],
            "fin_count": f["flags"]["fin"],
            "rst_count": f["flags"]["rst"],

            "byte_ratio": f["fwd_bytes"] / (f["bwd_bytes"] + 1),

            "pkt_rate": total_pkts / (duration + 1e-6),
            "byte_rate": total_bytes / (duration + 1e-6),
        }

        records.append(record)

    return pd.DataFrame(records)


def capture_traffic(duration=5):
    global flows
    flows = {}

    sniff(prn=process_packet, timeout=duration, store=False)

    df = extract_features()

    return df