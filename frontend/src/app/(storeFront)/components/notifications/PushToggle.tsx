"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, Smartphone, Loader2 } from "lucide-react";
import { usePushNotifications } from "../hooks/usePushNotifications";

export default function PushToggle() {
  const { enabled, permission, loading, toggle } = usePushNotifications();
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setSupported(
      "Notification" in window &&
        "serviceWorker" in navigator &&
        "PushManager" in window,
    );
  }, []);

  if (supported === null) return null;

  if (!supported) {
    return (
      <div className="flex items-start gap-3 py-4">
        <Smartphone size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900">Message notifications</span>
          <span className="text-xs text-gray-400 mt-0.5 leading-relaxed">
            To enable on iPhone, add this app to your Home Screen first.
          </span>
        </div>
      </div>
    );
  }

  if (permission === "denied") {
    return (
      <div className="flex items-center gap-3 py-4">
        <BellOff size={18} className="text-gray-300 flex-shrink-0" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900">Message notifications</span>
          <span className="text-xs text-gray-400 mt-0.5">Blocked — allow in your browser settings</span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={loading ? undefined : toggle}
      style={{ cursor: loading ? "wait" : "pointer", userSelect: "none" }}
      className="flex items-center py-4 touch-manipulation active:opacity-70"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Bell size={20} className={`flex-shrink-0 transition-colors ${enabled ? "text-blue-600" : "text-gray-400"}`} />
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-gray-900">Message notifications</span>
          <span className="text-xs text-gray-400 mt-0.5">
            {loading
              ? enabled ? "Turning on…" : "Turning off…"
              : enabled ? "You'll be notified of new messages" : "Tap to get notified when offline"}
          </span>
        </div>
      </div>

      <div
        role="switch"
        aria-checked={enabled}
        style={{
          backgroundColor: enabled ? "#2563eb" : "#d1d5db",
          minWidth: "3.5rem",
          width: "3.5rem",
          height: "2rem",
          borderRadius: "9999px",
          border: "2px solid transparent",
          position: "relative",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
          transition: "background-color 0.2s",
        }}
      >
        <span
          style={{
            width: "1.75rem",
            height: "1.75rem",
            borderRadius: "9999px",
            backgroundColor: "white",
            boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: enabled ? "translateX(1.5rem)" : "translateX(0)",
            transition: "transform 0.2s",
            flexShrink: 0,
          }}
        >
          {loading && <Loader2 size={12} className="animate-spin text-gray-400" />}
        </span>
      </div>
    </div>
  );
}
