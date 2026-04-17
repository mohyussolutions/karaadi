"use client";

import React, { ErrorInfo, ReactNode } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import Link from "next/link";
import { MdLockOutline } from "react-icons/md";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center min-h-screen bg-[#f6f8fb] px-4 text-center">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 max-w-md w-full">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FaExclamationTriangle size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Something went wrong
              </h2>
              <p className="text-gray-500 mb-8">
                An unexpected error occurred. Please try refreshing the page or
                contact support if the problem persists.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="block w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                  Refresh Page
                </button>
                <Link
                  href="/"
                  className="block w-full py-3 bg-gray-50 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-all"
                >
                  Back to Home
                </Link>
              </div>
            </div>
            <p className="mt-8 text-sm text-gray-400 font-medium">
              Error: Application Error
            </p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

export function AuthGuardComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f6f8fb] px-4 text-center">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 max-w-md w-full">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <MdLockOutline size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-500 mb-8">
          You don't have permission to access this area. Please log in with an
          authorized account to continue.
        </p>
        <div className="space-y-3">
          <Link
            href="/auth/login"
            className="block w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            Login Now
          </Link>
          <Link
            href="/"
            className="block w-full py-3 bg-gray-50 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
      <p className="mt-8 text-sm text-gray-400 font-medium">
        Error Code: 403 Forbidden
      </p>
    </div>
  );
}

export default ErrorBoundary;
