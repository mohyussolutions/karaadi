"use client";
export const dynamic = "force-dynamic";

import React from "react";
import { useTranslation } from "react-i18next";

function Terms() {
  const { t } = useTranslation();
  const raw = t("terms.items", { returnObjects: true }) as unknown;
  const items: string[] = Array.isArray(raw)
    ? raw.map((v) => String(v))
    : typeof raw === "string" && raw.length
      ? [raw]
      : [t("terms.description", "Terms and conditions for using the site.")];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold">{t("terms.title")}</h1>
      </div>

      <div className="space-y-3">
        {items.map((it, idx) => (
          <div className="bg-white p-4 border rounded" key={idx}>
            <p className="font-medium">{it}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Terms;
