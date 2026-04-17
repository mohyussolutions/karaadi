"use client";

import React, { useEffect, useState } from "react";
import { getTotalUsersAction } from "@/actions/categories/usersAction";
import { fetchTotalVisitors } from "@/actions/categories/visitorActions";
import { getAdStats } from "@/actions/categories/advertisementService";
import { getTotalSubscriptions } from "@/actions/categories/subscriptionsActions";
import { getAgencyStats } from "@/actions/categories/actionsAgency";
import {
  getTotalOfRegions,
  getTotalOfCities,
} from "@/actions/categories/geoAction";
import { getTicketStats } from "@/actions/categories/contactMeAction";

interface CardProps {
  label: string;
  value: number | null;
}

const StatCard: React.FC<CardProps> = ({ label, value }) => (
  <div className="p-6 bg-white rounded-xl shadow-md border w-full min-h-[140px] flex flex-col justify-center">
    <h2 className="text-lg font-semibold text-gray-700">{label}</h2>
    <div className="h-[48px] flex items-center mt-3">
      {value === null ? (
        <div className="h-8 bg-gray-100 rounded w-1/2 animate-pulse" />
      ) : (
        <p className="text-3xl font-bold text-green-600">
          {value.toLocaleString()}
        </p>
      )}
    </div>
  </div>
);

export const StatsCards: React.FC = () => {
  const [stats, setStats] = useState<{
    users: number | null;
    visitors: number | null;
    messages: number | null;
    ads: number | null;
    subscriptions: number | null;
    agencies: number | null;
    regions: number | null;
    cities: number | null;
  }>({
    users: null,
    visitors: null,
    messages: null,
    ads: null,
    subscriptions: null,
    agencies: null,
    regions: null,
    cities: null,
  });

  useEffect(() => {
    const load = async () => {
      const [users, visitors, messages, ads, subs, agencies, regions, cities] =
        await Promise.allSettled([
          getTotalUsersAction(),
          fetchTotalVisitors(),
          getTicketStats(),
          getAdStats(),
          getTotalSubscriptions(),
          getAgencyStats(),
          getTotalOfRegions(),
          getTotalOfCities(),
        ]);

      setStats({
        users:
          users.status === "fulfilled" ? ((users.value as any)?.data ?? 0) : 0,
        visitors: visitors.status === "fulfilled" ? (visitors.value ?? 0) : 0,
        messages:
          messages.status === "fulfilled"
            ? ((messages.value as any)?.today ??
              (messages.value as any)?.total ??
              0)
            : 0,
        ads:
          ads.status === "fulfilled" ? ((ads.value as any)?.totalAds ?? 0) : 0,
        subscriptions:
          subs.status === "fulfilled"
            ? ((subs.value as any)?.total ?? (subs.value as any)?.count ?? 0)
            : 0,
        agencies:
          agencies.status === "fulfilled"
            ? ((agencies.value as any)?.total ?? 0)
            : 0,
        regions:
          regions.status === "fulfilled"
            ? typeof regions.value === "number"
              ? regions.value
              : 0
            : 0,
        cities:
          cities.status === "fulfilled"
            ? typeof cities.value === "number"
              ? cities.value
              : 0
            : 0,
      });
    };

    load();
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 md:gap-6 lg:gap-8 w-full max-w-full px-2 py-4">
      <StatCard label="Total Users" value={stats.users} />
      <StatCard label="Total Visited" value={stats.visitors} />
      <StatCard label="Messages" value={stats.messages} />
      <StatCard label="Advertisements" value={stats.ads} />
      <StatCard label="Subscriptions" value={stats.subscriptions} />
      <StatCard label="Agencies" value={stats.agencies} />
      <StatCard label="Regions" value={stats.regions} />
      <StatCard label="Cities" value={stats.cities} />
    </div>
  );
};
