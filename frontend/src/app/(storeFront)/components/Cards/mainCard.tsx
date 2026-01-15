"use client";

import React, { useState, useEffect } from "react";

import Loading from "../shared/Loading/Loading";
import SeeEmore from "../shared/search/SeeEmore";
import RealEstateCard from "./RealEstateCard";
import VehicleCard from "./VehicleCard";
import CardItem from "./CardItem";
const BASE_URL = "http://localhost:8080";

// We'll fetch directly from the backend endpoints instead of using Redux here

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

  const [marketplaceItems, setMarketplaceItems] = useState<any[]>([]);
  const [realEstateItems, setRealEstateItems] = useState<any[]>([]);
  const [cars, setCars] = useState<any[]>([]);
  const [boats, setBoats] = useState<any[]>([]);
  const [motorcycles, setMotorcycles] = useState<any[]>([]);
  const [tractors, setTractors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const [mpRes, reRes, carsRes, boatsRes, mcRes, trRes] = await Promise.all([
          fetch(`${BASE_URL}/api/marketplace`),
          fetch(`${BASE_URL}/api/real-estate`),
          fetch(`${BASE_URL}/api/cars`),
          fetch(`${BASE_URL}/api/boats`),
          fetch(`${BASE_URL}/api/motorcycles`),
          fetch(`${BASE_URL}/api/traktor`),
        ]);

        const [mpJson, reJson, carsJson, boatsJson, mcJson, trJson] = await Promise.all([
          mpRes.ok ? mpRes.json() : [],
          reRes.ok ? reRes.json() : [],
          carsRes.ok ? carsRes.json() : [],
          boatsRes.ok ? boatsRes.json() : [],
          mcRes.ok ? mcRes.json() : [],
          trRes.ok ? trRes.json() : [],
        ]);

        if (!mounted) return;

        setMarketplaceItems(Array.isArray(mpJson) ? mpJson : []);
        setRealEstateItems(Array.isArray(reJson) ? reJson : []);
        setCars(Array.isArray(carsJson) ? carsJson : []);
        setBoats(Array.isArray(boatsJson) ? boatsJson : []);
        setMotorcycles(Array.isArray(mcJson) ? mcJson : []);
        setTractors(Array.isArray(trJson) ? trJson : []);
      } catch (err) {
        console.error("Error fetching items for main card:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchAll();
    return () => {
      mounted = false;
    };
  }, []);

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

  // `isLoading` state above covers all fetches

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
        {itemsToShow.map((item: NormalizedItem, index: number) => {
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
