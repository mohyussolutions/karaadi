"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import io from "socket.io-client";
import {
  MdChat,
  MdSecurity,
  MdRefresh,
  MdArrowBack,
  MdDelete,
  MdMenu,
  MdClose,
} from "react-icons/md";
import { FiUser, FiMessageSquare, FiMail } from "react-icons/fi";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import {
  getAllChats,
  getChatMessages,
  deleteChat,
  deleteMessage,
  Chat,
  Message,
} from "@/actions/core/chatActions";
import { SOCKET_EVENTS, SOCKET_URL } from "@/actions/constant/sockets";

export default function AdminMonitor() {
  const { t } = useTranslation();
  const [socket, setSocket] = useState<any>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile, isMobileMenuOpen]);

  const safeParseDate = (dateString: string | undefined): Date | null => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
    });
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchAllChats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllChats();
      setChats(data);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllChats();
  }, [fetchAllChats]);

  useEffect(() => {
    if (!socket || !selectedChat) return;

    const handleNewMessage = (msg: Message) => {
      if (msg.chatId === selectedChat.id) {
        setMessages((prev) => {
          const isDuplicate = prev.some((m) => m.id === msg.id);
          if (isDuplicate) return prev;
          return [...prev, msg];
        });
      }
      fetchAllChats();
    };

    const handleMessageDeleted = (data: {
      messageId: number;
      chatId: number;
    }) => {
      if (data.chatId === selectedChat.id) {
        setMessages((prev) => prev.filter((msg) => msg.id !== data.messageId));
      }
      fetchAllChats();
    };

    const handleMessageUpdated = (updatedMessage: Message) => {
      if (updatedMessage.chatId === selectedChat.id) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === updatedMessage.id ? updatedMessage : msg,
          ),
        );
      }
    };

    socket.on(SOCKET_EVENTS.ON.RECEIVE_MESSAGE, handleNewMessage);
    socket.on(SOCKET_EVENTS.ON.MESSAGE_DELETED, handleMessageDeleted);
    socket.on(SOCKET_EVENTS.ON.MESSAGE_UPDATED, handleMessageUpdated);

    return () => {
      socket.off(SOCKET_EVENTS.ON.RECEIVE_MESSAGE, handleNewMessage);
      socket.off(SOCKET_EVENTS.ON.MESSAGE_DELETED, handleMessageDeleted);
      socket.off(SOCKET_EVENTS.ON.MESSAGE_UPDATED, handleMessageUpdated);
    };
  }, [socket, selectedChat?.id, fetchAllChats]);

  const handleSelectChat = async (chat: Chat) => {
    setSelectedChat(chat);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
    try {
      const data = await getChatMessages(chat.id, chat.senderId);
      const sortedMessages = data.sort((a, b) => {
        const dateA = safeParseDate(a.createdAt) || new Date(0);
        const dateB = safeParseDate(b.createdAt) || new Date(0);
        return dateA.getTime() - dateB.getTime();
      });
      setMessages(sortedMessages);
      if (socket) {
        socket.emit(SOCKET_EVENTS.EMIT.JOIN_CHAT, chat.id);
      }
    } catch {}
  };

  const handleDeleteChat = async (chatId: number) => {
    if (!confirm("Are you sure?")) return;

    const result = await deleteChat(chatId, "");
    if (result.success) {
      setChats((prev) => prev.filter((chat) => chat.id !== chatId));
      if (selectedChat?.id === chatId) {
        setSelectedChat(null);
        setMessages([]);
      }
    } else {
      alert(
        (result as { success: boolean; error?: string }).error ||
          "Failed to delete chat",
      );
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    const result = await deleteMessage(messageId);
    if (result.success) {
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    } else {
      alert(
        (result as { success: boolean; error?: string }).error ||
          "Failed to delete message",
      );
    }
  };

  const filteredChats = chats.filter((chat) => {
    const matchesSearch =
      chat.sender.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.receiver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.sender.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.receiver.username.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeFilter === "recent") {
      const lastMessageDate = safeParseDate(chat.lastMessageAt);
      if (!lastMessageDate) return matchesSearch;
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      return matchesSearch && lastMessageDate.getTime() > oneDayAgo;
    }
    return matchesSearch;
  });

  const getTimeAgo = (dateString: string | undefined) => {
    const date = safeParseDate(dateString);
    if (!date) return "Just now";

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getLastMessage = (chat: Chat) => {
    if (chat.messages && chat.messages.length > 0) {
      const lastMsg = chat.messages[0];
      return lastMsg.content.length > 50
        ? lastMsg.content.substring(0, 50) + "..."
        : lastMsg.content;
    }
    return "No messages yet";
  };

  const formatMessageTime = (dateString: string | undefined) => {
    const date = safeParseDate(dateString);
    if (!date) return "Invalid time";

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading && chats.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex w-full h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      {isMobile && (
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg md:hidden"
        >
          {isMobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
        </button>
      )}

      <div
        className={`${
          isMobile
            ? `fixed inset-y-0 left-0 z-40 w-80 transform transition-transform duration-300 ease-in-out ${
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
              }`
            : "w-80 md:w-96"
        } h-full border-r border-slate-200 bg-white/80 backdrop-blur-sm flex flex-col shadow-xl`}
      >
        <div className="p-4 md:p-6 border-b border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center">
                  <MdSecurity className="text-white text-lg md:text-xl" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full animate-pulse border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold">{t("adminTable.chatMonitor")}</h1>
                <p className="text-slate-300 text-xs md:text-sm">
                  {t("adminTable.liveTracking")}
                </p>
              </div>
            </div>
            <button
              onClick={fetchAllChats}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <MdRefresh size={18} className="md:size-5" />
            </button>
          </div>
          <div className="space-y-3 md:space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder={t("adminTable.searchChats")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 md:p-3 pl-9 md:pl-10 bg-slate-800/50 border border-slate-700 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <FiMail className="absolute left-2.5 md:left-3 top-2.5 md:top-3.5 text-slate-400" />
            </div>
            <div className="flex gap-2">
              {["all", "recent"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`flex-1 py-1.5 md:py-2 px-2 md:px-3 rounded-lg text-xs md:text-sm font-medium transition-all ${
                    activeFilter === filter
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
                  }`}
                >
                  {filter === "all" ? t("adminTable.allChats") : t("adminTable.recent")}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 md:p-4">
          {filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 md:p-8">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3 md:mb-4">
                <MdChat className="text-slate-400 text-xl md:text-2xl" />
              </div>
              <h3 className="text-slate-700 font-semibold text-sm md:text-base mb-1 md:mb-2">
                {t("adminTable.noChatsFound")}
              </h3>
              <p className="text-slate-500 text-xs md:text-sm">
                {t("adminTable.trySearchFilter")}
              </p>
            </div>
          ) : (
            <div className="space-y-2 md:space-y-3">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleSelectChat(chat)}
                  className={`group p-3 md:p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                    selectedChat?.id === chat.id
                      ? "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 shadow-lg"
                      : "bg-white border-slate-200 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2 md:mb-3">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-700 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-bold">
                        {chat.sender.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="max-w-[120px] md:max-w-[160px]">
                        <h4 className="font-semibold text-slate-800 text-sm md:text-base truncate">
                          {chat.sender.username}
                        </h4>
                        <p className="text-xs text-slate-500 truncate">
                          {chat.sender.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChat(chat.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500"
                    >
                      <MdDelete size={14} className="md:size-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {chat.receiver.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="max-w-[100px] md:max-w-[140px]">
                      <p className="text-sm text-slate-700 font-medium truncate">
                        {chat.receiver.username}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {chat.receiver.email}
                      </p>
                    </div>
                  </div>
                  {chat.lastMessageAt && (
                    <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-slate-100 flex justify-between items-center">
                      <p className="text-xs text-slate-600 truncate flex-1 mr-2">
                        {getLastMessage(chat)}
                      </p>
                      <span className="text-xs text-slate-400 flex-shrink-0">
                        {getTimeAgo(chat.lastMessageAt)}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div
        className={`flex-1 h-full flex flex-col bg-white ${
          isMobile && selectedChat ? "" : ""
        }`}
      >
        {selectedChat ? (
          <>
            <div className="border-b border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-4">
                  {isMobile && (
                    <button
                      onClick={() => setSelectedChat(null)}
                      className="p-1.5 md:p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <MdArrowBack size={18} className="md:size-5" />
                    </button>
                  )}
                  <div className="flex flex-col">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 md:flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {selectedChat.sender.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs md:text-sm font-medium truncate max-w-[120px] md:max-w-none">
                            {selectedChat.sender.username}
                          </span>
                          <span className="text-xs text-slate-300 truncate max-w-[120px] md:max-w-none">
                            {selectedChat.sender.email}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-slate-400 mx-1 md:mx-2">⇄</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {selectedChat.receiver.username
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs md:text-sm font-medium truncate max-w-[120px] md:max-w-none">
                            {selectedChat.receiver.username}
                          </span>
                          <span className="text-xs text-slate-300 truncate max-w-[120px] md:max-w-none">
                            {selectedChat.receiver.email}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-1 md:mt-2 flex flex-wrap items-center gap-1 md:gap-2">
                      <span className="text-xs font-mono bg-emerald-900/50 px-2 py-0.5 md:py-1 rounded">
                        Chat ID: {selectedChat.id}
                      </span>
                      {selectedChat.lastMessageAt && (
                        <span className="text-xs text-slate-300">
                          Last: {getTimeAgo(selectedChat.lastMessageAt)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteChat(selectedChat.id)}
                  className="px-3 py-1.5 md:px-4 md:py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-xs md:text-sm transition-colors"
                >
                  {isMobile ? t("adminTable.delete") : t("adminTable.delete") + " Chat"}
                </button>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 md:space-y-6 bg-slate-50"
            >
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <FiMessageSquare className="text-slate-300 text-3xl md:text-4xl mb-2" />
                  <p className="text-slate-500 text-sm md:text-base">
                    {t("adminTable.noMessages")}
                  </p>
                </div>
              ) : (
                messages.map((message) => {
                  const isSender = message.senderId === selectedChat.senderId;
                  const senderEmail = isSender
                    ? selectedChat.sender.email
                    : selectedChat.receiver.email;
                  const senderUsername = isSender
                    ? selectedChat.sender.username
                    : selectedChat.receiver.username;

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isSender ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`p-3 md:p-4 rounded-2xl max-w-[90%] md:max-w-[80%] min-w-0 ${
                          isSender
                            ? "bg-white border border-slate-200 text-slate-800 shadow-sm"
                            : "bg-blue-600 text-white shadow-md"
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-1 md:mb-2 gap-1 md:gap-0">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                isSender
                                  ? "bg-slate-700 text-white"
                                  : "bg-blue-800 text-white"
                              }`}
                            >
                              {senderUsername.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center gap-0 md:gap-2">
                              <span
                                className={`text-xs md:text-sm font-medium ${
                                  isSender ? "text-slate-700" : "text-blue-100"
                                }`}
                              >
                                {senderUsername}
                              </span>
                              <span
                                className={`text-xs ${
                                  isSender ? "text-slate-500" : "text-blue-200"
                                }`}
                              >
                                ({senderEmail})
                              </span>
                            </div>
                          </div>
                          <span
                            className={`text-xs ${
                              isSender ? "text-slate-400" : "text-blue-200"
                            }`}
                          >
                            {formatMessageTime(message.createdAt)}
                          </span>
                        </div>
                        <div className="mb-1">
                          <p className="text-sm leading-relaxed break-words">
                            {message.content}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-1 md:mt-2 pt-1 md:pt-2 border-t border-opacity-20">
                          <span
                            className={`text-xs ${
                              isSender ? "text-slate-400" : "text-blue-200"
                            }`}
                          >
                            ID: {message.id}
                          </span>
                          <button
                            onClick={() => handleDeleteMessage(message.id)}
                            className={`text-xs px-2 py-0.5 md:py-1 rounded ${
                              isSender
                                ? "text-slate-400 hover:text-red-500 hover:bg-red-50"
                                : "text-blue-200 hover:text-red-300 hover:bg-blue-700"
                            }`}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
            <div className="relative mb-4 md:mb-6">
              <div className="absolute -inset-3 md:-inset-4 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full blur-xl opacity-20"></div>
              <MdSecurity className="relative text-slate-300 text-4xl md:text-6xl" />
            </div>
            <h2 className="text-lg md:text-2xl font-bold text-slate-800 mb-1 md:mb-2 text-center">
              {t("adminTable.chatMonitorActive")}
            </h2>
            <p className="text-slate-500 text-center mb-4 md:mb-6 text-sm md:text-base">
              {t("adminTable.selectChatSidebar")}
            </p>
            <div className="grid grid-cols-3 gap-2 md:gap-4 text-center w-full max-w-md">
              <div className="bg-slate-50 p-2 md:p-4 rounded-lg">
                <div className="text-emerald-600 font-bold text-lg md:text-xl">
                  {chats.length}
                </div>
                <div className="text-slate-600 text-xs md:text-sm">
                  {t("adminTable.totalChats")}
                </div>
              </div>
              <div className="bg-slate-50 p-2 md:p-4 rounded-lg">
                <div className="text-blue-600 font-bold text-lg md:text-xl">
                  {
                    chats.filter(
                      (c) =>
                        c.lastMessageAt &&
                        Date.now() - new Date(c.lastMessageAt).getTime() <
                          3600000,
                    ).length
                  }
                </div>
                <div className="text-slate-600 text-xs md:text-sm">
                  {t("adminTable.activeNow")}
                </div>
              </div>
              <div className="bg-slate-50 p-2 md:p-4 rounded-lg">
                <div className="text-purple-600 font-bold text-lg md:text-xl">
                  {chats.reduce(
                    (acc, chat) => acc + (chat.messages?.length || 0),
                    0,
                  )}
                </div>
                <div className="text-slate-600 text-xs md:text-sm">
                  {t("adminTable.totalMessages")}
                </div>
              </div>
            </div>
            {isMobile && !isMobileMenuOpen && (
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="mt-6 px-4 py-2 bg-slate-900 text-white rounded-lg shadow-lg"
              >
                {t("adminTable.openChatList")}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
