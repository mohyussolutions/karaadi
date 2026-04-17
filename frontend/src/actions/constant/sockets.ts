import { io, Socket } from "socket.io-client";

import { BASE_API_URL } from "./BASE_API_URL";

export const SOCKET_URL = BASE_API_URL;

export const SOCKET_EVENTS = {
  EMIT: {
    JOIN_CHAT: "joinChat",
    LEAVE_CHAT: "leaveChat",
    SEND_MESSAGE: "sendMessage",
    TYPING: "typing",
    MARK_AS_READ: "markAsRead",
    MARK_MULTIPLE_AS_READ: "markMultipleAsRead",
    GET_ONLINE_STATUS: "getOnlineStatus",
    SUBSCRIBE_NOTIFICATION: "subscribeNotification",
    UNSUBSCRIBE_NOTIFICATION: "unsubscribeNotification",
  },
  ON: {
    CHAT_HISTORY: "chatHistory",
    RECEIVE_MESSAGE: "receiveMessage",
    NEW_MESSAGE: "newMessage",
    MESSAGE_SENT: "messageSent",
    USER_TYPING: "userTyping",
    MESSAGE_READ: "messageRead",
    MESSAGES_READ: "messagesRead",
    MESSAGES_MARKED_AS_READ: "messagesMarkedAsRead",
    ONLINE_STATUS: "onlineStatus",
    UNREAD_COUNT_UPDATE: "unreadCountUpdate",
    SEND_MESSAGE_ERROR: "sendMessageError",
    CHAT_ERROR: "chatError",
    ERROR: "error",
    MESSAGE_DELETED: "messageDeleted",
    MESSAGE_UPDATED: "messageUpdated",
  },
} as const;

type SocketMessageData = Record<string, unknown>;

let socketInstance: Socket | null = null;

export const createSocket = (userId: string): Socket => {
  if (socketInstance?.connected) {
    return socketInstance;
  }

  socketInstance = io(BASE_API_URL, {
    auth: { userId },
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 10000,
  });

  return socketInstance;
};

export const disconnectSocket = (): void => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

const createEndpoint = (path: string): string => `${BASE_API_URL}${path}`;

const createUserEndpoint = (base: string, userId: string): string =>
  `${BASE_API_URL}${base}/${userId}`;

const createChatEndpoint = (
  base: string,
  chatId: number,
  userId: string,
): string => `${BASE_API_URL}${base}/${chatId}?userId=${userId}`;

const API_PATHS = {
  CHATS: {
    BASE: "/api/chats",
    CREATE: "/api/chats/create",
    ADMIN_ALL: "/api/chats/admin/all",
  },
  MESSAGES: {
    BASE: "/api/messages",
    SEND: "/api/messages/send",
  },
  USERS: {
    BASE: "/api/users",
    VERIFY_SESSION: "/api/users/verify-session",
  },
  CONTACT: {
    BASE: "/api/contactUs",
    STATS: "/api/contactUs/stats",
    TICKETS: "/api/contactUs/tickets",
  },
  VISITORS: {
    BASE: "/api/visitors",
    TRACK_USER: "/api/visitors/track-user",
    ANALYTICS: "/api/visitors/analytics",
  },
  SUBSCRIPTION: {
    BASE: "/api/subscription",
    NOTIFY: "/api/subscription/notify",
  },
  NOTIFICATIONS: {
    BASE: "/api/notifications",
    CREATE: "/api/notifications",
  },
} as const;

export const CHATS = {
  CREATE: createEndpoint(API_PATHS.CHATS.CREATE),
  USER_CHATS: (userId: string) =>
    createUserEndpoint(API_PATHS.CHATS.BASE, userId),
  CHAT_BY_ID: (chatId: number, userId: string) =>
    createChatEndpoint(API_PATHS.CHATS.BASE, chatId, userId),
  CHAT_MESSAGES: (chatId: number, userId: string) =>
    createChatEndpoint(
      `${API_PATHS.CHATS.BASE}/${chatId}/messages`,
      chatId,
      userId,
    ),
  DELETE: (chatId: number, userId: string) =>
    createChatEndpoint(API_PATHS.CHATS.BASE, chatId, userId),
  FIND_CONVERSATION: (
    userId: string,
    otherUserId: string,
    itemId: string,
    itemModel: string,
  ) =>
    `${BASE_API_URL}${API_PATHS.CHATS.BASE}/conversation/find?userId=${userId}&otherUserId=${otherUserId}&itemId=${itemId}&itemModel=${itemModel}`,
  UPDATE_CHAT: (chatId: number) =>
    `${BASE_API_URL}${API_PATHS.CHATS.BASE}/${chatId}`,
  ARCHIVED_CHATS: (userId: string) =>
    `${BASE_API_URL}${API_PATHS.CHATS.BASE}/user/${userId}/archived`,
  ADMIN_ALL: createEndpoint(API_PATHS.CHATS.ADMIN_ALL),
};

