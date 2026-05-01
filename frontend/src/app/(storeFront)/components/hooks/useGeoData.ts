"use client";

import { useEffect, useState } from "react";
import { getAllRegions } from "@/actions/categories/geoAction";

export interface GeoCity {
  id: string;
  name: string;
  regionId: string;
}

export interface GeoRegion {
  id: string;
  name: string;
  cities?: GeoCity[];
}

export function useGeoData() {
  const [regions, setRegions] = useState<GeoRegion[]>([]);
  const [cities, setCities] = useState<GeoCity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllRegions()
      .then((regs: any[]) => {
        setRegions(regs);
        setCities(regs.flatMap((r) => r.cities ?? []));
      })
      .finally(() => setLoading(false));
  }, []);

  return { regions, cities, loading, updateCities: setCities };
}
