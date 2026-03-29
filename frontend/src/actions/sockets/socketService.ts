import { io, Socket } from "socket.io-client";
import { SOCKET_EVENTS } from "../constant/communicationEndpoints";
class SocketService {
  private socket: Socket | null = null;
  private eventListeners: Map<string, Function[]> = new Map();

  connect(userId: string) {
    if (this.socket?.connected) {
      console.log("Socket already connected");
      return;
    }

    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:9000";

    this.socket = io(socketUrl, {
      auth: { userId },
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    this.socket.on("connect", () => {
      console.log("Socket connected:", this.socket?.id);
      this.emitEvent("connect");
    });

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
      this.emitEvent("disconnect");
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      this.emitEvent("error", { error: error.message });
    });

    const events = [
      SOCKET_EVENTS.ON.CHAT_HISTORY,
      SOCKET_EVENTS.ON.RECEIVE_MESSAGE,
      SOCKET_EVENTS.ON.NEW_MESSAGE,
      SOCKET_EVENTS.ON.MESSAGE_SENT,
      SOCKET_EVENTS.ON.USER_TYPING,
      SOCKET_EVENTS.ON.ONLINE_STATUS,
      SOCKET_EVENTS.ON.MESSAGE_READ,
      SOCKET_EVENTS.ON.MESSAGES_READ,
      SOCKET_EVENTS.ON.MESSAGES_MARKED_AS_READ,
      SOCKET_EVENTS.ON.UNREAD_COUNT_UPDATE,
      SOCKET_EVENTS.ON.SEND_MESSAGE_ERROR,
      SOCKET_EVENTS.ON.CHAT_ERROR,
      SOCKET_EVENTS.ON.ERROR,
    ];

    events.forEach((event) => {
      this.socket?.on(event, (data: any) => {
        this.emitEvent(event, data);
      });
    });
  }

  on(event: string, callback: (data: any) => void) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)?.push(callback);
  }

  off(event: string, callback: (data: any) => void) {
    const callbacks = this.eventListeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emitEvent(event: string, data?: any) {
    const callbacks = this.eventListeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  joinChat(chatId: number) {
    this.socket?.emit(SOCKET_EVENTS.EMIT.JOIN_CHAT, chatId);
  }

  leaveChat(chatId: number) {
    this.socket?.emit(SOCKET_EVENTS.EMIT.LEAVE_CHAT, chatId);
  }

  sendMessage(data: { chatId: number; content: string; imageUrl?: string }) {
    this.socket?.emit(SOCKET_EVENTS.EMIT.SEND_MESSAGE, data);
  }

  sendTyping(chatId: number, isTyping: boolean) {
    this.socket?.emit(SOCKET_EVENTS.EMIT.TYPING, { chatId, isTyping });
  }

  markAsRead(messageId: number) {
    this.socket?.emit(SOCKET_EVENTS.EMIT.MARK_AS_READ, messageId);
  }

  markMultipleAsRead(messageIds: number[]) {
    this.socket?.emit(SOCKET_EVENTS.EMIT.MARK_MULTIPLE_AS_READ, { messageIds });
  }

  getOnlineStatus(chatId: number) {
    this.socket?.emit(SOCKET_EVENTS.EMIT.GET_ONLINE_STATUS, chatId);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.eventListeners.clear();
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocketId(): string | undefined {
    return this.socket?.id;
  }
}

export const socketService = new SocketService();
