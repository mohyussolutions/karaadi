"use client";

import { SUPPORT_LINKS } from "@/app/(links)/supportLinks/supportLinks";
import { useState } from "react";
import { FiCalendar, FiBarChart2 } from "react-icons/fi";

function SupportCard({
  title,
  icon,
}: {
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200 hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col gap-4">
      <div className="text-gray-700">{icon}</div>
      <h2 className="text-xl font-semibold">Support {title}</h2>
      <p className="text-gray-500 text-sm">
        Manage {title.toLowerCase()} settings and data.
      </p>
    </div>
  );
}

function DateInput({ label, value, onChange }: any) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center bg-gray-100 px-3 py-2 rounded-xl gap-2">
        <FiCalendar className="text-gray-500" />
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent outline-none text-sm w-full"
        />
      </div>
    </div>
  );
}

export default function SupportPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  return (
    <div className="flex flex-col gap-12">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">
          Support Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          Tools to manage the platform effectively.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {SUPPORT_LINKS.map((link) => (
          <SupportCard
            key={link.label}
            title={link.label}
            icon={link.dashboardIcon || link.icon}
          />
        ))}
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <FiBarChart2 size={24} className="text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Filter Chart by Date
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DateInput label="From" value={from} onChange={setFrom} />
          <DateInput label="To" value={to} onChange={setTo} />
          <div className="flex items-end">
            <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition">
              Apply Filter
            </button>
          </div>
        </div>

        <div className="h-64 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500">
          Chart will appear here…
        </div>
      </div>
    </div>
  );
}
