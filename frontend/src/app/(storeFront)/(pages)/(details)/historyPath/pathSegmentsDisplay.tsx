"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
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
  "tractor-for-sale": "subcategories.farmEquipment.tractorForSale",
  "for-rent": "subcategories.realEstate.forRent",
  "for-sale": "subcategories.realEstate.forSale",
  "land-for-sale": "subcategories.realEstate.landForSale",
  "farm-for-sale": "subcategories.realEstate.farmForSale",
  commercial: "subcategories.realEstate.commercial",
  "antiques-and-art": "subcategories.marketplace.antiques",
  electronics: "subcategories.marketplace.electronics",
  "animal-and-supplies": "subcategories.marketplace.animalAndSupplies",
  "sports-and-outdoors": "subcategories.marketplace.sportsAndOutdoors",
  furniture: "subcategories.marketplace.furniture",
  "fashion-and-accessories": "subcategories.marketplace.fashion",
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
  const router = useRouter();

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const segments = pathname?.slice(1).split("/") || [];
  if (segments.length === 0) return null;

  const lastIndex = segments.length - 1;

  return (
    <nav aria-label="Breadcrumb" className="ml-2 mt-4 mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm sm:text-sm">
        <li>
          <Link
            href="/"
            onClick={(e) => { e.preventDefault(); router.push("/"); }}
            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 active:text-blue-900 font-medium cursor-pointer rounded px-2 py-1.5 sm:px-1 sm:py-0.5 hover:bg-blue-50 transition-colors min-h-[44px] sm:min-h-0 touch-manipulation"
          >
            <Home className="w-4 h-4 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
            <span className="text-base sm:text-sm">{t("nav.home", { defaultValue: "Home" })}</span>
          </Link>
        </li>

        {segments.map((segment, index) => {
          const path = "/" + segments.slice(0, index + 1).join("/");
          const key = SEGMENT_LABEL_KEYS[segment];
          const label = key
            ? t(key, { defaultValue: humanize(segment) })
            : humanize(decodeURIComponent(segment));
          const isLast = index === lastIndex;

          return (
            <React.Fragment key={index}>
              <li aria-hidden="true">
                <ChevronRight className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-gray-400 flex-shrink-0" />
              </li>
              <li>
                {isLast ? (
                  <span className="text-gray-500 font-medium px-2 py-1.5 sm:px-1 sm:py-0.5 capitalize text-base sm:text-sm" aria-current="page">
                    {label}
                  </span>
                ) : (
                  <Link
                    href={path}
                    className="text-blue-600 hover:text-blue-800 active:text-blue-900 font-medium capitalize cursor-pointer rounded px-2 py-1.5 sm:px-1 sm:py-0.5 hover:bg-blue-50 transition-colors text-base sm:text-sm min-h-[44px] sm:min-h-0 flex items-center touch-manipulation"
                  >
                    {label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
