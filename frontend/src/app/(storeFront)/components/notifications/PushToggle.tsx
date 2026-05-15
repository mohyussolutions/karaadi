"use client";

import { useRef } from "react";
import { useState, useEffect } from "react";
import { Bell, Loader2, X, Share } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePushNotifications } from "../hooks/usePushNotifications";

function isIOSWithoutPWA() {
  if (typeof window === "undefined") return false;
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (!ios) return false;
  const pwa = window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone === true;
  return !pwa;
}

function ConfirmModal({ title, body, onConfirm, onCancel }: { title: string; body: string; onConfirm: () => void; onCancel: () => void }) {
  const { t } = useTranslation();
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "flex-end", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.4)" }} onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "white", borderRadius: "1.25rem 1.25rem 0 0", width: "100%", maxWidth: "28rem", padding: "1.5rem", paddingBottom: "2.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <span style={{ fontWeight: 700, fontSize: "1rem", color: "#111827" }}>{title}</span>
          <button onClick={onCancel} style={{ color: "#9ca3af", background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={20} /></button>
        </div>
        <p style={{ fontSize: "0.875rem", color: "#4b5563", lineHeight: 1.6, marginBottom: "1.5rem" }}>{body}</p>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "0.875rem", backgroundColor: "#f3f4f6", color: "#374151", borderRadius: "0.75rem", fontWeight: 600, fontSize: "0.9rem", border: "none", cursor: "pointer" }}>
            {t("notifications.push.cancel")}
          </button>
          <button onClick={onConfirm} style={{ flex: 1, padding: "0.875rem", backgroundColor: "#2563eb", color: "white", borderRadius: "0.75rem", fontWeight: 600, fontSize: "0.9rem", border: "none", cursor: "pointer" }}>
            {t("notifications.push.yes")}
          </button>
        </div>
      </div>
    </div>
  );
}

function IOSModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "flex-end", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.4)" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "white", borderRadius: "1.25rem 1.25rem 0 0", width: "100%", maxWidth: "28rem", padding: "1.5rem", paddingBottom: "2.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <span style={{ fontWeight: 700, fontSize: "1rem", color: "#111827" }}>{t("notifications.push.iosModal.title")}</span>
          <button onClick={onClose} style={{ color: "#9ca3af", background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={20} /></button>
        </div>
        <p style={{ fontSize: "0.875rem", color: "#4b5563", lineHeight: 1.6, marginBottom: "1.25rem" }}>{t("notifications.push.iosModal.body")}</p>
        <ol style={{ fontSize: "0.875rem", color: "#374151", lineHeight: 2, paddingLeft: "1.25rem", marginBottom: "1.5rem" }}>
          <li>{t("notifications.push.iosModal.step1")} (<Share size={13} style={{ display: "inline", verticalAlign: "middle" }} />)</li>
          <li><strong>{t("notifications.push.iosModal.step2")}</strong></li>
          <li>{t("notifications.push.iosModal.step3")}</li>
          <li>{t("notifications.push.iosModal.step4")}</li>
        </ol>
        <button onClick={onClose} style={{ width: "100%", padding: "0.875rem", backgroundColor: "#2563eb", color: "white", borderRadius: "0.75rem", fontWeight: 600, fontSize: "0.9rem", border: "none", cursor: "pointer" }}>
          {t("notifications.push.yes")}
        </button>
      </div>
    </div>
  );
}

type Modal = "confirm-on" | "confirm-off" | "ios" | null;

export default function PushToggle() {
  const { t } = useTranslation();
  const { enabled, subscribed, permission, loading, subscribe, unsubscribe } = usePushNotifications();
  const [modal, setModal] = useState<Modal>(null);
  const iosRef = useRef<boolean | null>(null);
  const [showIOSHint, setShowIOSHint] = useState(false);

  useEffect(() => {
    iosRef.current = isIOSWithoutPWA();
  }, []);

  const isBlocked = permission === "denied";
  const isDisabled = loading || isBlocked;

  const handleClick = () => {
    if (isDisabled) return;
    if (iosRef.current) { setModal("ios"); return; }
    setModal(subscribed ? "confirm-off" : "confirm-on");
  };

  const subtitle =
    isBlocked ? t("notifications.push.blocked") :
    showIOSHint ? t("notifications.push.iphoneHint") :
    loading ? t(subscribed ? "notifications.push.turningOff" : "notifications.push.turningOn") :
    subscribed ? t("notifications.push.enabled") :
    t("notifications.push.disabled");

  return (
    <>
      {modal === "confirm-on" && (
        <ConfirmModal
          title={t("notifications.push.confirmOn.title")}
          body={t("notifications.push.confirmOn.body")}
          onConfirm={() => { setModal(null); subscribe(); }}
          onCancel={() => setModal(null)}
        />
      )}
      {modal === "confirm-off" && (
        <ConfirmModal
          title={t("notifications.push.confirmOff.title")}
          body={t("notifications.push.confirmOff.body")}
          onConfirm={() => { setModal(null); unsubscribe(); }}
          onCancel={() => setModal(null)}
        />
      )}
      {modal === "ios" && <IOSModal onClose={() => { setModal(null); setShowIOSHint(true); }} />}

      <div
        onClick={handleClick}
        style={{ cursor: isDisabled ? "default" : "pointer", userSelect: "none", opacity: isBlocked ? 0.5 : 1 }}
        className="flex items-center py-4 touch-manipulation active:opacity-70"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
          <Bell size={20} className={`flex-shrink-0 transition-colors ${enabled ? "text-blue-600" : "text-gray-400"}`} />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-gray-900 leading-snug">{t("notifications.push.title")}</span>
            <span className="text-xs text-gray-400 mt-0.5 leading-relaxed">{subtitle}</span>
          </div>
        </div>

        <div style={{ backgroundColor: enabled ? "#2563eb" : "#d1d5db", minWidth: "3.5rem", width: "3.5rem", height: "2rem", borderRadius: "9999px", position: "relative", flexShrink: 0, transition: "background-color 0.2s" }}>
          <span style={{ position: "absolute", top: "2px", left: "2px", width: "1.625rem", height: "1.625rem", borderRadius: "9999px", backgroundColor: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", transform: enabled ? "translateX(1.375rem)" : "translateX(0)", transition: "transform 0.2s" }}>
            {loading && <Loader2 size={11} className="animate-spin text-gray-400" />}
          </span>
        </div>
      </div>
    </>
  );
}
