"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { apiService } from "@/actions/core/authAction";
import { useGetMotorcycleByIdQuery } from "@/app/(storeFront)/store/slices/motorcyclesSlice";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";

interface User {
  _id: string;
  username?: string;
  profileImage?: string;
  phone?: string;
}

const MotorcyclesSummary: React.FC = () => {
  const params = useSearchParams();
  const router = useRouter();
  const itemId = params.get("id");
  const [user, setUser] = useState<User | null>(null);
  const [checkingUser, setCheckingUser] = useState(true);

  const {
    data: motorcycle,
    isLoading,
    error,
  } = useGetMotorcycleByIdQuery(itemId || "", {
    skip: !itemId,
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

  if (!itemId) {
    return (
      <p className="text-center mt-10 text-red-500">
        No motorcycle ID provided.
      </p>
    );
  }

  if (isLoading) {
    return (
      <p className="text-center mt-10">
        <Loading />
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-red-500">
        Error loading motorcycle details.
      </p>
    );
  }

  if (!motorcycle) {
    return (
      <p className="text-center mt-10 text-red-500">Motorcycle not found.</p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 mt-10 font-sans">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-900">
        Motorcycle Listing Summary
      </h1>

      {user && (
        <div className="mb-6 p-4 bg-blue-50 rounded border border-blue-200">
          <p>
            <strong>Name:</strong> {user.username}
          </p>
          {user.phone && (
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[
          { label: "Title", value: motorcycle.title },
          { label: "Category", value: motorcycle.category },
          { label: "Subcategory", value: motorcycle.subCategory },
          { label: "Type", value: motorcycle.type },
          { label: "Make", value: motorcycle.make },
          { label: "Model", value: motorcycle.modelName },
          { label: "Year", value: motorcycle.year },
          {
            label: "Mileage",
            value: `${motorcycle.mileage.toLocaleString()} km`,
          },
          { label: "Engine Size", value: motorcycle.engineSize },
          { label: "Fuel Type", value: motorcycle.fuelType },
          { label: "Transmission", value: motorcycle.transmission },
          { label: "Color", value: motorcycle.color },
          { label: "Region", value: motorcycle.region },
          { label: "City", value: motorcycle.city },
          { label: "District", value: motorcycle.district },
          { label: "Sub District", value: motorcycle.subDistrict },
          { label: "Price", value: `$${motorcycle.price.toLocaleString()}` },
        ].map((field, idx) => (
          <div
            key={idx}
            className="flex justify-between border-b border-gray-300 pb-2"
          >
            <span className="font-semibold text-gray-700">{field.label}</span>
            <span className="text-gray-900">{field.value}</span>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">
          Description
        </h2>
        <p className="whitespace-pre-wrap bg-gray-50 p-4 rounded border border-gray-300 text-gray-700 leading-relaxed">
          {motorcycle.description}
        </p>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Images</h2>
        {motorcycle.images && motorcycle.images.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {motorcycle.images.map((img: string, idx: number) => (
              <div
                key={idx}
                className="relative w-40 h-28 rounded-md overflow-hidden border border-gray-300 shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <Image
                  src={
                    img.startsWith("data:image") || img.startsWith("http")
                      ? img
                      : "/images/default-motorcycle.jpg"
                  }
                  alt={`Motorcycle image ${idx + 1}`}
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
          {checkingUser ? "Checking user..." : "Continue to Payment"}
        </button>
      </div>
    </div>
  );
};

export default MotorcyclesSummary;
