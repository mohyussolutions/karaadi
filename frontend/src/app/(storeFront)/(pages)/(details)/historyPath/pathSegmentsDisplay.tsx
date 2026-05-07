"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/app/(storeFront)/components/hooks/useLanguage";

const SEGMENT_LABEL_KEYS: Record<string, string> = {
  "real-estate": "categories.RealEstate",
  marketplace: "categories.Marketplace",
  cars: "categories.Cars",
  boats: "categories.Boats",
  motorcycles: "categories.Motorcycles",
  farmequipment: "categories.Farmequipment",
  "boats-for-sale": "subcategories.boats.boatsForSale",
  "boats-for-rent": "subcategories.boats.boatsForRent",
  "boat-engines-for-sale": "subcategories.boats.boatEnginesForSale",
  "boat-parts": "subcategories.boats.boatParts",
  "for-rent": "subcategories.realEstate.forRent",
  "for-sale": "subcategories.realEstate.forSale",
  "land-for-sale": "subcategories.realEstate.landForSale",
  "farm-for-sale": "subcategories.realEstate.farmForSale",
  commercial: "subcategories.realEstate.commercial",
};

function humanize(segment: string) {
  return segment
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export default function PathSegmentsDisplay() {
  const { t } = useTranslation();
  useLanguage();
  const pathname = usePathname();

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const segments = pathname?.slice(1).split("/") || [];
  if (segments.length === 0) return null;

  return (
    <div className="ml-2 mt-4">
      <div className="flex flex-wrap gap-1 items-center text-sm font-mono text-blue-600 mb-6">
        <Link href="/" className="hover:underline capitalize">
          {t("nav.home", { defaultValue: "Home" })}
        </Link>
        {segments.map((segment, index) => {
          const path = "/" + segments.slice(0, index + 1).join("/");
          const key = SEGMENT_LABEL_KEYS[segment];
          const label = key
            ? t(key, { defaultValue: humanize(segment) })
            : humanize(decodeURIComponent(segment));

          return (
            <React.Fragment key={index}>
              <span>/</span>
              <Link
                href={path}
                className="hover:underline capitalize transition-colors duration-200"
              >
                {label}
              </Link>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
