"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import ChatSystem from "@/app/(storeFront)/components/chats/chat/ChatSystem";
import { FiHome, FiMessageSquare } from "react-icons/fi";
import { verifySession } from "@/actions/core/authAction";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";

export default function MessagesInbox() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const itemId = searchParams.get("itemId");
  const sellerId = searchParams.get("sellerId");
  const chatId = searchParams.get("chatId");

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
    <div className="h-screen w-full bg-gray-50 flex flex-col fixed inset-0 z-50">
      <header className="bg-white border-b border-gray-200 px-4 h-14 md:h-16 flex items-center justify-center flex-shrink-0">
        <div className="max-w-6xl w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FiMessageSquare className="text-blue-600 text-lg" />
            </div>
            <h1 className="text-lg md:text-xl font-bold text-gray-900">
              Meldinger
            </h1>
          </div>

          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-full transition-all active:scale-95"
          >
            <FiHome />
            <span className="hidden sm:inline">Hjem</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full h-full overflow-hidden flex flex-col md:p-4 lg:p-6">
        <div className="flex-1 bg-white md:rounded-2xl shadow-sm border-gray-200 md:border overflow-hidden flex flex-col">
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
