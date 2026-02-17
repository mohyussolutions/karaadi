"use client";

import TotalAdvertisement from "../categories/Advertisement/TotalAdvertisement";
import TotalAgencies from "../categories/Agencies/totoalAgencies";
import TotalCities from "../categories/geo/totalCities";
import TotalRegions from "../categories/geo/totalRegion";
import TotalSubscriptionsCard from "../categories/subscription/TotalSubscriptionsCard";
import ActiveListings from "../categories/totalsOfEach/ActiveListings";
import ChatsActive from "../categories/totalsOfEach/ChatsActive";
import TotalFees from "../categories/totalsOfEach/TotalFees";
import TotalRevenue from "../categories/totalsOfEach/TotalRevenue";
import TotalTax from "../categories/totalsOfEach/TotalTax";
import TotalTransactions from "../categories/totalsOfEach/TotalTransactions";
import TotalUsers from "../categories/totalsOfEach/TotalUsers";
import TotalVisited from "../categories/totalsOfEach/TotalVisited";
import SupportSummaryCard from "../Massages/totalSupportSummaryCard";

export const StatsCards: React.FC = () => {
  return (
    <div className="grid gap-7 sm:gap-8 md:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 transition-all duration-300">
      <TotalUsers />
      <TotalTransactions />
      <TotalRevenue />
      <TotalFees />
      <TotalTax />
      <ActiveListings />
      <ChatsActive />
      <TotalVisited />
      <SupportSummaryCard />
      <TotalAdvertisement />
      <TotalSubscriptionsCard />
      <TotalAgencies />
      <TotalRegions />
      <TotalCities />
    </div>
  );
};
