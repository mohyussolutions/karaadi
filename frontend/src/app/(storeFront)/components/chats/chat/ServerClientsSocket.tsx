import { SOCKET_EVENTS, SOCKET_URL } from "@/actions/constant/sockets";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface SocketManagerProps {
  currentUserId: string;
  selectedChat: any;
  isConnected: boolean;
  socket: Socket | null;
  onSocketReady: (socket: Socket, isConnected: boolean) => void;
  onReceiveMessage: (message: any) => void;
  onMessageSent: (message: any) => void;
  onMessageSaved: (data: any) => void;
  children: React.ReactNode;
}

export default function SocketManager({
  currentUserId,
  selectedChat,
  isConnected,
  socket,
  onSocketReady,
  onReceiveMessage,
  onMessageSent,
  onMessageSaved,
  children,
}: SocketManagerProps) {
  const messageIdsRef = useRef<Set<number>>(new Set());
  const recentlySentRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!currentUserId) return;

    const newSocket = io(SOCKET_URL, {
      auth: { userId: currentUserId },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      onSocketReady(newSocket, true);
    });

    newSocket.on("disconnect", () => {
      onSocketReady(newSocket, false);
    });

    newSocket.on("connect_error", () => {
      onSocketReady(newSocket, false);
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [currentUserId]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message: any) => {
      if (!message || !message.chatId) return;

      if (selectedChat && message.chatId !== selectedChat.id) return;

      if (message.id && messageIdsRef.current.has(message.id)) return;
      if (message.id && recentlySentRef.current.has(message.id)) return;

      if (message.id) {
        messageIdsRef.current.add(message.id);
      }

      onReceiveMessage(message);
    };

    const handleMessageSent = (data: any) => {
      if (data.messageId) {
        recentlySentRef.current.add(data.messageId);
        setTimeout(() => {
          recentlySentRef.current.delete(data.messageId);
        }, 3000);
      }

      onMessageSent(data);
    };

    const handleSendMessageError = (error: any) => {
      console.error("Send message error:", error);
    };

    const handleChatError = (error: any) => {
      console.error("Chat error:", error);
    };

    socket.on(SOCKET_EVENTS.ON.RECEIVE_MESSAGE, handleReceiveMessage);
    socket.on(SOCKET_EVENTS.ON.MESSAGE_SENT, handleMessageSent);
    socket.on(SOCKET_EVENTS.ON.SEND_MESSAGE_ERROR, handleSendMessageError);
    socket.on(SOCKET_EVENTS.ON.CHAT_ERROR, handleChatError);
    socket.on(SOCKET_EVENTS.ON.NEW_MESSAGE, handleReceiveMessage);

    if (isConnected && selectedChat) {
      socket.emit(SOCKET_EVENTS.EMIT.JOIN_CHAT, selectedChat.id);
    }

    return () => {
      socket.off(SOCKET_EVENTS.ON.RECEIVE_MESSAGE, handleReceiveMessage);
      socket.off(SOCKET_EVENTS.ON.MESSAGE_SENT, handleMessageSent);
      socket.off(SOCKET_EVENTS.ON.SEND_MESSAGE_ERROR, handleSendMessageError);
      socket.off(SOCKET_EVENTS.ON.CHAT_ERROR, handleChatError);
      socket.off(SOCKET_EVENTS.ON.NEW_MESSAGE, handleReceiveMessage);

      if (selectedChat) {
        socket.emit(SOCKET_EVENTS.EMIT.LEAVE_CHAT, selectedChat.id);
      }
    };
  }, [socket, selectedChat, isConnected]);

  return <>{children}</>;
}
