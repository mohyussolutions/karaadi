"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function IOSInstallPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    const isIos = /iphone|ipad|ipod/i.test(ua);
    // Safari only — Chrome/Firefox on iOS have their own banners or don't support PWA install
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
      aria-label="Install app"
      className="fixed bottom-0 inset-x-0 z-50 animate-slide-up"
    >
      {/* Arrow pointing down toward the share button */}
      <div className="flex justify-center mb-[-1px]">
        <div className="w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45 translate-y-2" />
      </div>

      <div className="bg-white border-t border-gray-200 shadow-2xl rounded-t-2xl p-5 pb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpg"
              alt="Karaadi"
              width={48}
              height={48}
              className="rounded-xl object-cover"
            />
            <div>
              <p className="font-semibold text-gray-900">Install Karaadi</p>
              <p className="text-sm text-gray-500">Add to your Home Screen</p>
            </div>
          </div>
          <button
            onClick={dismiss}
            aria-label="Dismiss"
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <ol className="space-y-3 text-sm text-gray-700">
          <li className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
              1
            </span>
            <span>
              Tap the{" "}
              <span className="inline-flex items-center gap-1 font-medium">
                {/* iOS Share icon SVG */}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-500"
                >
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
                Share
              </span>{" "}
              button at the bottom of Safari
            </span>
          </li>
          <li className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
              2
            </span>
            <span>
              Scroll down and tap{" "}
              <strong className="text-gray-900">&ldquo;Add to Home Screen&rdquo;</strong>
            </span>
          </li>
          <li className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
              3
            </span>
            <span>
              Tap <strong className="text-gray-900">&ldquo;Add&rdquo;</strong> in the top-right
            </span>
          </li>
        </ol>
      </div>
    </div>
  );
}
