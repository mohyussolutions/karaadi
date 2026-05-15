"use client";

import { useState, useEffect } from "react";
import { Bell, Loader2, X, Share } from "lucide-react";
import { usePushNotifications } from "../hooks/usePushNotifications";

function IOSModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "flex-end", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.4)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: "white", borderRadius: "1.25rem 1.25rem 0 0", width: "100%", maxWidth: "28rem", padding: "1.5rem", paddingBottom: "2.5rem" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <span style={{ fontWeight: 700, fontSize: "1rem", color: "#111827" }}>Enable notifications</span>
          <button onClick={onClose} style={{ color: "#9ca3af", background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: "0.875rem", color: "#4b5563", lineHeight: 1.6, marginBottom: "1.25rem" }}>
          iPhone notifications require adding Karaadi to your Home Screen first.
        </p>

        <ol style={{ fontSize: "0.875rem", color: "#374151", lineHeight: 2, paddingLeft: "1.25rem", marginBottom: "1.5rem" }}>
          <li>Tap the <strong>Share</strong> button (<Share size={13} style={{ display: "inline", verticalAlign: "middle" }} />) in Safari</li>
          <li>Choose <strong>Add to Home Screen</strong></li>
          <li>Open the app from your Home Screen</li>
          <li>Come back to Settings and turn on notifications</li>
        </ol>

        <button
          onClick={onClose}
          style={{ width: "100%", padding: "0.875rem", backgroundColor: "#2563eb", color: "white", borderRadius: "0.75rem", fontWeight: 600, fontSize: "0.9rem", border: "none", cursor: "pointer" }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}

export default function PushToggle() {
  const { enabled, permission, loading, toggle } = usePushNotifications();
  const [supported, setSupported] = useState<boolean | null>(null);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    setSupported(
      "Notification" in window &&
        "serviceWorker" in navigator &&
        "PushManager" in window,
    );
  }, []);

  const isBlocked = permission === "denied";
  const isDisabled = loading || isBlocked;

  const handleClick = () => {
    if (isDisabled) return;
    if (supported === false) {
      setShowIOSModal(true);
      return;
    }
    toggle();
  };

  const subtitle =
    isBlocked ? "Blocked — allow in your browser settings" :
    supported === false ? "Tap to see how to enable on iPhone" :
    loading ? (enabled ? "Turning on…" : "Turning off…") :
    enabled ? "You'll be notified of new messages" :
    "Tap to get notified when offline";

  return (
    <>
      {showIOSModal && <IOSModal onClose={() => setShowIOSModal(false)} />}

      <div
        onClick={handleClick}
        style={{ cursor: isDisabled ? "default" : "pointer", userSelect: "none", opacity: isBlocked ? 0.5 : 1 }}
        className="flex items-center py-4 touch-manipulation active:opacity-70"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
          <Bell size={20} className={`flex-shrink-0 transition-colors ${enabled ? "text-blue-600" : "text-gray-400"}`} />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-gray-900 leading-snug">Message notifications</span>
            <span className="text-xs text-gray-400 mt-0.5 leading-relaxed">{subtitle}</span>
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
    </>
  );
}
