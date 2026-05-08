"use client";

import React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import ChatSystem from "@/app/(storeFront)/components/chats/chat/ChatSystem";
import { useRef, useState, RefObject } from "react";
import { ChatMessage } from "@/app/utils/types/chat";
import Loading from "@/app/ui/loading/Loading";
import { useAuth } from "@/context/AuthContext";

export default function MessagesInbox() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const itemId = searchParams.get("itemId");
  const sellerId = searchParams.get("sellerId");
  const chatId = searchParams.get("chatId");

  const [selectedChat, setSelectedChat] = useState<unknown>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(
    null,
  ) as React.RefObject<HTMLDivElement>;

  React.useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/notifications");
    }
  }, [user, loading, router]);

  const updateChatUrl = (newChatId: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newChatId) {
      params.set("chatId", newChatId.toString());
    } else {
      params.delete("chatId");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <Loading />
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col">
      <main className="flex-1 w-full h-full overflow-hidden flex flex-col md:p-4 lg:p-6">
        <div className="flex-1 w-full h-full bg-white md:rounded-3xl shadow-sm border-gray-100 md:border overflow-hidden flex flex-col">
          <ChatSystem
            currentUserId={user?._id ?? user?.id ?? ""}
            sellerId={sellerId || undefined}
            itemId={itemId || undefined}
            initialChatId={chatId ? Number(chatId) : undefined}
            onChatChange={updateChatUrl}
            selectedChat={selectedChat}
            messages={messages}
            isConnected={isConnected}
            isMobile={isMobile}
            onSelectChat={setSelectedChat}
            onSendMessage={(content) => {
              if (!user) {
                router.push(
                  `/login?redirect=${pathname}${window.location.search}`,
                );
                return;
              }
            }}
            onDeleteMessage={() => Promise.resolve()}
            onEditMessage={() => Promise.resolve()}
            onRetryFailedMessage={() => {}}
            messagesEndRef={messagesEndRef}
          />
        </div>
      </main>
    </div>
  );
}
