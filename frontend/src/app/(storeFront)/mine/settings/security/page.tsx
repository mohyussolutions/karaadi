"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout, verifySession } from "@/actions/core/authAction";
import {
  getActiveSessions,
  logoutAllSessions,
  logoutSession,
} from "@/actions/common/session";

const Security: React.FC = () => {
  const [activeDevices, setActiveDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = () => {
      const hasAuthCookie =
        document.cookie.includes("token=") ||
        document.cookie.includes("auth-token=") ||
        document.cookie.includes("session=");

      if (!hasAuthCookie) {
        router.replace("/");
        return;
      }

      const verifyAndFetch = async () => {
        const session = await verifySession();
        if (!session) {
          router.replace("/");
          return;
        }
        fetchActiveDevices();
      };
      verifyAndFetch();
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setActiveDevices([]);
      window.location.href = "/";
    } catch {
      alert("Cilad ayaa dhacday markaad ka baxaysay");
    }
  };

  const handleLogoutAllDevices = async () => {
    if (!confirm("Ma hubtaa inaad rabto inaad ka baxdo dhammaan qalabka?")) {
      return;
    }

    setIsLoggingOut(true);
    try {
      const session = await verifySession();
      const accessToken = session?.accessToken || session?.token;

      const logoutAllSuccess = await logoutAllSessions(accessToken);
      await logout(accessToken);

      if (logoutAllSuccess) {
        alert("Waxaad ka baxday dhammaan qalabka");
        setActiveDevices([]);
        window.location.href = "/";
      } else {
        alert("Cilad ayaa dhacay marka lagu jarinayay dhammaan qalabka");
      }
    } catch (error) {
      alert("Cilad ayaa dhacay marka lagu jarinayay dhammaan qalabka");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const fetchActiveDevices = async () => {
    try {
      setLoading(true);
      const session = await verifySession();

      if (session) {
        const accessToken = session.accessToken || session.token;
        const sessions = await getActiveSessions(accessToken);
        setActiveDevices(sessions);
      } else {
        setActiveDevices([]);
      }
    } catch (error) {
      setActiveDevices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutDevice = async (sessionId: string) => {
    try {
      const session = await verifySession();
      if (!session) {
        alert("Ma jiro session firfircoon");
        return;
      }

      const accessToken = session.accessToken || session.token;
      const success = await logoutSession(sessionId, accessToken);

      if (success) {
        setActiveDevices((prev) =>
          prev.filter((device) => device.id !== sessionId),
        );
      } else {
        alert("Failed to logout device");
      }
    } catch (error) {
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
    } catch (error) {
      return "";
    }
  };

  const currentYear = new Date().getFullYear();
  const yearRange = currentYear === 2025 ? "2025" : `2025–${currentYear}`;

  if (loading) return null;

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
                key={device.id || device.device}
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
                  onClick={() => handleLogoutDevice(device.id || device.device)}
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
          mas'uul ka ah xogtaada boggan. Akhri wax badan.
        </p>
      </section>
    </div>
  );
};

export default Security;
