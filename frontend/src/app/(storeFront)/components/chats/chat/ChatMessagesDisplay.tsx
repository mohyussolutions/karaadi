import { useEffect, useMemo } from "react";
import { ChatEmptyState } from "./ChatEmptyState";
import { ChatHeader } from "./ChatHeader";
import { MessageBubble } from "./MessageBubble";
import { ChatMessagesDisplayProps } from "@/app/utils/types/chat";
import { API_ENDPOINTS } from "@/actions/constant/sockets";

export default function ChatMessagesDisplay({
  currentUserId,
  selectedChat,
  messages,
  isConnected,
  isMobile,
  onSelectChat,
  onRetryFailedMessage,
  onDeleteMessage,
  onEditMessage,
  messagesEndRef,
}: ChatMessagesDisplayProps) {
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, messagesEndRef]);

  const uniqueMessages = useMemo(() => {
    const seen = new Set();
    const unique = [];

    for (const msg of messages) {
      const key = msg.id || msg.tempId;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(msg);
      }
    }

    return unique;
  }, [messages]);

  const handleEdit = async (messageId: string | number, content: string) => {
    try {
      const id =
        typeof messageId === "string"
          ? parseInt(messageId)
          : (messageId as number);
      const response = await fetch(API_ENDPOINTS.MESSAGES.UPDATE_MESSAGE(id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, userId: currentUserId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update message");
      }

      if (onEditMessage) {
        onEditMessage(messageId, content);
      }
    } catch (error) {}
  };

  const handleDelete = async (messageId: string | number) => {
    try {
      const id =
        typeof messageId === "string"
          ? parseInt(messageId)
          : (messageId as number);
      const response = await fetch(API_ENDPOINTS.MESSAGES.DELETE_MESSAGE(id), {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete message");
      }

      if (onDeleteMessage) {
        onDeleteMessage(messageId);
      }
    } catch (error) {}
  };

  if (!selectedChat) {
    return <ChatEmptyState isMobile={isMobile} />;
  }

  return (
    <>
      <ChatHeader
        selectedChat={selectedChat}
        isMobile={isMobile}
        isConnected={isConnected}
        onBack={() => onSelectChat(null)}
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#F8FAFC] space-y-6">
        {uniqueMessages.length === 0 ? (
          <div className="text-center text-gray-400 py-20 italic text-sm">
            <p>No messages yet.</p>
            <p className="text-xs mt-2">
              Start a conversation by sending a message!
            </p>
          </div>
        ) : (
          uniqueMessages.map((msg) => (
            <MessageBubble
              key={`${msg.id || msg.tempId}-${msg.createdAt || msg.timestamp}`}
              msg={msg}
              isOwnMessage={msg.senderId === currentUserId}
              onEdit={onEditMessage || handleEdit}
              onDelete={onDeleteMessage || handleDelete}
              onRetry={() => onRetryFailedMessage(msg)}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </>
  );
}
