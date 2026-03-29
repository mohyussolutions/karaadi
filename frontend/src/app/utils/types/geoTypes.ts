export interface Region {
  id: string;
  name: string;
  so?: string;
  isActive: boolean;
  cities?: City[];
}

export interface City {
  id: string;
  name: string;
  so?: string;
  regionId: string;
  isActive: boolean;
}

export interface GeoStats {
  totalRegions: number;
  totalCities: number;
}
