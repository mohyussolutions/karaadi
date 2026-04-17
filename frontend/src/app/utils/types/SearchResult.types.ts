import { SearchResult } from "./search-result.types";

export interface SearchResultTypes extends SearchResult {
  id?: string;
  city?: string;
  region?: string;
  source?: string;
  make?: string;
  brand?: string;
  vehicleModel?: string;
  boatModel?: string;
  modelName?: string;
  bedrooms?: number;
  squareFeet?: number;
  company?: string;
  salary?: number;
  hours?: number;
  enginePower?: string;
  mainCategory?: string;
  category?: string;
  subcategory?: string[];
  [key: string]: unknown;
}
