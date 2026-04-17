"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAppDispatch, useAppSelector } from "@/store/slices/hooks/hooks";
import {
  fetchWantedPosts,
  respondToWantedPost,
} from "@/store/slices/reducers/wantedSlice";
import WantedCard from "./WantedCard";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";

const WantedPage = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((state) => state.wanted);
  const [toastVisible, setToastVisible] = useState(false);

  const currentUserId: string | undefined = user?.id || user?._id;

  useEffect(() => {
    dispatch(fetchWantedPosts());
  }, [dispatch]);

  const handleRespond = async (id: string) => {
    await dispatch(respondToWantedPost(id));
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  if (status === "loading") return <Loading />;

  return (
    <div className="py-8 px-4 max-w-6xl mx-auto">
      {toastVisible && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg">
          The poster has been notified
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-gray-900">
          Wanted <span className="text-blue-600">Posts</span>
        </h1>
        <a
          href="/wanted/create"
          className="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
        >
          + Post Wanted
        </a>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 text-gray-400 font-semibold">
          No wanted posts yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((post) => (
            <WantedCard
              key={post.id}
              post={post}
              currentUserId={currentUserId}
              onRespond={handleRespond}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WantedPage;
