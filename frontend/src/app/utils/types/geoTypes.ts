export interface City {
  id: string;
  name: string;
  code?: string;
  regionId: string;
  isActive?: boolean;
}
export interface Region {
  id: string;
  name: string;
  code?: string;
  cities?: City[];
}

export interface GeoStats {
  totalRegions: number;
  totalCities: number;
  totalDistricts: number;
}
