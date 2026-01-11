"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useGetCarByIdQuery } from "@/app/(storeFront)/store/slices/carsSlice";
import { apiService } from "@/actions/core/authAction";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";

const CarSummary: React.FC = () => {
  const params = useSearchParams();
  const router = useRouter();
  const carId = params.get("id");
  const [user, setUser] = useState<any>(null);
  const [checkingUser, setCheckingUser] = useState(true);

  const { data: car, isLoading } = useGetCarByIdQuery(carId || "", {
    skip: !carId,
  });

  useEffect(() => {
    const fetchUser = async () => {
      const sessionUser = await apiService.verifySession();
      if (!sessionUser) {
        router.push("/login");
      } else {
        setUser(sessionUser);
      }
      setCheckingUser(false);
    };
    fetchUser();
  }, [router]);

  if (isLoading) {
    return (
      <p className="text-center mt-10">
        <Loading />
      </p>
    );
  }

  if (!car) {
    return <p className="text-center mt-10 text-red-500">Car not found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 mt-10 font-sans">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-900">
        Car Listing Summary
      </h1>

      {user && (
        <div className="mb-6 p-4 bg-blue-50 rounded border border-blue-200">
          <p>
            <strong>Name:</strong> {user.username}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[
          { label: "Title", value: car.title },
          { label: "Category", value: car.category },
          { label: "Subcategory", value: car.subCategory },
          { label: "Listing Type", value: car.listingType },
          { label: "Brand", value: car.brand },
          { label: "Model", value: car.vehicleModel },
          { label: "Year", value: car.year },
          { label: "Transmission", value: car.transmission },
          { label: "Fuel Type", value: car.fuelType || "N/A" },
          { label: "Color", value: car.color },
          { label: "Region", value: car.region },
          { label: "City", value: car.city },
          { label: "District", value: car.district },
          { label: "Price", value: `$${car.price}` },
        ].map((item, index) => (
          <div
            key={index}
            className="flex justify-between border-b border-gray-300 pb-2"
          >
            <span className="font-semibold text-gray-700">{item.label}</span>
            <span className="text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">
          Description
        </h2>
        <p className="whitespace-pre-wrap bg-gray-50 p-4 rounded border border-gray-300 text-gray-700 leading-relaxed">
          {car.description}
        </p>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Images</h2>
        {car.images && car.images.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {car.images.map((img: string, idx: number) => (
              <div
                key={idx}
                className="relative w-40 h-28 rounded-md overflow-hidden border border-gray-300 shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <Image
                  src={
                    img.startsWith("data:image")
                      ? img
                      : "/images/default-car.jpg"
                  }
                  alt={`Car image ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority={idx === 0}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="italic text-gray-500">No images uploaded</p>
        )}
      </div>

      <div className="text-center">
        <button
          disabled={checkingUser}
          onClick={() => router.push("/payment/ChooseProducts/")}
          className={`${
            checkingUser
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          } text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-colors duration-300`}
        >
          {checkingUser ? "Checking user..." : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default CarSummary;
