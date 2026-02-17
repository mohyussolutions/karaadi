import { fetchAgencies } from "@/actions/categories/actionsAgency";
import { getBoats } from "@/actions/categories/boatActions";
import { getCars } from "@/actions/categories/carActions";
import { getJobs } from "@/actions/categories/jobActions";
import { getMarketplaceItems } from "@/actions/categories/marketplaceActions";
import { getMotorcycles } from "@/actions/categories/motorcycleActions";
import { getRealEstateListings } from "@/actions/categories/realEstateActions";
import { getTraktors } from "@/actions/categories/tractorActions";
import HomeContent from "../Filters/HomeContent";
import Agencies from "@/app/(agencies)/agencies/page";
import RecomendLinks from "../Recommendations/recomendLinks";

export async function DataFeed() {
  const [
    boats,
    cars,
    jobs,
    marketplace,
    motorcycles,
    realEstate,
    tractors,
    agencies,
  ] = await Promise.all([
    getBoats(),
    getCars(),
    getJobs(),
    getMarketplaceItems(),
    getMotorcycles(),
    getRealEstateListings(),
    getTraktors(),
    fetchAgencies(),
  ]);

  const initialData = {
    boats,
    cars,
    jobs,
    marketplace,
    motorcycles,
    realEstate,
    tractors,
  };

  return (
    <HomeContent initialData={initialData}>
      <Agencies initialAgencies={agencies} />
      <RecomendLinks />
    </HomeContent>
  );
}
