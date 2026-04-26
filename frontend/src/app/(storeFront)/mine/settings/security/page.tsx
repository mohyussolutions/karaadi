"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { logout, clearAuthCookies } from "@/actions/core/authAction";

import { useAuth } from "@/context/AuthContext";
import {
  getActiveSessions,
  logoutAllSessions,
  logoutSession,
} from "@/actions/categories/session";

interface Device {
  id: string;
  device?: string;
  browser?: string;
  active?: boolean;
  lastActive?: string;
}

const Security: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeDevices, setActiveDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const fetchActiveDevices = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const token = user.accessToken || user.token;
      const sessions = await getActiveSessions(token);
      setActiveDevices(sessions || []);
    } catch {
      setActiveDevices([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace("/");
      } else {
        fetchActiveDevices();
      }
    }
  }, [user, authLoading, router, fetchActiveDevices]);

  const handleLogout = () => {
    logout();
    setActiveDevices([]);
    window.location.href = "/";
  };

  const handleLogoutAllDevices = async () => {
    if (!confirm("Ma hubtaa inaad rabto inaad ka baxdo dhammaan qalabka?"))
      return;

    setIsLoggingOut(true);
    try {
      const token = user?.accessToken || user?.token;
      const logoutAllSuccess = await logoutAllSessions(token);
      logout();

      if (logoutAllSuccess) {
        alert("Waxaad ka baxday dhammaan qalabka");
        setActiveDevices([]);
        window.location.reload();
      } else {
        alert("Cilad ayaa dhacay marka lagu jarinayay dhammaan qalabka");
      }
    } catch {
      alert("Cilad ayaa dhacay marka lagu jarinayay dhammaan qalabka");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLogoutDevice = async (sessionId: string) => {
    try {
      const token = user?.accessToken || user?.token;
      const success = await logoutSession(sessionId, token);

      if (success) {
        setActiveDevices((prev) =>
          prev.filter((device) => device.id !== sessionId),
        );
      } else {
        alert("Failed to logout device");
      }
    } catch {
      alert("Cilad ayaa dhacay marka lagu jarinayay qalabka");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("so-SO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  const currentYear = new Date().getFullYear();
  const yearRange = currentYear === 2025 ? "2025" : `2025–${currentYear}`;

  if (authLoading || loading) return null;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Amniga</h1>
      <p className="mb-6">
        Ma ogtahay inaad ka sii adkeyn karto akoonkaaga? Boggan waxaad ka heli
        doontaa tallaabooyinka amniga ee kaa caawinaya inaad ku raaxaysato
        Karaadi si aamin ah.
      </p>

      <section className="mb-8 border rounded-lg p-6 shadow-sm bg-white">
        <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
          <h2 className="text-xl font-semibold">Qalabka aad ku gashay</h2>
          <div className="flex gap-2">
            <button
              onClick={handleLogout}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              Ka bax
            </button>
            <button
              onClick={handleLogoutAllDevices}
              disabled={isLoggingOut || activeDevices.length === 0}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? "Ka baxaya..." : "Ka bax dhammaan qalabka"}
            </button>
          </div>
        </div>

        {activeDevices.length > 0 ? (
          <ul className="space-y-4">
            {activeDevices.map((device) => (
              <li
                key={device.id}
                className="flex justify-between items-center border-b pb-3"
              >
                <div>
                  <strong>{device.device || "Unknown Device"}</strong> -{" "}
                  {device.browser || "Unknown Browser"}
                  {device.active && (
                    <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                      Hadda firfircoon
                    </span>
                  )}
                  {device.lastActive && (
                    <div className="text-sm text-gray-500 mt-1">
                      Ugu danbayn: {formatDate(device.lastActive)}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleLogoutDevice(device.id)}
                  className="text-red-600 underline hover:text-red-800 transition"
                >
                  Ka bax
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6 text-gray-500">
            Ma jiro qalab ku gashan
          </div>
        )}
      </section>

      <section className="text-sm text-gray-500">
        <p>Suuqa Fursadaha, Ganacsi, Noqo Macaamiil...</p>
        <p>
          © {yearRange} Karaadi AS. Karaadi waa qayb ka mid ah Vend. Vend ayaa
          mas&rsquo;uul ka ah xogtaada boggan. Akhri wax badan.
        </p>
      </section>
    </div>
  );
};

export default Security;
