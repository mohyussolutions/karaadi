"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, X } from "lucide-react";
import { usePushNotifications } from "../hooks/usePushNotifications";
import { useAuth } from "@/context/AuthContext";

export default function PushPermissionBanner() {
  const { user } = useAuth();
  const { enabled, permission, loading, subscribe } = usePushNotifications();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const d = localStorage.getItem("karaadi:push:dismissed");
    if (d === "true") setDismissed(true);
  }, []);

  if (!user) return null;
  if (dismissed) return null;
  if (enabled) return null;
  if (permission === "denied") return null;
  if (typeof window === "undefined" || !("Notification" in window)) return null;

  const dismiss = () => {
    localStorage.setItem("karaadi:push:dismissed", "true");
    setDismissed(true);
  };

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50 bg-white rounded-2xl border border-gray-200 shadow-xl p-4 flex items-start gap-3 animate-in slide-in-from-bottom-4">
      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
        <Bell size={18} className="text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-900 text-sm">Enable notifications</p>
        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
          Get notified when someone sends you a message.
        </p>
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={subscribe}
            disabled={loading}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors disabled:opacity-50 touch-manipulation"
          >
            {loading ? "Setting up..." : "Allow"}
          </button>
          <button
            onClick={dismiss}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold text-xs rounded-lg transition-colors touch-manipulation"
          >
            Not now
          </button>
        </div>
      </div>
      <button onClick={dismiss} className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
        <X size={16} />
      </button>
    </div>
  );
}
