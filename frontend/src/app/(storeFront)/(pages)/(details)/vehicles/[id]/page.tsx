"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import VehicleImageGallery from "../VehicleImageGallery";
import { Item } from "@/app/utils/types/vihcles";
import UserCard from "@/app/(storeFront)/components/Cards/UserProfileCard";
import { useGetCarByIdQuery } from "@/app/(storeFront)/store/slices/carsSlice";
import { useGetBoatByIdQuery } from "@/app/(storeFront)/store/slices/boatsSlice";
import { useGetTractorByIdQuery } from "@/app/(storeFront)/store/slices/tractorsSlice";
import { useGetMotorcycleByIdQuery } from "@/app/(storeFront)/store/slices/motorcyclesSlice";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import GoBackBtn from "@/app/(storeFront)/components/shared/buttons/goBackBtn";
import SaveFavoriteModel from "@/app/(storeFront)/components/shared/modals/Modal";
import { apiService } from "@/actions/core/authAction";

export default function VehicleDetails() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [currentUser, setCurrentUser] = useState<Record<string, any> | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);

  const { data: carItem, isLoading: isLoadingCar } = useGetCarByIdQuery(id, {
    skip: !id,
  });

  const { data: boatItem, isLoading: isLoadingBoat } = useGetBoatByIdQuery(id, {
    skip: !id,
  });
  const { data: tractorItem, isLoading: isLoadingTractor } =
    useGetTractorByIdQuery(id, { skip: !id });

  console.log(tractorItem);
  const { data: motorcycleItem, isLoading: isLoadingMotorcycle } =
    useGetMotorcycleByIdQuery(id, { skip: !id });

  const item = (carItem || boatItem || tractorItem || motorcycleItem) as
    | Item
    | undefined;

  const loading =
    isLoadingCar || isLoadingBoat || isLoadingTractor || isLoadingMotorcycle;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const user = await apiService.verifySession();
        if (mounted) setCurrentUser(user ?? null);
      } catch {
        if (mounted) setCurrentUser(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleHeartClick = () => {
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setShowModal(true);
  };

  if (loading)
    return (
      <div className="p-8 text-center">
        <Loading />
      </div>
    );
  if (!item)
    return (
      <div className="p-8 text-center text-red-600 text-lg">
        Product not found
      </div>
    );

  const images = Array.isArray(item.images) ? item.images.filter(Boolean) : [];
  const descriptionArray =
    typeof item.description === "string"
      ? [item.description]
      : item.description || [];

  return (
    <div className="my-4">
      <div className="ml-1 font-mono text-blue-600 text-sm">
        <p>{item.city}</p>
      </div>

      <div className="max-w-9xl mx-auto p-1 grid grid-cols-1 md:grid-cols-2 gap-8">
        <VehicleImageGallery
          images={images}
          title={item.title}
          onHeartClick={handleHeartClick}
        />

        <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
          <GoBackBtn />
          <h1 className="text-2xl font-bold">{item.title}</h1>
          <div className="text-xl font-bold text-blue-700">
            {item.price.toLocaleString()} $
          </div>

          {(item.make || item.model || item.year || item.mileage) && (
            <div className="space-y-2 mt-4">
              <h3 className="font-semibold">Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {item.make && (
                  <div>
                    <span className="text-gray-500">Make:</span> {item.make}
                  </div>
                )}
                {item.model && (
                  <div>
                    <span className="text-gray-500">Model:</span> {item.model}
                  </div>
                )}
                {item.year && (
                  <div>
                    <span className="text-gray-500">Year:</span> {item.year}
                  </div>
                )}
                {item.mileage && (
                  <div>
                    <span className="text-gray-500">Mileage:</span>{" "}
                    {item.mileage.toLocaleString()} km
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded">
            <ul>
              {descriptionArray.map((desc, i) => (
                <li key={i}>{desc}</li>
              ))}
            </ul>
          </div>

          <UserCard
            user={{
              _id: item.user?._id || "",
              username: item.user?.username || "Unknown Seller",
              profileImage: item.user?.profileImage || null,
              phone: item.user?.phone || null,
            }}
            isLoggedIn={Boolean(currentUser)}
            itemId={item._id}
            itemName={item.title}
          />
        </div>
      </div>

      {showModal && (
        <SaveFavoriteModel
          onConfirm={() => {
            setShowModal(false);
            router.push("/mine/favorites");
          }}
          onCancel={() => setShowModal(false)}
          backgroundImage={"red"}
        />
      )}
    </div>
  );
}
