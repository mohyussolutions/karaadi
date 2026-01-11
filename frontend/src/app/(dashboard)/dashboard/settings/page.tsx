"use client";

import React, { useState } from "react";
import VisitorManager from "./deleteVisitors";
import { useRouter } from "next/navigation";
import { settingLinks } from "@/app/(links)/dashboardLinks/categories";
import { SettingLink } from "@/app/utils/types/categoriestype";

interface SettingCardProps {
  title: string;
  items: string[];
  actionButton?: {
    text: string;
    type?: "visitors";
    href?: string;
  };
  onAction: (type: "visitors") => void;
  onNavigate: (href: string) => void;
}

function SettingCard({
  title,
  items,
  actionButton,
  onAction,
  onNavigate,
}: SettingCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
        <ul className="space-y-2 text-gray-600 mb-4">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start">
              <span className="mt-1 mr-2 h-2 w-2 bg-indigo-500 rounded-full" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      {actionButton && (
        <button
          onClick={() => {
            if (actionButton.href) onNavigate(actionButton.href);
            if (actionButton.type) onAction(actionButton.type);
          }}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          {actionButton.text}
        </button>
      )}
    </div>
  );
}

export default function Settings() {
  const [view, setView] = useState<"main" | "visitors">("main");
  const router = useRouter();

  const handleAction = (type: "visitors") => {
    if (type === "visitors") setView("visitors");
  };

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  if (view === "visitors") {
    return <VisitorManager onBack={() => setView("main")} />;
  }

  return (
    <div className="w-full p-6 flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">
          Manage essential marketplace settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {settingLinks.map((link: SettingLink) => (
          <SettingCard
            key={link.title}
            title={link.title}
            items={link.items}
            actionButton={link.actionButton}
            onAction={handleAction}
            onNavigate={handleNavigate}
          />
        ))}
      </div>
    </div>
  );
}
