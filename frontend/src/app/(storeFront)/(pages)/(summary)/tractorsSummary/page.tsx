"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { apiService } from "@/actions/core/authAction";
import {
  Tractor,
  useGetTractorByIdQuery,
} from "@/app/(storeFront)/store/slices/tractorsSlice";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";

interface User {
  _id: string;
  username?: string;
  profileImage?: string;
  phone?: string;
}

interface Field {
  label: string;
  value: string | number | undefined;
}

const TraktorSummary: React.FC = () => {
  const params = useSearchParams();
  const router = useRouter();
  const itemId = params.get("id");
  const [user, setUser] = useState<User | null>(null);
  const [checkingUser, setCheckingUser] = useState<boolean>(true);

  const { data: item, isLoading } = useGetTractorByIdQuery(itemId || "", {
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
      <p className="text-center mt-10 text-red-500">No item ID provided.</p>
    );
  }

  if (isLoading) {
    return (
      <p className="text-center mt-10">
        <Loading />
      </p>
    );
  }

  if (!item) {
    return <p className="text-center mt-10 text-red-500">Item not found.</p>;
  }

  const tractorItem = item as Tractor;

  const fields: Field[] = [
    { label: "Title", value: tractorItem.title },
    { label: "Category", value: tractorItem.category },
    { label: "Subcategory", value: tractorItem.subCategories },
    {
      label: "Type",
      value:
        typeof tractorItem.type === "string"
          ? tractorItem.type
          : String(tractorItem.type),
    },

    { label: "Year", value: tractorItem.year },
    { label: "Condition", value: tractorItem.condition },
    { label: "Engine Power", value: tractorItem.enginePower || "N/A" },
    { label: "Fuel Type", value: tractorItem.fuelType || "N/A" },
    { label: "Transmission", value: tractorItem.transmissionType || "N/A" },
    { label: "Region", value: tractorItem.region },
    { label: "City", value: tractorItem.city },
    { label: "District", value: tractorItem.district },
    { label: "Sub District", value: tractorItem.subDistrict || "N/A" },
    { label: "Price", value: `$${tractorItem.price.toLocaleString()}` },
    { label: "Color", value: tractorItem.extra?.color || "N/A" },
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 mt-10 font-sans">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-green-900">
        Tractor Listing Summary
      </h1>

      {user && (
        <div className="mb-6 p-4 bg-green-50 rounded border border-green-200">
          <p>
            <strong>Name:</strong> {user.username}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {fields.map((field: Field, idx: number) => (
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
          {Array.isArray(tractorItem.description)
            ? tractorItem.description.join("\n")
            : tractorItem.description}
        </p>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Images</h2>
        {tractorItem.images && tractorItem.images.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {tractorItem.images.map((img: string, idx: number) => (
              <div
                key={idx}
                className="relative w-40 h-28 rounded-md overflow-hidden border border-gray-300 shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <Image
                  src={
                    img.startsWith("data:image")
                      ? img
                      : "/images/default-tractor.jpg"
                  }
                  alt={`Tractor image ${idx + 1}`}
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

export default TraktorSummary;
