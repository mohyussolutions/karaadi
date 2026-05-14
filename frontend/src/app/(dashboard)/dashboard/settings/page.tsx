"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import Loading from "@/app/ui/loading/Loading";
import { useRouter } from "next/navigation";
import { settingLinks } from "@/app/(links)/dashboardLinks/dashboardLinks";
import { SettingLink } from "@/app/utils/types/categoriestype";
import { useAuth } from "@/context/AuthContext";
import { bulkSeedLocations } from "@/actions/categories/geoAction";
import { regions as somaliaRegions, cities as somaliaCities } from "@/app/(storeFront)/components/shared/SomLocs/SomaliaRegionsSeeder";
import {
  FaMountain, FaCity, FaAnchor, FaSeedling, FaLeaf,
  FaSun, FaWater, FaTree, FaCampground,
  FaMapMarkerAlt, FaMapPin, FaDatabase,
} from "react-icons/fa";
import { GiDesert, GiHills } from "react-icons/gi";

const regionIcons: Record<string, React.ReactNode> = {
  "awdal":             <FaMountain className="text-indigo-500" />,
  "hamar":             <FaCity className="text-indigo-500" />,
  "bari":              <FaAnchor className="text-indigo-500" />,
  "bakool":            <FaSeedling className="text-indigo-500" />,
  "bay":               <FaLeaf className="text-indigo-500" />,
  "galguduud":         <GiDesert className="text-indigo-500" />,
  "gedo":              <GiHills className="text-indigo-500" />,
  "hiiraan":           <FaWater className="text-indigo-500" />,
  "jubada-dhexe":      <FaTree className="text-indigo-500" />,
  "jubada-hoose":      <FaTree className="text-indigo-500" />,
  "mudug":             <FaCampground className="text-indigo-500" />,
  "nugaal":            <FaMountain className="text-indigo-500" />,
  "sanaag":            <FaMapPin className="text-indigo-500" />,
  "shabeellaha-dhexe": <FaWater className="text-indigo-500" />,
  "shabeellaha-hoose": <FaWater className="text-indigo-500" />,
  "sool":              <FaMapMarkerAlt className="text-indigo-500" />,
  "togdheer":          <FaSun className="text-indigo-500" />,
  "wqdl":              <FaSun className="text-indigo-500" />,
};

interface SettingCardProps {
  title: string;
  items: string[];
  actionButton?: { text: string; type?: "visitors"; href?: string };
  onAction: (type: "visitors") => void;
  onNavigate: (href: string) => void;
}

function SettingCard({ title, items, actionButton, onAction, onNavigate }: SettingCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border dark:border-gray-700 flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">{title}</h2>
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
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  const handleSeedSomaliaData = async () => {
    setSeeding(true);
    setSeedResult(null);
    try {
      const result = await bulkSeedLocations(
        somaliaRegions.map((r) => ({ id: r.id, name: r.name })),
        somaliaCities.map((c) => ({ id: c.id, name: c.name, regionId: c.regionId })),
      );
      if (result.success) {
        setSeedResult(`✅ Seeded ${somaliaRegions.length} regions and ${somaliaCities.length} cities.`);
      } else {
        setSeedResult("❌ Seeding failed. Please try again.");
      }
    } catch {
      setSeedResult("❌ Seeding failed. Please try again.");
    } finally {
      setSeeding(false);
    }
  };

  if (!user) return <div className="w-full min-h-[60vh] flex items-center justify-center"><Loading /></div>;
  if (view === "visitors") return <VisitorManager onBack={() => setView("main")} />;

  return (
    <div className="w-full p-6 flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("adminTable.settingsTitle")}</h1>
        <p className="text-gray-500 mt-1">{t("adminTable.settingsSubtitle")}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaDatabase className="text-indigo-600 text-lg" />
            <div>
              <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">Somalia Regions & Cities</h2>
              <p className="text-xs text-gray-500">{somaliaRegions.length} regions · {somaliaCities.length} cities</p>
            </div>
          </div>
          <button
            onClick={handleSeedSomaliaData}
            disabled={seeding}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {seeding ? <><FaDatabase className="animate-spin" /> Seeding...</> : "Seed Data"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {somaliaRegions.map((r) => (
            <div key={r.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
              {regionIcons[r.id]}
              <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">{r.name}</span>
            </div>
          ))}
        </div>

        {seedResult && <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{seedResult}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingLinks.map((link: SettingLink) => (
          <SettingCard
            key={link.title}
            title={link.title}
            items={link.items}
            actionButton={link.actionButton}
            onAction={(type) => { if (type === "visitors") setView("visitors"); }}
            onNavigate={(href) => router.push(href)}
          />
        ))}
      </div>
    </div>
  );
}
