import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useGetRoute } from "../../hooks/useGetRoute";

interface ChatHeaderProps {
  selectedChat: any;
  isMobile: boolean;
  isConnected: boolean;
  onBack: () => void;
}

export const ChatHeader = ({
  selectedChat,
  isMobile,
  isConnected,
  onBack,
}: ChatHeaderProps) => {
  const itemType = selectedChat?.item?.type;
  const itemRoute = useGetRoute({ category: itemType });
  const itemId = selectedChat.item?.id;
  const itemTitle = selectedChat.item?.title || "Chat";
  const otherUser = selectedChat.otherUser;
  const username = otherUser?.username || "Seller";
  const profileImage = otherUser?.profileImage;
  const userInitial = username.charAt(0).toUpperCase();

  // Handle null/undefined selectedChat
  if (!selectedChat) {
    return (
      <div className="bg-white border-b p-4 md:p-5 sticky top-0 z-20">
        <div className="flex items-center">
          {isMobile && (
            <button
              onClick={onBack}
              className="mr-3 p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
          )}
          <div className="text-gray-500">Loading chat...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-b p-4 md:p-5 sticky top-0 z-20">
      <div className="flex items-center">
        {isMobile && (
          <button
            onClick={onBack}
            className="mr-3 p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
        )}
        <div className="relative mr-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl overflow-hidden bg-blue-600 shadow-sm flex items-center justify-center text-white font-black">
            {profileImage ? (
              <Image
                src={profileImage}
                alt={username}
                width={48}
                height={48}
                className="object-cover"
              />
            ) : (
              userInitial
            )}
          </div>
          <div
            className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
              isConnected ? "bg-green-500" : "bg-gray-300"
            }`}
          />
        </div>
        <div>
          <h2 className="text-sm md:text-base font-black text-gray-900 tracking-tight leading-none mb-1">
            {itemId ? (
              <Link
                href={`/${itemRoute}/${itemId}`}
                className="hover:text-blue-600 transition-colors"
              >
                {itemTitle}
              </Link>
            ) : (
              <span>{itemTitle}</span>
            )}
          </h2>
          <div className="flex items-center text-[11px] font-bold text-gray-500 uppercase tracking-wider gap-2">
            <span className="text-blue-600">@{username}</span>
            <span className="opacity-30">|</span>
            <span className={isConnected ? "text-green-600" : "text-gray-400"}>
              {isConnected ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
