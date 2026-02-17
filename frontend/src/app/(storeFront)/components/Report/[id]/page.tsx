"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { verifySession } from "@/actions/core/authAction";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";

export default function ReportPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = params?.id;

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const session = await verifySession();
        if (!session) {
          router.push("/login");
          return;
        }
        setUser(session);
      } catch (error) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-10 font-black uppercase tracking-widest text-[10px]"
        >
          <IoIosArrowBack size={18} />
          Go Back to Item
        </button>

        <div className="bg-white rounded-[32px] p-12 shadow-sm border border-gray-100">
          <div className="mb-10">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">
              Report Listing
            </h1>
            <p className="text-gray-500 font-medium leading-relaxed">
              Hi{" "}
              <span className="text-blue-600 font-bold">
                {user?.username || "user"}
              </span>
              , please provide details about why this item should be reviewed.
            </p>
          </div>

          <form className="space-y-8">
            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
                Reason for report
              </label>
              <select className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-gray-900 font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none transition-all cursor-pointer">
                <option value="">Dooro sababta</option>
                <option value="scam">Waa khayaano / Waxba kama jiraan</option>
                <option value="sold">Alaabtan mar horre ayaa la gatay</option>
                <option value="misleading">
                  Macluumaad khalad ah ayaa ku qoran
                </option>
                <option value="prohibited">
                  Waa wax mamnuuc ah ama sharci darro ah
                </option>
                <option value="offensive">
                  Muuqaal ama hadal gaf ah ayaa ku jira
                </option>
                <option value="other">Sabab kale</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
                Additional details
              </label>
              <textarea
                rows={6}
                placeholder="What exactly is wrong with this item?"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
              ></textarea>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white font-black py-5 rounded-2xl uppercase tracking-widest transition-all shadow-xl shadow-red-100 active:scale-[0.98]"
              >
                Submit Report
              </button>
              <p className="text-center text-gray-400 text-[10px] mt-6 font-medium">
                Item ID: {itemId}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
