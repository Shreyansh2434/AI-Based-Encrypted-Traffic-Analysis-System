try:
    from src.live_capture import capture_traffic
    from src.infer import predict_flows
except ImportError:
    from live_capture import capture_traffic
    from infer import predict_flows

def run_live_detection():
    df = capture_traffic(5)

    if df.empty:
        print("No traffic captured")
        return

    result = predict_flows(df)

    print(result[["final_decision", "risk_score", "severity"]])


if __name__ == "__main__":
    run_live_detection()