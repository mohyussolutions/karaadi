"use client";

import { useEffect } from "react";
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";
import { useAppDispatch, useAppSelector } from "@/store/slices/hooks/hooks";
import {
  toggleSound,
  hydrateFromStorage,
} from "@/store/slices/reducers/notificationSettingsSlice";
import { playNotificationSound, initSound } from "./mobile/sound";

export default function SoundToggle() {
  const dispatch = useAppDispatch();
  const soundEnabled = useAppSelector(
    (s) => s.notificationSettings.soundEnabled,
  );

  useEffect(() => {
    dispatch(hydrateFromStorage());
    initSound();
  }, [dispatch]);

  const handleToggle = () => {
    dispatch(toggleSound());
    const willBeEnabled = !soundEnabled;
    if (willBeEnabled) playNotificationSound();
  };

  return (
    <div
      onClick={handleToggle}
      className="flex items-center py-4 cursor-pointer touch-manipulation active:opacity-70 select-none"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
        {soundEnabled ? (
          <HiVolumeUp size={20} className="flex-shrink-0 text-blue-600" />
        ) : (
          <HiVolumeOff size={20} className="flex-shrink-0 text-gray-400" />
        )}
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-gray-900 leading-snug">
            Notification Sound
          </span>
          <span className="text-xs text-gray-400 mt-0.5 leading-relaxed">
            {soundEnabled
              ? "Sound plays when a message arrives"
              : "Sound is off"}
          </span>
        </div>
      </div>

      <div
        className="flex-shrink-0 transition-colors duration-200"
        style={{
          backgroundColor: soundEnabled ? "#2563eb" : "#d1d5db",
          minWidth: "3.5rem",
          width: "3.5rem",
          height: "2rem",
          borderRadius: "9999px",
          position: "relative",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            left: 2,
            width: "1.625rem",
            height: "1.625rem",
            borderRadius: "9999px",
            backgroundColor: "white",
            boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
            transform: soundEnabled ? "translateX(1.375rem)" : "translateX(0)",
            transition: "transform 0.2s",
          }}
        />
      </div>
    </div>
  );
}
