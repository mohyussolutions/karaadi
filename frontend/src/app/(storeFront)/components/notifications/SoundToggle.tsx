"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { isSoundEnabled, setSoundEnabled, playNotificationSound } from "./mobile/sound";

export default function SoundToggle() {
  const [enabled, setEnabled] = useState(isSoundEnabled);

  const toggle = () => {
    const next = !enabled;
    setSoundEnabled(next);
    setEnabled(next);
    if (next) playNotificationSound();
  };

  return (
    <div
      onClick={toggle}
      style={{ cursor: "pointer", userSelect: "none" }}
      className="flex items-center py-4 touch-manipulation active:opacity-70"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
        {enabled ? (
          <Volume2 size={20} className="flex-shrink-0 text-blue-600" />
        ) : (
          <VolumeX size={20} className="flex-shrink-0 text-gray-400" />
        )}
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-gray-900 leading-snug">
            Notification Sound
          </span>
          <span className="text-xs text-gray-400 mt-0.5 leading-relaxed">
            {enabled ? "Sound plays when a message arrives" : "Sound is off"}
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
            transform: enabled ? "translateX(1.375rem)" : "translateX(0)",
            transition: "transform 0.2s",
          }}
        />
      </div>
    </div>
  );
}
