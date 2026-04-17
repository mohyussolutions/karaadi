"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Socket } from "socket.io-client";
import SocketManager from "./ServerClientsSocket";
import ChatMessagesDisplay from "./ChatMessagesDisplay";
import ChatInputArea from "./InputTextarea";
import { Trash2 } from "lucide-react";
import { API_ENDPOINTS, SOCKET_EVENTS } from "@/actions/constant/sockets";
import { ChatSystemProps } from "@/app/utils/types/chat";

export default function ChatSystem({
  currentUserId,
  initialChatId,
  sellerId,
  itemId,
  itemTitle,
  initialMessage,
  onChatChange,
}: ChatSystemProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useTranslation();
  const [singletonBlocked, setSingletonBlocked] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if ((window as any).__CHAT_SYSTEM_MOUNTED) {
      setSingletonBlocked(true);
      return;
    }
    (window as any).__CHAT_SYSTEM_MOUNTED = true;
    mountedRef.current = true;
    return () => {
      if (mountedRef.current) delete (window as any).__CHAT_SYSTEM_MOUNTED;
    };
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(
    null,
  ) as React.RefObject<HTMLDivElement>;
  const messageIdsRef = useRef<Set<number>>(new Set());
  const recentlySentRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch(
          API_ENDPOINTS.CHATS.USER_CHATS(currentUserId),
          { credentials: "include" },
        );
        if (response.ok) {
          const existingChats = await response.json();

          const mappedChats = existingChats.map((chat: any) => {
            const otherUser =
              chat.participants?.find((p: any) => p.id !== currentUserId) ||
              chat.otherUser;

            return {
              ...chat,
              otherUser: otherUser,
              receiverId: otherUser?.id,
              senderId: currentUserId,
            };
          });

          setChats(mappedChats);
          let chatToSelect = null;

          if (initialChatId) {
            const urlChat = mappedChats.find(
              (chat: any) => chat.id === initialChatId,
            );
            if (urlChat) chatToSelect = urlChat;
          }

          if (!chatToSelect && sellerId && itemId) {
            const existingChat = mappedChats.find(
              (chat: any) =>
                chat.receiverId === sellerId && chat.item?.id === itemId,
            );
            if (existingChat) {
              chatToSelect = existingChat;
            } else {
              try {
                const findResponse = await fetch(
                  API_ENDPOINTS.CHATS.FIND_CONVERSATION(
                    currentUserId,
                    sellerId,
                    itemId,
                    "Marketplace",
                  ),
                  { credentials: "include" },
                );
                if (findResponse.ok) {
                  const foundChat = await findResponse.json();
                  if (foundChat) {
                    const otherUser =
                      foundChat.participants?.find(
                        (p: any) => p.id !== currentUserId,
                      ) || foundChat.otherUser;

                    const mappedFoundChat = {
                      ...foundChat,
                      otherUser: otherUser,
                      receiverId: otherUser?.id,
                      senderId: currentUserId,
                    };

                    chatToSelect = mappedFoundChat;
                    setChats((prev) => {
                      const exists = prev.some(
                        (chat) => chat.id === foundChat.id,
                      );
                      if (!exists) return [...prev, mappedFoundChat];
                      return prev;
                    });
                  } else {
                    createNewChat();
                    return;
                  }
                } else {
                  createNewChat();
                  return;
                }
              } catch {
                createNewChat();
                return;
              }
            }
          }

          if (!chatToSelect && mappedChats.length > 0) {
            chatToSelect = mappedChats[0];
          }

          if (chatToSelect) {
            setSelectedChat(chatToSelect);
            loadChatMessages(chatToSelect.id);
            if (onChatChange && chatToSelect.id !== initialChatId) {
              onChatChange(chatToSelect.id);
            }
          } else {
            setLoading(false);
          }
        }
      } catch {
        setLoading(false);
      }
    };

    if (currentUserId) fetchChats();
  }, [currentUserId, sellerId, itemId, initialChatId]);

  const loadChatMessages = async (chatId: number) => {
    try {
      setLoading(true);
      messageIdsRef.current.clear();
      recentlySentRef.current.clear();

      if (socket && isConnected && selectedChat) {
        socket.emit(SOCKET_EVENTS.EMIT.LEAVE_CHAT, selectedChat.id);
      }

      const response = await fetch(
        API_ENDPOINTS.CHATS.CHAT_MESSAGES(chatId, currentUserId),
        { credentials: "include" },
      );

      if (response.ok) {
        const chatMessages = await response.json();
        chatMessages.forEach((msg: any) => {
          if (msg.id) messageIdsRef.current.add(msg.id);
        });
        setMessages(chatMessages);

        if (socket && isConnected) {
          socket.emit(SOCKET_EVENTS.EMIT.JOIN_CHAT, chatId);
        }
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const createNewChat = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.CHATS.CREATE, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: currentUserId,
          receiverId: sellerId,
          itemId: itemId,
          itemModel: "Marketplace",
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const newChat = {
          id: result.chat.id,
          participants: [
            { id: currentUserId },
            {
              id: sellerId,
              username: result.chat.receiver?.username || "Seller",
              profileImage: result.chat.receiver?.profileImage || "/user.jpg",
            },
          ],
          otherUser: {
            id: sellerId!,
            username: result.chat.receiver?.username || "Seller",
            profileImage: result.chat.receiver?.profileImage || "/user.jpg",
          },
          receiverId: sellerId,
          senderId: currentUserId,
          item: {
            id: itemId!,
            title: itemTitle || "New Item",
            image: "",
            price: 0,
            type: "Marketplace",
          },
          lastMessage: null,
          unreadCount: 0,
        };

        setChats((prev) => [...prev, newChat]);
        setSelectedChat(newChat);
        if (onChatChange) onChatChange(newChat.id);

        if (initialMessage) {
          setTimeout(() => sendMessage(initialMessage, newChat.id), 500);
        }
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content?: string, chatId?: number) => {
    const messageContent = content || "";
    const targetChatId = chatId || selectedChat?.id;

    if (!messageContent.trim() || !targetChatId || sending) return;

    setSending(true);
    const tempId = `temp-${Date.now()}-${Math.random()}`;

    let receiverId = selectedChat?.receiverId || selectedChat?.otherUser?.id;

    if (!receiverId && selectedChat?.participants) {
      const otherParticipant = selectedChat.participants.find(
        (p: any) => p.id !== currentUserId,
      );
      receiverId = otherParticipant?.id;
    }

    if (!receiverId && sellerId) {
      receiverId = sellerId;
    }

    const tempMessage = {
      tempId,
      content: messageContent,
      senderId: currentUserId,
      receiverId,
      chatId: targetChatId,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: "sending",
      sender: {
        id: currentUserId,
        username: "You",
        profileImage: "",
      },
    };

    setMessages((prev) => {
      const exists = prev.some((msg) => msg.tempId === tempId);
      if (exists) return prev;
      return [...prev, tempMessage];
    });

    try {
      const response = await fetch(API_ENDPOINTS.MESSAGES.SEND, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: String(targetChatId),
          content: messageContent,
          senderId: String(currentUserId),
          receiverId: receiverId ? String(receiverId) : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const savedMessage = await response.json();

      if (savedMessage.id) {
        messageIdsRef.current.add(savedMessage.id);
        recentlySentRef.current.add(savedMessage.id);
        setTimeout(() => {
          recentlySentRef.current.delete(savedMessage.id);
        }, 3000);
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.tempId === tempId ? { ...savedMessage, status: "sent" } : msg,
        ),
      );

      if (chats && savedMessage.id) {
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === targetChatId
              ? {
                  ...chat,
                  lastMessage: {
                    content: messageContent,
                    createdAt: savedMessage.createdAt || savedMessage.timestamp,
                    id: savedMessage.id,
                  },
                  updatedAt: new Date().toISOString(),
                }
              : chat,
          ),
        );
      }

      if (socket && isConnected) {
        socket.emit(SOCKET_EVENTS.EMIT.MARK_AS_READ, {
          chatId: targetChatId,
        });
      }
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.tempId === tempId
            ? { ...msg, status: "failed", error: "Failed to send" }
            : msg,
        ),
      );
    } finally {
      setSending(false);
    }
  };

  const deleteChat = async (chatId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed =
      typeof window !== "undefined" &&
      window.confirm(
        t("chats.confirmDelete", {
          defaultValue: "Are you sure you want to delete this chat?",
        }),
      );
    if (!confirmed) return;
    try {
      const response = await fetch(
        API_ENDPOINTS.CHATS.DELETE(chatId, currentUserId),
        { method: "DELETE", credentials: "include" },
      );
      if (response.ok) {
        setChats((prev) => prev.filter((chat) => chat.id !== chatId));
        if (selectedChat?.id === chatId) {
          setSelectedChat(null);
          setMessages([]);
          if (onChatChange) onChatChange(0);
        }
        try {
          alert(t("chats.deletedSuccess", { defaultValue: "Chat deleted" }));
        } catch (e) {}
      } else {
        try {
          const errorData = await response.json().catch(() => ({}));
          alert(
            t("chats.deletedFailed", {
              defaultValue: errorData.message || "Failed to delete chat",
            }),
          );
        } catch (e) {
          alert(
            t("chats.deletedFailed", { defaultValue: "Failed to delete chat" }),
          );
        }
      }
    } catch (err) {
      alert(
        t("chats.deletedFailed", { defaultValue: "Failed to delete chat" }),
      );
    }
  };

  const handleDeleteMessage = async (messageId: number | string) => {
    try {
      const response = await fetch(
        API_ENDPOINTS.MESSAGES.DELETE_MESSAGE(Number(messageId)),
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUserId }),
        },
      );

      if (response.ok) {
        setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
        messageIdsRef.current.delete(Number(messageId));
      }
    } catch {}
  };

  const handleUpdateMessage = async (
    messageId: number | string,
    newContent: string,
  ) => {
    try {
      const response = await fetch(
        API_ENDPOINTS.MESSAGES.UPDATE_MESSAGE(Number(messageId)),
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: newContent, userId: currentUserId }),
        },
      );

      if (response.ok) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...msg, content: newContent, isEdited: true }
              : msg,
          ),
        );
      }
    } catch {}
  };

  const retryFailedMessage = async (tempMessage: any) => {
    if (!selectedChat?.id) return;
    setMessages((prev) =>
      prev.filter((msg) => msg.tempId !== tempMessage.tempId),
    );
    await sendMessage(tempMessage.content, selectedChat.id);
  };

  const handleSocketReady = (newSocket: Socket, connected: boolean) => {
    setSocket(newSocket);
    setIsConnected(connected);
    if (connected && selectedChat) {
      newSocket.emit(SOCKET_EVENTS.EMIT.JOIN_CHAT, selectedChat.id);
    }
  };

  const handleReceiveMessage = (message: any) => {
    if (!message || !message.chatId || message.chatId !== selectedChat?.id)
      return;

    const messageId = message.id;
    if (messageId && recentlySentRef.current.has(messageId)) return;
    if (messageId && messageIdsRef.current.has(messageId)) return;

    if (messageId) {
      messageIdsRef.current.add(messageId);
    }

    setMessages((prev) => {
      const exists = prev.some(
        (msg) =>
          msg.id === messageId || (msg.tempId && msg.tempId === message.tempId),
      );
      if (exists) return prev;
      return [...prev, message];
    });
  };

  const handleMessageSent = (data: any) => {
    if (data.message && data.message.id) {
      recentlySentRef.current.add(data.message.id);
      setTimeout(() => {
        recentlySentRef.current.delete(data.message.id);
      }, 3000);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.tempId === data.tempId
            ? { ...data.message, status: "sent" }
            : msg,
        ),
      );
    }
  };

  const handleSelectChat = (chat: any) => {
    setSelectedChat(chat);
    loadChatMessages(chat.id);
    if (onChatChange) onChatChange(chat.id);
    if (socket && isConnected) {
      socket.emit(SOCKET_EVENTS.EMIT.MARK_AS_READ, { chatId: chat.id });
    }
  };

  if (singletonBlocked) return null;

  return (
    <SocketManager
      currentUserId={currentUserId}
      selectedChat={selectedChat}
      isConnected={isConnected}
      socket={socket}
      onSocketReady={handleSocketReady}
      onReceiveMessage={handleReceiveMessage}
      onMessageSent={handleMessageSent}
      onMessageSaved={() => {}}
    >
      <div className="flex h-full min-h-0 border rounded-lg overflow-hidden bg-white">
        {(!isMobile || !selectedChat) && (
          <div
            className={`${
              isMobile ? "absolute inset-0 z-10 bg-white" : "w-full md:w-80"
            } border-r bg-gray-50 flex flex-col`}
          >
            <div className="p-3 md:p-4 border-b bg-white">
              <h2 className="text-lg md:text-xl font-bold">
                {t("chats.yourChats", { defaultValue: "Your Chats" })}
              </h2>
              <p className="text-xs md:text-sm text-gray-500">
                {chats.length}{" "}
                {t("chats.conversations", { defaultValue: "conversation" })}
                {chats.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {chats.map((chat, idx) => (
                <div
                  key={`${chat.id ?? chat._id ?? chat.receiverId ?? "chat"}-${chat.item?.id ?? ""}-${idx}`}
                  onClick={() => handleSelectChat(chat)}
                  className={`w-full p-3 md:p-4 text-left border-b hover:bg-gray-100 transition-colors flex items-start group relative cursor-pointer ${
                    selectedChat?.id === chat.id
                      ? "bg-blue-50 border-blue-200"
                      : "bg-white"
                  }`}
                >
                  <div className="relative mr-2 md:mr-3 flex-shrink-0">
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-full overflow-hidden bg-blue-100">
                      {chat.otherUser?.profileImage ? (
                        <img
                          src={(() => {
                            try {
                              const src = chat.otherUser.profileImage;
                              if (src && src.startsWith("/assets/users/")) {
                                const initial =
                                  chat.otherUser?.username
                                    ?.charAt(0)
                                    ?.toUpperCase() || "U";
                                const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'><rect width='100%' height='100%' fill='transparent' /><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='black' font-size='16' font-family='Arial, Helvetica, sans-serif'>${initial}</text></svg>`;
                                return `data:image/svg+xml;utf8,${encodeURIComponent(
                                  svg,
                                )}`;
                              }
                              return src;
                            } catch (e) {
                              return chat.otherUser.profileImage;
                            }
                          })()}
                          alt={chat.otherUser.username}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm md:text-lg">
                          {chat.otherUser?.username?.charAt(0)?.toUpperCase() ||
                            "U"}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-sm md:text-base truncate">
                        {chat.otherUser?.username || "User"}
                      </div>
                      {chat.item?.title && (
                        <span className="text-[10px] md:text-xs bg-gray-200 px-2 py-0.5 rounded-full truncate max-w-[100px] ml-2">
                          {chat.item.title}
                        </span>
                      )}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 mt-0.5">
                      {chat.lastMessage?.content ? (
                        <span className="truncate block">
                          {chat.lastMessage.content}
                        </span>
                      ) : (
                        <span className="italic text-gray-400 truncate block">
                          {t("chats.noMessagesYet", {
                            defaultValue: "No messages yet",
                          })}
                        </span>
                      )}
                    </div>
                    {chat.item?.title && (
                      <div className="text-[10px] md:text-xs text-blue-600 mt-1 truncate">
                        {t("chats.aboutPrefix", { defaultValue: "About:" })}{" "}
                        {chat.item.title}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => deleteChat(chat.id, e)}
                    className="absolute right-2 top-2 p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={t("chats.delete", { defaultValue: "Delete" })}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          className={`flex-1 flex flex-col min-w-0 ${
            isMobile && !selectedChat ? "hidden" : "block"
          }`}
        >
          <ChatMessagesDisplay
            currentUserId={currentUserId}
            selectedChat={selectedChat}
            messages={messages}
            isConnected={isConnected}
            isMobile={isMobile}
            onSelectChat={setSelectedChat}
            onRetryFailedMessage={retryFailedMessage}
            onDeleteMessage={handleDeleteMessage}
            onEditMessage={handleUpdateMessage}
            messagesEndRef={messagesEndRef}
          />

          {selectedChat && (
            <ChatInputArea
              selectedChat={selectedChat}
              sending={sending}
              isConnected={isConnected}
              isMobile={isMobile}
              initialMessage={initialMessage}
              onSendMessage={(content) => sendMessage(content)}
            />
          )}
        </div>
      </div>
    </SocketManager>
  );
}
