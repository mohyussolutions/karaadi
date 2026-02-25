"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBoatById } from "@/actions/categories/boatActions";
import {
  MdLocationOn,
  MdDirectionsBoat,
  MdSettings,
  MdColorLens,
  MdAttachMoney,
} from "react-icons/md";

const BoatSummary = () => {
  const params = useParams();
  const boatId = params.id;
  const [boat, setBoat] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (boatId) {
      async function fetchBoat() {
        try {
          const result = await getBoatById(boatId as string);
          if (result) setBoat(result);
        } catch (error) {
          console.error("Error fetching boat:", error);
        } finally {
          setLoading(false);
        }
      }
      fetchBoat();
    }
  }, [boatId]);

  if (loading)
    return (
      <div className="text-center mt-20 font-bold">Waa la soo kicinayaa...</div>
    );
  if (!boat)
    return (
      <div className="text-center mt-20 text-red-500 font-bold">
        Xogta lama helin.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="p-2">
            {boat.images && boat.images.length > 0 ? (
              <img
                src={boat.images[0]}
                alt={boat.title}
                className="w-full h-96 object-cover rounded-2xl"
              />
            ) : (
              <div className="w-full h-96 bg-gray-100 flex items-center justify-center rounded-2xl">
                Sawir ma leh
              </div>
            )}
            <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
              {boat.images?.slice(1).map((img: string, i: number) => (
                <img
                  key={i}
                  src={img}
                  className="w-20 h-20 object-cover rounded-lg border"
                />
              ))}
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div>
              <h1 className="text-3xl font-black text-gray-800 uppercase leading-tight">
                {boat.title}
              </h1>
              <p className="text-blue-600 font-bold text-xl mt-2 flex items-center gap-1">
                <MdAttachMoney size={24} /> {boat.price?.toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                <MdDirectionsBoat className="text-blue-500" />
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">
                    Model
                  </p>
                  <p className="text-sm font-bold text-gray-700">
                    {boat.boatModel || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                <MdSettings className="text-blue-500" />
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">
                    Gearbox
                  </p>
                  <p className="text-sm font-bold text-gray-700">
                    {boat.transmission || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                <MdColorLens className="text-blue-500" />
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">
                    Color
                  </p>
                  <p className="text-sm font-bold text-gray-700">
                    {boat.color || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                <MdLocationOn className="text-blue-500" />
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">
                    Location
                  </p>
                  <p className="text-sm font-bold text-gray-700">
                    {boat.city}, {boat.region}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-black text-gray-400 uppercase mb-2">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {boat.description}
              </p>
            </div>

            <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all">
              LA XIRIIR SHIRKADDA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoatSummary;
