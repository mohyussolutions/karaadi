"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { useLanguage } from "@/app/(storeFront)/components/hooks/useLanguage";

type Label = { en: string; so: string };

export const SEGMENT_LABEL_KEYS: Record<string, Label> = {
  "real-estate":          { en: "Real Estate",          so: "hantida maguurtada ah" },
  marketplace:            { en: "Marketplace",           so: "Suuq" },
  cars:                   { en: "Cars",                  so: "Gawaarida" },
  boats:                  { en: "Boats",                 so: "Doomaha" },
  motorcycles:            { en: "Motorcycles",           so: "Mootooyin" },
  farmequipment:          { en: "Farm Equipment",        so: "Qalabka Beeraha" },
  "farm-equipment":       { en: "Farm Equipment",        so: "Qalabka Beeraha" },
  jobs:                   { en: "Jobs",                  so: "Shaqo" },
  vehicles:               { en: "Vehicles",              so: "Gawaarida" },
  "item-details":         { en: "Details",               so: "Faahfaahinta" },

  "boats-for-sale":       { en: "Boats For Sale",        so: "Doomaha Iibka" },
  "boats-for-rent":       { en: "Boats For Rent",        so: "Doomaha Kirada" },
  "boat-engines-for-sale":{ en: "Boat Engines For Sale", so: "Matoorada Doomaha" },
  "boat-parts":           { en: "Boat Parts",            so: "Qaybaha Doomaha" },

  "for-rent":             { en: "For Rent",              so: "Kirada" },
  "for-sale":             { en: "For Sale",              so: "Iibka" },
  "land-for-sale":        { en: "Land For Sale",         so: "Dhulka" },
  "farm-for-sale":        { en: "Farm For Sale",         so: "Beeraha" },
  commercial:             { en: "Commercial",            so: "Ganacsiga" },

  "antiques-and-art":     { en: "Antiques & Art",        so: "Qadiimi & Farshaxan" },
  antiques:               { en: "Antiques & Art",        so: "Qadiimi & Farshaxan" },
  electronics:            { en: "Electronics",           so: "Elektarooniga" },
  "animal-and-supplies":  { en: "Animal & Supplies",     so: "Xayawaan & Agab" },
  animals:                { en: "Animal & Supplies",     so: "Xayawaan & Agab" },
  "sports-and-outdoors":  { en: "Sports & Outdoors",     so: "Ciyaaraha & Dibadda" },
  sports:                 { en: "Sports & Outdoors",     so: "Ciyaaraha & Dibadda" },
  "furniture-and-interior":{ en: "Furniture",            so: "Alaabta Guriga" },
  furniture:              { en: "Furniture",             so: "Alaabta Guriga" },
  "fashion-and-accessories":{ en: "Fashion",             so: "Dharka & Boorsooyinka" },
  fashion:                { en: "Fashion",               so: "Dharka & Boorsooyinka" },

  "cars-for-sale":        { en: "Cars For Sale",         so: "Gawaari Iibka" },
  "lease-cars":           { en: "Lease Cars",            so: "Gawaari Kirada" },
  trailers:               { en: "Trailers",              so: "Rimoor" },
  "car-parts":            { en: "Car Parts",             so: "Qaybaha Baabuurta" },
  truck:                  { en: "Truck",                 so: "Xamuulka" },
  trucks:                 { en: "Trucks",                so: "Xamuulka" },
  "electric-cars":        { en: "Electric Cars",         so: "Korontada" },
  electric:               { en: "Electric Cars",         so: "Korontada" },
  buses:                  { en: "Buses",                 so: "Basaska" },
  lease:                  { en: "Lease Cars",            so: "Gawaari Kirada" },
  parts:                  { en: "Parts",                 so: "Qaybaha" },

  "tractor-for-sale":     { en: "Tractor For Sale",      so: "Cagaf Iibka" },
  tractor:                { en: "Tractor",               so: "Cagaf" },
  "farm-tools":           { en: "Farm Tools",            so: "Qalabka Beeraha" },
  tools:                  { en: "Farm Tools",            so: "Qalabka Beeraha" },
  "fertilizer-spreader":  { en: "Fertilizer Spreader",   so: "Faafiyaha Bacriminta" },
  fertilizer:             { en: "Fertilizer Spreader",   so: "Faafiyaha Bacriminta" },
  "grain-harvester":      { en: "Grain Harvester",       so: "Makiinada Goosashada" },
  harvester:              { en: "Grain Harvester",       so: "Makiinada Goosashada" },
  plow:                   { en: "Plow",                  so: "Qalabka Qodista" },
  "irrigation-system":    { en: "Irrigation System",     so: "Nidaamka Waraabka" },
  irrigation:             { en: "Irrigation System",     so: "Nidaamka Waraabka" },

  "spare-parts":          { en: "Spare Parts",           so: "Qaybaha" },
  other:                  { en: "Other",                 so: "Kale" },

  "full-time":            { en: "Full-Time",             so: "Waqti Buuxa" },
  "part-time":            { en: "Part-Time",             so: "Waqti Kooban" },
  physical:               { en: "Physical Labor",        so: "Shaqo Jidheed" },
  internship:             { en: "Internship",            so: "Tababar" },
  remote:                 { en: "Remote",                so: "Shaqo Fog" },
  tech:                   { en: "IT & Tech",             so: "Tiknooloji" },
  finance:                { en: "Finance",               so: "Maaliyadda" },
  education:              { en: "Education",             so: "Waxbarashada" },
  healthcare:             { en: "Healthcare",            so: "Caafimaadka" },
  hospitality:            { en: "Hospitality",           so: "Marti-qaadashada" },
};

function humanize(segment: string) {
  return segment
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

function isId(segment: string) {
  return (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment) ||
    /^[0-9a-f]{24}$/i.test(segment)
  );
}

export default function PathSegmentsDisplay() {
  const { language } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const segments = (pathname?.slice(1).split("/") ?? []).filter(
    (s) => s && !isId(s),
  );
  if (segments.length === 0) return null;

  const lastIndex = segments.length - 1;

  return (
    <nav aria-label="Breadcrumb" className="mt-4 mb-6 overflow-x-auto scrollbar-hide">
      <ol className="flex flex-nowrap items-center gap-1 text-sm whitespace-nowrap px-2">
        <li>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 active:text-blue-900 font-medium cursor-pointer rounded px-2 py-1.5 sm:px-1 sm:py-0.5 hover:bg-blue-50 transition-colors min-h-[44px] sm:min-h-0 touch-manipulation select-none"
          >
            <Home className="w-4 h-4 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
            <span className="text-base sm:text-sm">
              {language === "so" ? "Hoyga" : "Home"}
            </span>
          </button>
        </li>

        {segments.map((segment, index) => {
          const path = "/" + segments.slice(0, index + 1).join("/");
          const entry = SEGMENT_LABEL_KEYS[segment];
          const label = entry
            ? (language === "so" ? entry.so : entry.en)
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
                  <button
                    type="button"
                    onClick={() => router.push(path)}
                    className="text-blue-600 hover:text-blue-800 active:text-blue-900 font-medium capitalize cursor-pointer rounded px-2 py-1.5 sm:px-1 sm:py-0.5 hover:bg-blue-50 transition-colors text-base sm:text-sm min-h-[44px] sm:min-h-0 flex items-center touch-manipulation select-none"
                  >
                    {label}
                  </button>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
