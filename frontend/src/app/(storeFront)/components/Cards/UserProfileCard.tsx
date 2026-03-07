"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

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
  onSendMessage?: () => Promise<any> | any;
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

  const handleMessageClick = () => {
    if (maGaday) return;

    if (onSendMessage) {
      onSendMessage();
      return;
    }

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const params = new URLSearchParams({
      itemId,
      sellerId: user.id,
      itemName,
    });

    if (itemTitle) params.append("itemTitle", itemTitle);
    if (user.username) params.append("sellerUsername", user.username);

    router.push(`/messages?${params.toString()}`);
  };

  const displayUsername = user.username || "Seller";

  return (
    <div className="flex items-center gap-5 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-50 flex-shrink-0">
        <Image
          src={user.profileImage || "/user.jpg"}
          alt={displayUsername}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-gray-400 mb-0.5">
            Posted By
          </p>
          <p className="font-black text-xl text-gray-900">{displayUsername}</p>
          {maGaday && (
            <p className="text-xs font-bold text-red-500 mt-1 uppercase">
              Waa la gatay
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleMessageClick}
            disabled={maGaday}
            className={`px-6 py-2.5 rounded-xl font-black text-sm uppercase tracking-tight transition-all duration-200 
              ${
                maGaday
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  : "bg-blue-700 hover:bg-blue-800 text-white shadow-md active:scale-95"
              }`}
          >
            {maGaday ? "Sold Out" : "Send Message"}
          </button>
        </div>
      </div>
    </div>
  );
}
