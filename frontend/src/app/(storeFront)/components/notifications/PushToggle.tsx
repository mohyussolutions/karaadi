"use client";

import { useState, useEffect } from "react";
import { Bell, Loader2 } from "lucide-react";
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

  const isBlocked = permission === "denied";
  const isDisabled = loading || isBlocked;

  const subtitle =
    isBlocked ? "Blocked — allow in your browser settings" :
    supported === false ? "Tap to see how to enable on iPhone" :
    loading ? (enabled ? "Turning on…" : "Turning off…") :
    enabled ? "You'll be notified of new messages" :
    "Tap to get notified when offline";

  return (
    <div
      onClick={isDisabled ? undefined : toggle}
      style={{
        cursor: isDisabled ? "default" : "pointer",
        userSelect: "none",
        opacity: isBlocked ? 0.5 : 1,
      }}
      className="flex items-center py-4 touch-manipulation active:opacity-70"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
        <Bell
          size={20}
          className={`flex-shrink-0 transition-colors ${enabled ? "text-blue-600" : "text-gray-400"}`}
        />
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-gray-900 leading-snug">
            Message notifications
          </span>
          <span className="text-xs text-gray-400 mt-0.5 leading-relaxed">
            {subtitle}
          </span>
        </div>
      </div>

      <div
        style={{
          backgroundColor: enabled ? "#2563eb" : "#d1d5db",
          minWidth: "3.5rem",
          width: "3.5rem",
          height: "2rem",
          borderRadius: "9999px",
          position: "relative",
          flexShrink: 0,
          transition: "background-color 0.2s",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "2px",
            left: "2px",
            width: "1.625rem",
            height: "1.625rem",
            borderRadius: "9999px",
            backgroundColor: "white",
            boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: enabled ? "translateX(1.375rem)" : "translateX(0)",
            transition: "transform 0.2s",
          }}
        >
          {loading && <Loader2 size={11} className="animate-spin text-gray-400" />}
        </span>
      </div>
    </div>
  );
}
