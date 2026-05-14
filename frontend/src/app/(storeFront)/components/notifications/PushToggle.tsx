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
            To enable notifications on iPhone, add this app to your Home Screen first.
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
    <button
      onClick={toggle}
      disabled={loading}
      className="w-full flex items-center justify-between gap-4 py-4 touch-manipulation text-left disabled:cursor-wait"
    >
      <div className="flex items-center gap-3 min-w-0">
        <Bell size={18} className={`flex-shrink-0 ${enabled ? "text-blue-600" : "text-gray-400"}`} />
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-gray-900">Message notifications</span>
          <span className="text-xs text-gray-400 mt-0.5">
            {loading
              ? enabled ? "Turning on…" : "Turning off…"
              : enabled ? "You'll be notified of new messages" : "Turn on to get notified when offline"}
          </span>
        </div>
      </div>

      <div
        role="switch"
        aria-checked={enabled}
        style={{ backgroundColor: enabled ? "#2563eb" : "#d1d5db", flexShrink: 0 }}
        className="relative inline-flex h-8 w-14 rounded-full border-2 border-transparent transition-colors duration-200"
      >
        <span
          className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-white shadow-md transition-transform duration-200"
          style={{ transform: enabled ? "translateX(1.5rem)" : "translateX(0)" }}
        >
          {loading && <Loader2 size={12} className="animate-spin text-gray-400" />}
        </span>
      </div>
    </button>
  );
}
