"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function IOSInstallPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    const isIos = /iphone|ipad|ipod/i.test(ua);
    const isSafari = /safari/i.test(ua) && !/chrome|crios|fxios/i.test(ua);
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    const dismissed = localStorage.getItem("ios-install-dismissed");

    if (isIos && isSafari && !isStandalone && !dismissed) {
      const t = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem("ios-install-dismissed", "1");
  };

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Install Karaadi"
      className="fixed inset-x-0 bottom-0 z-50 animate-slide-up"
    >
      <div
        className="bg-white border-t border-gray-200 shadow-2xl rounded-t-2xl px-5 pt-4"
        style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
      >
        {/* Drag handle */}
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpg"
              alt="Karaadi"
              width={44}
              height={44}
              className="rounded-xl object-cover"
            />
            <div>
              <p className="font-bold text-gray-900 text-base leading-snug">Install Karaadi</p>
              <p className="text-xs text-gray-500 mt-0.5">Add to your Home Screen</p>
            </div>
          </div>
          <button
            onClick={dismiss}
            aria-label="Dismiss"
            className="p-1.5 text-gray-400 hover:text-gray-600 active:opacity-70"
          >
            <X size={18} />
          </button>
        </div>

        <ol className="space-y-3.5 text-sm text-gray-700 mb-5">
          <li className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
              1
            </span>
            <span className="leading-snug">
              Tap the{" "}
              <span className="inline-flex items-center gap-1 font-semibold text-blue-600">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
                Share
              </span>{" "}
              button in Safari&apos;s toolbar
            </span>
          </li>
          <li className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
              2
            </span>
            <span className="leading-snug">
              Scroll down and tap <strong className="text-gray-900">&ldquo;Add to Home Screen&rdquo;</strong>
            </span>
          </li>
          <li className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
              3
            </span>
            <span className="leading-snug">
              Tap <strong className="text-gray-900">&ldquo;Add&rdquo;</strong> in the top-right corner
            </span>
          </li>
        </ol>

        {/* Arrow pointing toward Safari's bottom toolbar */}
        <div className="flex justify-center mb-1">
          <div className="flex flex-col items-center gap-0.5">
            <p className="text-[10px] text-gray-400 tracking-wide uppercase">Share button is here</p>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
