import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useGetRoute } from "../../hooks/useGetRoute";
import Loading from "../../shared/Loading/Loading";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const itemType = selectedChat?.item?.type;
  const { getRoute } = useGetRoute();
  const itemRoute = getRoute(itemType);
  const itemId = selectedChat.item?.id;
  const itemTitle =
    selectedChat.item?.title ||
    t("chats.chatFallback", { defaultValue: "Chat" });
  const otherUser = selectedChat.otherUser;
  const username =
    otherUser?.username || t("chats.seller", { defaultValue: "Seller" });
  const profileImage = otherUser?.profileImage;
  const userInitial = username.charAt(0).toUpperCase();
  const avatarSrc = (() => {
    try {
      if (profileImage && profileImage.startsWith("/assets/users/")) {
        const initial = userInitial || "U";
        const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'><rect width='100%' height='100%' fill='transparent' /><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='black' font-size='16' font-family='Arial, Helvetica, sans-serif'>${initial}</text></svg>`;
        return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
      }
    } catch (e) {}
    return profileImage;
  })();

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
          <div className="text-gray-500">
            <Loading />
          </div>
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
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={username}
                width={48}
                height={48}
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = "none";
                }}
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
              {isConnected
                ? t("chats.online", { defaultValue: "Online" })
                : t("chats.offline", { defaultValue: "Offline" })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
