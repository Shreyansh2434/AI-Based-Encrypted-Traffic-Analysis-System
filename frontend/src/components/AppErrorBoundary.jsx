import { Component } from "react";

export default class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("[AppErrorBoundary] Runtime error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-error-boundary">
          <h2>Dashboard failed to render</h2>
          <p>
            A runtime issue was detected. Reload the page to recover.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Reload dashboard
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
