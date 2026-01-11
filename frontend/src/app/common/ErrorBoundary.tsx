"use client";

import React, { ErrorInfo } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { ErrorBoundaryProps, ErrorBoundaryState } from "../utils/types/ui";

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in component:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            style={{
              padding: "20px",
              backgroundColor: "#fee2e2",
              border: "1px solid #f87171",
              borderRadius: "4px",
              color: "#dc3545",
              textAlign: "center",
            }}
          >
            <FaExclamationTriangle size={32} style={{ marginBottom: "10px" }} />
            <h2>Something went wrong.</h2>
            <p>We are working to fix this. Please try refreshing the page.</p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
