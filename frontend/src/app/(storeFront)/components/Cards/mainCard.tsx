"use client";

import React, { useState } from "react";

import Loading from "../shared/Loading/Loading";
import SeeEmore from "../shared/search/SeeEmore";
import RealEstateCard from "./RealEstateCard";
import VehicleCard from "./VehicleCard";
import CardItem from "./CardItem";
import { useGetMarketplaceItemsQuery } from "../../store/slices/marketplaceSlice";
import { useGetRealEstateItemsQuery } from "../../store/slices/realtStateSlice";
import { useGetCarsQuery } from "../../store/slices/carsSlice";
import { useGetBoatsQuery } from "../../store/slices/boatsSlice";
import { useGetMotorcyclesQuery } from "../../store/slices/motorcyclesSlice";
import { useGetTractorsQuery } from "../../store/slices/tractorsSlice";

type NormalizedItem = {
  id: string;
  title: string;
  price: number;
  description?: string | string[];
  city: string;
  images: string[];
  category: string;
  purpose?: string;
  area?: string;
  rooms?: number;
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  maGaday?: boolean; // Add this property
};

const ITEMS_PER_LOAD = 10;
const INITIAL_LOAD = 30;
const MAX_ITEMS = 100;

function ItemsGrid() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD);

  const { data: marketplaceItems = [], isLoading: isLoadingMarketplace } =
    useGetMarketplaceItemsQuery();
  const { data: realEstateItems = [], isLoading: isLoadingRealEstate } =
    useGetRealEstateItemsQuery();
  const { data: cars = [], isLoading: isLoadingCars } = useGetCarsQuery();
  const { data: boats = [], isLoading: isLoadingBoats } = useGetBoatsQuery();
  const { data: motorcycles = [], isLoading: isLoadingMotorcycles } =
    useGetMotorcyclesQuery();
  const { data: tractors = [], isLoading: isLoadingTractors } =
    useGetTractorsQuery();

  const normalizeMarketplace = (items: any[]): NormalizedItem[] =>
    items.map((item) => ({
      id: item.id,
      title: item.title,
      price: Number(item.price) || 0,
      description: item.description,
      city: item.city,
      images: item.images,
      category: "marketplace",
      maGaday: item.maGaday, // Add this
    }));

  const normalizeRealEstate = (items: any[]): NormalizedItem[] =>
    items.map((item) => ({
      id: item.id,
      title: item.title,
      price: Number(item.price) || 0,
      description: item.description,
      city: item.city,
      images: item.images,
      category: "real-estate",
      purpose: item.purpose,
      area: item.area,
      rooms: item.rooms,
      maGaday: item.maGaday, // Add this
    }));

  const normalizeVehicles = (
    items: any[],
    category: string
  ): NormalizedItem[] =>
    items.map((item) => ({
      id: item.id,
      title: item.title,
      price: Number(item.price) || 0,
      description: item.description,
      city: item.city,
      images: item.images,
      category,
      make: item.make,
      model: item.model,
      year: item.year,
      mileage: item.mileage,
      maGaday: item.maGaday, // Add this
    }));

  const handleSeeMore = () => {
    setVisibleCount((prevCount) => {
      const newCount = prevCount + ITEMS_PER_LOAD;
      return Math.min(newCount, MAX_ITEMS);
    });
  };

  const marketplaceNormalized = normalizeMarketplace(marketplaceItems);
  const realEstateNormalized = normalizeRealEstate(realEstateItems);
  const carsNormalized = normalizeVehicles(cars, "cars");
  const boatsNormalized = normalizeVehicles(boats, "boats");
  const motorcyclesNormalized = normalizeVehicles(motorcycles, "motorcycles");
  const tractorsNormalized = normalizeVehicles(tractors, "tractors");

  const allItems: NormalizedItem[] = [
    ...marketplaceNormalized,
    ...realEstateNormalized,
    ...carsNormalized,
    ...boatsNormalized,
    ...motorcyclesNormalized,
    ...tractorsNormalized,
  ];

  const isLoading =
    isLoadingMarketplace ||
    isLoadingRealEstate ||
    isLoadingCars ||
    isLoadingBoats ||
    isLoadingMotorcycles ||
    isLoadingTractors;

  const itemsToShow = allItems.slice(0, Math.min(visibleCount, MAX_ITEMS));

  const hasMoreItems =
    allItems.length > visibleCount && visibleCount < MAX_ITEMS;

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <Loading />
      </div>
    );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {itemsToShow.map((item, index) => {
          const uniqueKey = item.id
            ? `${item.category}-${item.id}`
            : `${item.category}-${index}`;

          switch (item.category) {
            case "real-estate":
              return (
                <RealEstateCard
                  key={uniqueKey}
                  id={item.id}
                  title={item.title}
                  price={item.price}
                  city={item.city}
                  region=""
                  area={item.area}
                  rooms={item.rooms}
                  images={item.images}
                  maGaday={item.maGaday} // Pass this prop
                />
              );
            case "cars":
            case "boats":
            case "motorcycles":
            case "tractors":
              return (
                <VehicleCard
                  key={uniqueKey}
                  id={item.id}
                  title={item.title}
                  price={item.price}
                  city={item.city}
                  images={item.images}
                  make={item.make}
                  model={item.model}
                  year={item.year}
                  mileage={item.mileage}
                  description={
                    Array.isArray(item.description)
                      ? (item.description.filter(Boolean) as string[])
                      : item.description
                      ? [item.description]
                      : []
                  }
                  maGaday={item.maGaday} // Pass this prop
                />
              );
            default:
              return (
                <CardItem
                  key={uniqueKey}
                  id={item.id}
                  title={item.title}
                  price={item.price}
                  description={item.description}
                  city={item.city}
                  images={item.images}
                  maGaday={item.maGaday} // Already here
                />
              );
          }
        })}
      </div>
      {hasMoreItems && <SeeEmore onClick={handleSeeMore} />}
    </>
  );
}

export default ItemsGrid;
