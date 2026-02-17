"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import ChatSystem from "@/app/(storeFront)/components/chats/chat/ChatSystem";
import { FiHome, FiUser } from "react-icons/fi";
import { verifySession } from "@/actions/core/authAction";

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
        console.error("Failed to load user:", error);
        router.replace("/");
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [router]);

  const updateChatUrl = (newChatId: number) => {
    const params = new URLSearchParams(searchParams.toString());
    newChatId
      ? params.set("chatId", newChatId.toString())
      : params.delete("chatId");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const navigateToHome = () => {
    router.push("/");
  };

  const navigateBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser className="text-red-400 text-3xl" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Session Expired
          </h2>
          <p className="text-slate-600 mb-6">Please sign in to continue</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col overflow-hidden fixed inset-0 z-0 pt-12 md:pt-16">
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full h-full">
        <div className="px-4 py-2 md:px-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                Meldinger
              </h1>
            </div>
            <button
              onClick={navigateToHome}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
            >
              <FiHome className="inline mr-1" />
              Home
            </button>
          </div>
        </div>

        <div className="flex-1 bg-white md:rounded-t-2xl shadow-lg border-t md:border-x border-slate-200 flex flex-col min-h-0 overflow-hidden">
          <ChatSystem
            currentUserId={currentUser._id}
            sellerId={sellerId || undefined}
            itemId={itemId || undefined}
            initialChatId={chatId ? Number(chatId) : undefined}
            onChatChange={updateChatUrl}
          />
        </div>
      </div>
    </div>
  );
}
