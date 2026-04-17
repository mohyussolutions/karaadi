"use client";

import React from "react";
import Image from "next/image";
import { WantedPost } from "@/store/slices/reducers/wantedSlice";
import { PLACEHOLDER_IMAGE } from "@/actions/constant/constant";

interface WantedCardProps {
  post: WantedPost;
  currentUserId?: string;
  onRespond: (id: string) => void;
}

function daysLeft(expiresAt: string): number {
  const diff = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

const WantedCard: React.FC<WantedCardProps> = ({
  post,
  currentUserId,
  onRespond,
}) => {
  const isOwner = currentUserId === post.userId;
  const remaining = daysLeft(post.expiresAt);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <span className="inline-block bg-blue-100 text-blue-700 text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
          {post.category}
        </span>
        <span
          className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
            remaining <= 3
              ? "bg-red-100 text-red-600"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {remaining}d left
        </span>
      </div>

      <h3 className="font-black text-gray-900 text-base leading-snug line-clamp-2">
        {post.title}
      </h3>

      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span className="truncate">{post.location}</span>
        {post.maxBudget > 0 && (
          <>
            <span>·</span>
            <span className="font-bold text-gray-700">${post.maxBudget}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-100">
        <Image
          src={post.userAvatar || PLACEHOLDER_IMAGE}
          alt={post.userName}
          width={28}
          height={28}
          className="rounded-full object-cover w-7 h-7 shrink-0"
        />
        <span className="text-xs font-semibold text-gray-600 truncate">
          {post.userName}
        </span>

        {!isOwner && (
          <button
            onClick={() => onRespond(post.id)}
            className="ml-auto shrink-0 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            I Have This
          </button>
        )}
      </div>
    </div>
  );
};

export default WantedCard;
