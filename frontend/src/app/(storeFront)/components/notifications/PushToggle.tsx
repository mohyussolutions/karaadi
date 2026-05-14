"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, Smartphone } from "lucide-react";
import { usePushNotifications } from "../hooks/usePushNotifications";

export default function PushToggle() {
  const { enabled, permission, loading, toggle } = usePushNotifications();
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setSupported("Notification" in window && "serviceWorker" in navigator && "PushManager" in window);
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
      <div className="flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-3 min-w-0">
          <BellOff size={18} className="text-gray-300 flex-shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-gray-900">Message notifications</span>
            <span className="text-xs text-gray-400 mt-0.5">Blocked in browser — allow in your browser settings</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-3 min-w-0">
        <Bell size={18} className={`flex-shrink-0 ${enabled ? "text-blue-600" : "text-gray-400"}`} />
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-gray-900">Message notifications</span>
          <span className="text-xs text-gray-400 mt-0.5">
            {enabled ? "You'll be notified of new messages" : "Turn on to get notified when offline"}
          </span>
        </div>
      </div>
      <button
        onClick={toggle}
        disabled={loading}
        aria-checked={enabled}
        role="switch"
        className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 disabled:opacity-50 touch-manipulation ${
          enabled ? "bg-blue-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition duration-200 ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
