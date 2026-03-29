"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import ChatSystem from "@/app/(storeFront)/components/chats/chat/ChatSystem";
import { verifySession } from "@/actions/core/authAction";
import Loading from "../../components/shared/Loading/Loading";

export default function MessagesInbox() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const itemId = searchParams.get("itemId");
  const sellerId = searchParams.get("sellerId");
  const chatId = searchParams.get("chatId");
  const { t } = useTranslation();

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const user = await verifySession();
        if (!user) {
          router.replace("/");
        } else {
          setCurrentUser(user);
        }
      } catch (error) {
        router.replace("/");
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [router]);

  const updateChatUrl = (newChatId: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newChatId) {
      params.set("chatId", newChatId.toString());
    } else {
      params.delete("chatId");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (loading || !currentUser) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <Loading />
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col">
      <main className="flex-1 w-full h-full overflow-hidden flex flex-col p-0 sm:p-4 lg:p-6">
        <div className="flex-1 w-full h-[50vh] sm:h-[70vh] min-h-0 bg-white lg:rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <ChatSystem
            currentUserId={currentUser._id}
            sellerId={sellerId || undefined}
            itemId={itemId || undefined}
            initialChatId={chatId ? Number(chatId) : undefined}
            onChatChange={updateChatUrl}
          />
        </div>
      </main>
    </div>
  );
}
