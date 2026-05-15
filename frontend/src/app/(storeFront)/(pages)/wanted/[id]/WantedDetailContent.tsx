"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useAppDispatch } from "@/store/slices/hooks/hooks";
import { respondToWantedPost, WantedPost } from "@/store/slices/reducers/wantedSlice";
import { BASE_API_URL } from "@/actions/constant/BASE_API_URL";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";
import Image from "next/image";
import { PLACEHOLDER_IMAGE } from "@/actions/constant/constant";
import Loading from "@/app/ui/loading/Loading";

function daysLeft(expiresAt: string): number {
  const diff = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

interface Props {
  initialData?: WantedPost | null;
}

export default function WantedDetailContent({ initialData }: Props) {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [post, setPost] = useState<WantedPost | null>(initialData ?? null);
  const [loading, setLoading] = useState(!initialData);
  const [toastVisible, setToastVisible] = useState(false);

  const currentUserId: string | undefined = user?.id || user?._id;

  useEffect(() => {
    if (initialData || !id) return;
    const fetchPost = async () => {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${BASE_API_URL}/api/wanted/${id}`, {
          headers: headers as HeadersInit,
        });
        if (res.ok) {
          const data = await res.json();
          setPost(data);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleRespond = async () => {
    if (!id) return;
    await dispatch(respondToWantedPost(id));
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  if (loading) return <Loading />;

  if (!post) {
    return (
      <div className="py-20 text-center text-gray-400 font-semibold">
        Post not found.
      </div>
    );
  }

  const isOwner = currentUserId === post.userId;
  const remaining = daysLeft(post.expiresAt);

  return (
    <div className="py-10 px-4 max-w-2xl mx-auto">
      {toastVisible && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg">
          The poster has been notified
        </div>
      )}

      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors"
      >
        ← Back
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 p-7 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <span className="bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full">
            {post.category}
          </span>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              remaining <= 3
                ? "bg-red-100 text-red-600"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {remaining} days left
          </span>
        </div>

        <h1 className="text-2xl font-black text-gray-900">{post.title}</h1>

        {post.details && (
          <p className="text-gray-600 text-sm leading-relaxed">{post.details}</p>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Location
            </span>
            <p className="font-semibold text-gray-800 mt-0.5">{post.location}</p>
          </div>
          {post.maxBudget > 0 && (
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Max Budget
              </span>
              <p className="font-semibold text-gray-800 mt-0.5">
                ${post.maxBudget}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <Image
            src={post.userAvatar || PLACEHOLDER_IMAGE}
            alt={post.userName}
            width={40}
            height={40}
            className="rounded-full object-cover w-10 h-10 shrink-0"
          />
          <div>
            <p className="font-bold text-gray-900 text-sm">{post.userName}</p>
            <p className="text-xs text-gray-400">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {!isOwner && (
          <button
            onClick={handleRespond}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-black uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
          >
            I Have This
          </button>
        )}
      </div>
    </div>
  );
}
