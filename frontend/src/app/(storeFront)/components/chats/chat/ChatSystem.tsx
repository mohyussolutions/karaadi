"use client";

import { useState, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import Image from "next/image";
import SocketManager from "./ServerClientsSocket";
import ChatMessagesDisplay from "./ChatMessagesDisplay";
import ChatInputArea from "./InputTextarea";
import { Trash2 } from "lucide-react";
import { ChatSystemProps } from "@/app/utils/types/chat";
import { API_ENDPOINTS } from "@/actions/constant/sockets";
import { SOCKET_EVENTS } from "@/actions/constant/communicationEndpoints";

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

  const messagesEndRef = useRef<HTMLDivElement>(null);
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
        );
        if (response.ok) {
          const existingChats = await response.json();
          setChats(existingChats);
          let chatToSelect = null;

          if (initialChatId) {
            const urlChat = existingChats.find(
              (chat: any) => chat.id === initialChatId,
            );
            if (urlChat) chatToSelect = urlChat;
          }

          if (!chatToSelect && sellerId && itemId) {
            const existingChat = existingChats.find(
              (chat: any) =>
                chat.otherUser?.id === sellerId && chat.item?.id === itemId,
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
                );
                if (findResponse.ok) {
                  const foundChat = await findResponse.json();
                  if (foundChat) {
                    chatToSelect = foundChat;
                    setChats((prev) => {
                      const exists = prev.some(
                        (chat) => chat.id === foundChat.id,
                      );
                      if (!exists) return [...prev, foundChat];
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
              } catch (error) {
                createNewChat();
                return;
              }
            }
          }

          if (!chatToSelect && existingChats.length > 0) {
            chatToSelect = existingChats[0];
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
      } catch (error) {
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
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const createNewChat = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.CHATS.CREATE, {
        method: "POST",
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
          otherUser: {
            id: sellerId!,
            username: result.chat.receiver?.username || "Seller",
            profileImage: result.chat.receiver?.profileImage || "/user.jpg",
          },
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
    } catch (error) {
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

    const tempMessage = {
      tempId,
      content: messageContent,
      senderId: currentUserId,
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: targetChatId,
          content: messageContent,
          senderId: currentUserId,
          receiverId: selectedChat?.otherUser?.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`,
        );
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
          msg.tempId === tempId
            ? {
                ...savedMessage,
                status: "sent",
              }
            : msg,
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
            ? {
                ...msg,
                status: "failed",
                error:
                  error instanceof Error ? error.message : "Failed to send",
              }
            : msg,
        ),
      );
    } finally {
      setSending(false);
    }
  };

  const deleteChat = async (chatId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this chat?")) return;
    try {
      const response = await fetch(
        API_ENDPOINTS.CHATS.DELETE(chatId, currentUserId),
        { method: "DELETE" },
      );
      if (response.ok) {
        setChats((prev) => prev.filter((chat) => chat.id !== chatId));
        if (selectedChat?.id === chatId) {
          setSelectedChat(null);
          setMessages([]);
          if (onChatChange) onChatChange(0);
        }
      }
    } catch (error) {}
  };

  const handleDeleteMessage = async (messageId: number | string) => {
    try {
      const response = await fetch(
        API_ENDPOINTS.MESSAGES.DELETE_MESSAGE(Number(messageId)),
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUserId }),
        },
      );

      if (response.ok) {
        setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
        messageIdsRef.current.delete(Number(messageId));
      }
    } catch (error) {}
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: newContent, userId: currentUserId }),
        },
      );

      if (response.ok) {
        const updatedMsg = await response.json();
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...msg, content: newContent, isEdited: true }
              : msg,
          ),
        );
      }
    } catch (error) {}
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
            ? {
                ...data.message,
                status: "sent",
              }
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
      socket.emit(SOCKET_EVENTS.EMIT.MARK_AS_READ, {
        chatId: chat.id,
      });
    }
  };

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
      <div className="flex h-[calc(100vh-180px)] md:h-[calc(100vh-200px)] border rounded-lg overflow-hidden bg-white">
        {(!isMobile || !selectedChat) && (
          <div
            className={`${
              isMobile ? "absolute inset-0 z-10 bg-white" : "w-full md:w-80"
            } border-r bg-gray-50 flex flex-col`}
          >
            <div className="p-3 md:p-4 border-b bg-white flex items-center justify-between">
              <div>
                <h2 className="text-lg md:text-xl font-bold">Your Chats</h2>
                <p className="text-xs md:text-sm text-gray-500">
                  {chats.length} conversation{chats.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleSelectChat(chat)}
                  className={`w-full p-3 md:p-4 text-left border-b hover:bg-gray-100 transition-colors flex items-center group relative cursor-pointer ${
                    selectedChat?.id === chat.id
                      ? "bg-blue-50 border-blue-200"
                      : "bg-white"
                  }`}
                >
                  <div className="relative mr-2 md:mr-3 flex-shrink-0">
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-full overflow-hidden bg-blue-100">
                      {chat.otherUser?.profileImage ? (
                        <Image
                          src={chat.otherUser.profileImage || "/user.jpg"}
                          alt={chat.otherUser.username}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm md:text-lg">
                          {chat.otherUser?.username?.charAt(0)?.toUpperCase() ||
                            "U"}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="font-semibold text-sm md:text-base truncate">
                      {chat.otherUser?.username || "User"}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 truncate">
                      {chat.item?.title || "Product conversation"}
                    </div>
                  </div>
                  <button
                    onClick={(e) => deleteChat(chat.id, e)}
                    className="absolute right-2 top-2 p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 opacity-0 group-hover:opacity-100 transition-opacity"
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
