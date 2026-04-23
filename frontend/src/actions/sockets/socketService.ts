import { io, Socket } from "socket.io-client";
import { SOCKET_EVENTS } from "../constant/sockets";

type EventCallback = (data?: unknown) => void;

class SocketService {
  private static instance: SocketService | null = null;
  private socket: Socket | null = null;
  private eventListeners: Map<string, Set<EventCallback>> = new Map();
  private isConnecting = false;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private readonly socketUrl: string;

  private constructor() {
    this.socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:8080";
  }

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect(userId: string): void {
    if (!userId) return;
    if (this.socket?.connected) return;
    if (this.isConnecting) return;

    this.isConnecting = true;

    this.socket = io(this.socketUrl, {
      auth: { userId },
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.emitEvent("connect");
    });

    this.socket.on("disconnect", (reason: string) => {
      this.emitEvent("disconnect", { reason });
    });

    this.socket.on("connect_error", (error: Error) => {
      this.reconnectAttempts++;
      this.emitEvent("error", { error: error.message });
    });

    this.socket.on("reconnect_failed", () => {
      this.isConnecting = false;
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
      SOCKET_EVENTS.ON.MESSAGE_DELETED,
      SOCKET_EVENTS.ON.MESSAGE_UPDATED,
      "wanted_match",
      "i_have_this",
      "newNotification",
      "subscription_match",
      "notification",
    ];

    events.forEach((event) => {
      this.socket?.on(event, (data?: unknown) => {
        this.emitEvent(event, data);
      });
    });
  }

  on(event: string, callback: EventCallback): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)?.add(callback);
    return () => this.off(event, callback);
  }

  off(event: string, callback: EventCallback): void {
    const callbacks = this.eventListeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.eventListeners.delete(event);
      }
    }
  }

  private emitEvent(event: string, data?: unknown): void {
    const callbacks = this.eventListeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(data);
        } catch {}
      });
    }
  }

  private emit(event: string, data?: unknown): void {
    if (!this.socket?.connected) return;
    this.socket.emit(event, data);
  }

  joinChat(chatId: number): void {
    this.emit(SOCKET_EVENTS.EMIT.JOIN_CHAT, chatId);
  }

  leaveChat(chatId: number): void {
    this.emit(SOCKET_EVENTS.EMIT.LEAVE_CHAT, chatId);
  }

  sendMessage(data: {
    chatId: number;
    content: string;
    imageUrl?: string;
  }): void {
    if (!data.content?.trim() && !data.imageUrl) return;
    this.emit(SOCKET_EVENTS.EMIT.SEND_MESSAGE, data);
  }

  sendTyping(chatId: number, isTyping: boolean): void {
    this.emit(SOCKET_EVENTS.EMIT.TYPING, { chatId, isTyping });
  }

  markAsRead(chatId: number): void {
    this.emit(SOCKET_EVENTS.EMIT.MARK_AS_READ, { chatId });
  }

  markMultipleAsRead(messageIds: number[]): void {
    if (!messageIds.length) return;
    this.emit(SOCKET_EVENTS.EMIT.MARK_MULTIPLE_AS_READ, { messageIds });
  }

  getOnlineStatus(chatId: number): void {
    this.emit(SOCKET_EVENTS.EMIT.GET_ONLINE_STATUS, chatId);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.eventListeners.clear();
    SocketService.instance = null;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocketId(): string | undefined {
    return this.socket?.id;
  }
}

export const socketService = SocketService.getInstance();
