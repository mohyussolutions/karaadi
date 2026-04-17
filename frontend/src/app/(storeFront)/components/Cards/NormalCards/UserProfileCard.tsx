"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MessageSquare, Phone, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";

interface User {
  id: string;
  username?: string | null;
  profileImage?: string | null;
  phone?: string | null;
}

interface Props {
  user: User;
  isLoggedIn: boolean;
  itemId: string;
  itemTitle?: string;
  itemName: string;
  maGaday?: boolean;
  onSendMessage?: () => void;
}

export default function UserCard({
  user,
  isLoggedIn,
  itemId,
  itemTitle,
  itemName,
  maGaday = false,
  onSendMessage,
}: Props) {
  const router = useRouter();
  const [showPhone, setShowPhone] = useState(false);

  if (!user || !user.id) return null;

  const handleMessageClick = () => {
    if (maGaday) return;
    if (onSendMessage) return onSendMessage();
    if (!isLoggedIn) return router.push("/login");
    const params = new URLSearchParams({
      itemId,
      sellerId: user.id,
      itemName,
      ...(itemTitle && { itemTitle }),
      ...(user.username && { sellerUsername: user.username }),
    });
    router.push(`/messages?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Seller info */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
          Contact seller
        </p>
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 ring-2 ring-gray-100">
            <Image
              src={
                typeof user.profileImage === "string" && user.profileImage.trim()
                  ? user.profileImage
                  : "/user.jpg"
              }
              alt={user.username || "Seller"}
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-base leading-tight">
              {user.username || "Seller"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Private seller</p>
            {maGaday && (
              <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                Sold
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-5 py-4 flex flex-col gap-2.5">
        <button
          onClick={handleMessageClick}
          disabled={maGaday}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all active:scale-[0.98]
            ${maGaday
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200"
            }`}
        >
          <MessageSquare size={17} />
          {maGaday ? "Item sold" : "Send message"}
        </button>

        {user.phone && (
          <button
            onClick={() => setShowPhone((p) => !p)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all active:scale-[0.98]"
          >
            <Phone size={15} />
            {showPhone ? (
              <span className="flex items-center gap-1.5">
                {user.phone}
                <ChevronUp size={14} className="text-gray-400" />
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                Show phone number
                <ChevronDown size={14} className="text-gray-400" />
              </span>
            )}
          </button>
        )}
      </div>

      {/* Safety note */}
      <div className="px-5 pb-4 flex items-start gap-2">
        <ShieldCheck size={14} className="text-gray-300 mt-0.5 flex-shrink-0" />
        <p className="text-[11px] text-gray-400 leading-snug">
          For your safety, always communicate through Karaadi messages.
        </p>
      </div>
    </div>
  );
}
