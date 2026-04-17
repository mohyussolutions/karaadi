import {
  getRegionData,
  getCityData,
} from "@/actions/categories/RegionsAndCityCharts";
import { RegionsAndCityCharts } from "./RegionsAndCityCharts";

export default async function RegionChartsLoader() {
  const [regionData, cityData] = await Promise.all([
    getRegionData(),
    getCityData(),
  ]);
  return <RegionsAndCityCharts regionData={regionData} cityData={cityData} />;
}