export const MESSAGES = {
  SEND: createEndpoint(API_PATHS.MESSAGES.SEND),
  DELETE_MESSAGE: (messageId: number) =>
    `${BASE_API_URL}${API_PATHS.MESSAGES.BASE}/${messageId}`,
  UPDATE_MESSAGE: (messageId: number) =>
    `${BASE_API_URL}${API_PATHS.MESSAGES.BASE}/${messageId}`,
  UNREAD_COUNT: (userId: string) =>
    `${BASE_API_URL}${API_PATHS.MESSAGES.BASE}/unread/${userId}`,
  MARK_READ_ALL: (chatId: number) =>
    `${BASE_API_URL}${API_PATHS.MESSAGES.BASE}/${chatId}/read-all`,
  REPLY_TO_MESSAGE: (messageId: number) =>
    `${BASE_API_URL}${API_PATHS.MESSAGES.BASE}/${messageId}/reply`,
  GET_MESSAGE_REPLIES: (messageId: number, userId: string) =>
    `${BASE_API_URL}${API_PATHS.MESSAGES.BASE}/${messageId}/replies?userId=${userId}`,
};

export const USERS_COMM = {
  VERIFY_SESSION: createEndpoint(API_PATHS.USERS.VERIFY_SESSION),
  PROFILE: (userId: string) => createUserEndpoint(API_PATHS.USERS.BASE, userId),
  UPDATE_PROFILE: (userId: string) =>
    createUserEndpoint(API_PATHS.USERS.BASE, userId),
  SEARCH: (query: string) =>
    `${BASE_API_URL}${API_PATHS.USERS.BASE}/search?q=${encodeURIComponent(query)}`,
};

export const CONTACT = {
  STATS: createEndpoint(API_PATHS.CONTACT.STATS),
  CREATE_TICKET: createEndpoint(API_PATHS.CONTACT.TICKETS),
  GET_TICKETS: createEndpoint(API_PATHS.CONTACT.TICKETS),
  UPDATE_TICKET: (ticketId: string) =>
    `${BASE_API_URL}${API_PATHS.CONTACT.TICKETS}/${ticketId}`,
};

export const VISITORS = {
  TRACK_USER: createEndpoint(API_PATHS.VISITORS.TRACK_USER),
  ANALYTICS: createEndpoint(API_PATHS.VISITORS.ANALYTICS),
};

export const SUBSCRIPTION_ENDPOINTS = {
  BASE: createEndpoint(API_PATHS.SUBSCRIPTION.BASE),
  CREATE_SUBSCRIPTION: createEndpoint(API_PATHS.SUBSCRIPTION.BASE),
  GET_USER_SUBSCRIPTIONS: (userId: string) =>
    createUserEndpoint(API_PATHS.SUBSCRIPTION.BASE, userId),
  DELETE_SUBSCRIPTION: (id: string) =>
    `${BASE_API_URL}${API_PATHS.SUBSCRIPTION.BASE}/${id}`,
  TRIGGER_NOTIFICATION: createEndpoint(API_PATHS.SUBSCRIPTION.NOTIFY),
};

export const NOTIFICATION_ENDPOINTS = {
  GET_NOTIFICATIONS_BY_USER: (userId: string) =>
    `${BASE_API_URL}${API_PATHS.NOTIFICATIONS.BASE}/user/${userId}`,
  MARK_NOTIFICATION_READ: (id: string) =>
    `${BASE_API_URL}${API_PATHS.NOTIFICATIONS.BASE}/${id}/read`,
  MARK_ALL_NOTIFICATIONS_READ: (userId: string) =>
    `${BASE_API_URL}${API_PATHS.NOTIFICATIONS.BASE}/user/${userId}/read-all`,
  DELETE_NOTIFICATION: (id: string) =>
    `${BASE_API_URL}${API_PATHS.NOTIFICATIONS.BASE}/${id}`,
  CLEAR_ALL_NOTIFICATIONS: (userId: string) =>
    `${BASE_API_URL}${API_PATHS.NOTIFICATIONS.BASE}/user/${userId}/clear-all`,
  GET_NOTIFICATION_STATS: (userId: string) =>
    `${BASE_API_URL}${API_PATHS.NOTIFICATIONS.BASE}/user/${userId}/stats`,
  MARK_DELIVERED: (userId: string) =>
    `${BASE_API_URL}${API_PATHS.NOTIFICATIONS.BASE}/user/${userId}/delivered`,
  GET_SUBSCRIPTION_NOTIFICATIONS: (subscriptionId: string) =>
    `${BASE_API_URL}${API_PATHS.NOTIFICATIONS.BASE}/subscription/${subscriptionId}`,
  CREATE_NOTIFICATION: createEndpoint(API_PATHS.NOTIFICATIONS.CREATE),
  GET_UNREAD_COUNT: (userId: string) =>
    `${BASE_API_URL}${API_PATHS.NOTIFICATIONS.BASE}/user/${userId}/unread-count`,
  GET_CATEGORY_COUNTS: (userId: string) =>
    `${BASE_API_URL}${API_PATHS.NOTIFICATIONS.BASE}/user/${userId}/categories`,
};

export const API_ENDPOINTS = {
  CHATS,
  MESSAGES,
  NOTIFICATIONS: NOTIFICATION_ENDPOINTS,
  USERS: USERS_COMM,
  CONTACT,
  VISITORS,
  SUBSCRIPTION: SUBSCRIPTION_ENDPOINTS,
} as const;

export type ApiEndpoints = typeof API_ENDPOINTS;
