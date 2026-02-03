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
  onSendMessage?: () => Promise<void> | void;
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
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border shadow-sm">
      <div className="relative w-16 h-16 rounded-full overflow-hidden border">
        <Image
          src={user.profileImage || "/user.jpg"}
          alt={displayUsername}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1">
        <p className="font-semibold text-lg">{displayUsername}</p>
        <button
          onClick={handleMessageClick}
          disabled={maGaday}
          className={`mt-2 px-4 py-2 rounded transition-colors ${
            maGaday
              ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {maGaday ? "Item Sold" : "Send Message"}
        </button>

        {maGaday && (
          <p className="text-sm text-gray-500 mt-1">
            Waa la gatay. Farriin looma diri karo.
          </p>
        )}
      </div>
    </div>
  );
}
