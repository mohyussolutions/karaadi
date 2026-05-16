"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/actions/core/authAction";
import { useAuth } from "@/context/AuthContext";
import {
  getActiveSessions,
  logoutAllSessions,
  logoutSession,
  getLoginHistory,
  deleteLoginHistoryEntry,
  clearLoginHistory,
} from "@/actions/categories/session";
import { Monitor, Smartphone, Tablet, Globe, Clock, Trash2 } from "lucide-react";

interface Device {
  id: string;
  device?: string;
  browser?: string;
  active?: boolean;
  lastActive?: string;
}

interface LoginEntry {
  id: number;
  ipAddress: string | null;
  browser: string | null;
  device: string | null;
  loggedAt: string;
}

function DeviceIcon({ device }: { device?: string | null }) {
  if (!device) return <Monitor size={18} className="text-gray-400" />;
  if (/iPhone|Android/.test(device)) return <Smartphone size={18} className="text-blue-500" />;
  if (/iPad/.test(device)) return <Tablet size={18} className="text-blue-500" />;
  return <Monitor size={18} className="text-gray-500" />;
}

function formatDate(dateString: string) {
  try {
    return new Date(dateString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

const Security: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeDevices, setActiveDevices] = useState<Device[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const token = user.accessToken || user.token;
      const [sessions, history] = await Promise.all([
        getActiveSessions(token),
        getLoginHistory(token),
      ]);
      setActiveDevices(sessions || []);
      setLoginHistory(history || []);
    } catch {
      setActiveDevices([]);
      setLoginHistory([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) router.replace("/");
      else fetchData();
    }
  }, [user, authLoading, router, fetchData]);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const handleLogoutAllDevices = async () => {
    if (!confirm("Are you sure you want to sign out of all devices?")) return;
    setIsLoggingOut(true);
    try {
      const token = user?.accessToken || user?.token;
      await logoutAllSessions(token);
      logout();
      setActiveDevices([]);
      window.location.reload();
    } catch {
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLogoutDevice = async (sessionId: string) => {
    try {
      const token = user?.accessToken || user?.token;
      const ok = await logoutSession(sessionId, token);
      if (ok) setActiveDevices((prev) => prev.filter((d) => d.id !== sessionId));
    } catch {}
  };

  const handleDeleteHistoryEntry = async (id: number) => {
    setLoginHistory((prev) => prev.filter((e) => e.id !== id));
    const token = user?.accessToken || user?.token;
    await deleteLoginHistoryEntry(id, token);
  };

  const handleClearHistory = async () => {
    if (!confirm("Clear all sign-in history?")) return;
    setLoginHistory([]);
    const token = user?.accessToken || user?.token;
    await clearLoginHistory(token);
  };

  const currentYear = new Date().getFullYear();
  const yearRange = currentYear === 2025 ? "2025" : `2025–${currentYear}`;

  if (authLoading || loading) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Security</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your active sessions and see recent sign-in activity.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between gap-2 flex-wrap">
          <p className="font-bold text-gray-900 text-sm">Active sessions</p>
          <div className="flex gap-2">
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
            >
              Sign out
            </button>
            <button
              onClick={handleLogoutAllDevices}
              disabled={isLoggingOut || activeDevices.length === 0}
              className="px-3 py-1.5 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition disabled:opacity-40"
            >
              {isLoggingOut ? "Signing out…" : "Sign out all"}
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {activeDevices.length > 0 ? (
            activeDevices.map((device) => (
              <div key={device.id} className="flex items-center justify-between gap-3 px-5 py-4">
                <div className="flex items-center gap-3 min-w-0">
                  <DeviceIcon device={device.device} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {device.device || "Unknown device"} · {device.browser || "Unknown browser"}
                    </p>
                    {device.active && (
                      <span className="inline-block text-xs text-green-600 font-medium">Active now</span>
                    )}
                    {device.lastActive && !device.active && (
                      <p className="text-xs text-gray-400">{formatDate(device.lastActive)}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleLogoutDevice(device.id)}
                  className="text-xs text-red-500 hover:text-red-700 font-medium flex-shrink-0"
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <div className="px-5 py-8 text-center text-sm text-gray-400">No active sessions found</div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between gap-2">
          <div>
            <p className="font-bold text-gray-900 text-sm">Recent sign-in activity</p>
            <p className="text-xs text-gray-400 mt-0.5">Last 20 logins to your account</p>
          </div>
          {loginHistory.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="px-3 py-1.5 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="divide-y divide-gray-50">
          {loginHistory.length > 0 ? (
            loginHistory.map((entry) => (
              <div key={entry.id} className="flex items-center gap-3 px-5 py-3">
                <DeviceIcon device={entry.device} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {entry.device || "Unknown"} · {entry.browser || "Unknown browser"}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    {entry.ipAddress && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Globe size={11} />
                        {entry.ipAddress}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock size={11} />
                      {formatDate(entry.loggedAt)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteHistoryEntry(entry.id)}
                  className="p-1.5 text-gray-300 hover:text-red-500 transition flex-shrink-0"
                  aria-label="Delete record"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          ) : (
            <div className="px-5 py-8 text-center text-sm text-gray-400">
              No sign-in history yet. History is recorded from your next login.
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">
        © {yearRange} Karaadi AS. All rights reserved.
      </p>
    </div>
  );
};

export default Security;
