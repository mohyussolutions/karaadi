"use client";

import { Bell, BellOff } from "lucide-react";
import { usePushNotifications } from "../hooks/usePushNotifications";

export default function PushToggle() {
  const { enabled, permission, loading, toggle } = usePushNotifications();

  if (typeof window === "undefined" || !("Notification" in window)) return null;
  if (permission === "denied") {
    return (
      <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-50 last:border-0">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900">Message notifications</span>
          <span className="text-xs text-gray-400 mt-0.5">Blocked in browser settings</span>
        </div>
        <BellOff size={16} className="text-gray-300 flex-shrink-0" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-50 last:border-0">
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-900">Message notifications</span>
        <span className="text-xs text-gray-400 mt-0.5">
          {enabled ? "You'll be notified of new messages" : "Turn on to get notified when offline"}
        </span>
      </div>
      <button
        onClick={toggle}
        disabled={loading}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 disabled:opacity-50 ${
          enabled ? "bg-blue-600" : "bg-gray-200"
        }`}
        role="switch"
        aria-checked={enabled}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
