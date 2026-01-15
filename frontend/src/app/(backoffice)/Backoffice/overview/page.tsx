import React from "react";
import linksForManagment from "@/app/(links)/management/links/linksForManagment";

export default function OverviewPage() {
  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold mb-4">Overview</h2>
      <p className="text-gray-600 mb-4">Quick access to management sections:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {linksForManagment.map((l) => (
          <div key={l.id} className="p-4 bg-white rounded shadow-sm">
            <a href={l.href} className="font-medium text-blue-600">
              {l.name}
            </a>
            <div className="text-sm text-gray-500 mt-1">{l.id}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
