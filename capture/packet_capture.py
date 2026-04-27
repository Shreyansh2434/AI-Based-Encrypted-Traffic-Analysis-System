import time
from scapy.all import sniff
from capture.flow_builder import build_flow
from services.detection_service import detect_flow
from services.stream_service import broadcast_event


def _extract_packet_metadata(packet):
    source_ip = "unknown"
    dest_ip = "unknown"
    protocol = "OTHER"
    source_port = None
    dest_port = None

    try:
        from scapy.all import IP, IPv6, TCP, UDP, ICMP

        if packet.haslayer(IP):
            source_ip = packet[IP].src
            dest_ip = packet[IP].dst
        elif packet.haslayer(IPv6):
            source_ip = packet[IPv6].src
            dest_ip = packet[IPv6].dst

        if packet.haslayer(TCP):
            protocol = "TCP"
            source_port = int(packet[TCP].sport)
            dest_port = int(packet[TCP].dport)
        elif packet.haslayer(UDP):
            protocol = "UDP"
            source_port = int(packet[UDP].sport)
            dest_port = int(packet[UDP].dport)
        elif packet.haslayer(ICMP):
            protocol = "ICMP"
    except Exception:
        pass

    return {
        "timestamp": time.time(),
        "source_ip": source_ip,
        "dest_ip": dest_ip,
        "protocol": protocol,
        "source_port": source_port,
        "dest_port": dest_port,
        "packets": 1,
        "bytes": int(len(packet)),
    }


def _derive_threat_type(result, protocol):
    if result.get("prediction") != "attack":
        return "Benign encrypted flow"

    risk_score = float(result.get("risk_score", 0))
    if risk_score >= 85:
        return f"Critical {protocol} anomaly"
    if risk_score >= 65:
        return f"Suspicious {protocol} activity"
    return f"Anomalous {protocol} flow"


def process_packet(packet):

    flow = build_flow(packet)

    if flow is None:
        return

    result = detect_flow(flow)
    metadata = _extract_packet_metadata(packet)

    event = {
        **result,
        **metadata,
        "threat_type": _derive_threat_type(result, metadata["protocol"]),
        "final_decision": result.get("prediction", "benign"),
    }

    broadcast_event(event)


def start_capture():

    sniff(
        prn=process_packet,
        store=False
    )
