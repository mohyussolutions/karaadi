"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import Loading from "@/app/ui/loading/Loading";
import { useRouter } from "next/navigation";
import { settingLinks } from "@/app/(links)/dashboardLinks/dashboardLinks";
import { SettingLink } from "@/app/utils/types/categoriestype";
import { useAuth } from "@/context/AuthContext";
import { addRegion, addCity } from "@/actions/categories/geoAction";
import { regions as somaliaRegions, cities as somaliaCities } from "@/app/(storeFront)/components/shared/SomLocs/SomaliaRegionsSeeder";

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
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border dark:border-gray-700 flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
        <ul className="space-y-2 text-gray-600 mb-4">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start text-sm">
              <span className="mt-1.5 mr-2 h-1.5 w-1.5 bg-indigo-500 rounded-full shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      {actionButton && (
        <button
          onClick={() => {
            if (actionButton.href) return onNavigate(actionButton.href);
            if (actionButton.type) return onAction(actionButton.type);
          }}
          className="w-full px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {actionButton.text}
        </button>
      )}
    </div>
  );
}

const VisitorManager = dynamic(() => import("./deleteVisitors"), {
  ssr: false,
  loading: () => <Loading />,
});

export default function Settings() {
  const { t } = useTranslation();
  const [view, setView] = useState<"main" | "visitors">("main");
  const { user } = useAuth();
  const initializing = !user;
  const router = useRouter();

  const handleAction = (type: "visitors") => {
    if (type === "visitors") setView("visitors");
  };

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  const handleSeedSomaliaData = async () => {
    setSeeding(true);
    setSeedResult(null);
    try {
      for (const region of somaliaRegions) {
        await addRegion({ id: region.id, name: region.name }).catch(() => {});
      }
      for (const city of somaliaCities) {
        await addCity({ name: city.name, regionId: city.regionId }).catch(() => {});
      }
      setSeedResult(`✅ Seeded ${somaliaRegions.length} regions and ${somaliaCities.length} cities successfully.`);
    } catch {
      setSeedResult("❌ Seeding failed. Some data may have been added.");
    } finally {
      setSeeding(false);
    }
  };

  if (initializing)
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <Loading />
      </div>
    );

  if (view === "visitors") {
    return <VisitorManager onBack={() => setView("main")} />;
  }

  return (
    <div className="w-full p-6 flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("adminTable.settingsTitle")}</h1>
        <p className="text-gray-500 mt-1">{t("adminTable.settingsSubtitle")}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">Somalia Regions & Cities</h2>
            <p className="text-xs text-gray-500 mt-0.5">{somaliaRegions.length} regions · {somaliaCities.length} cities</p>
          </div>
          <button
            onClick={handleSeedSomaliaData}
            disabled={seeding}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {seeding ? (
              <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Seeding...</>
            ) : "Seed Data"}
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {somaliaRegions.map((r) => (
            <span key={r.id} className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium">
              {r.icon} {r.name}
            </span>
          ))}
        </div>
        {seedResult && <p className="text-xs font-medium text-gray-600">{seedResult}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
