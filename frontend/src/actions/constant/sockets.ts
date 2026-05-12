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

const url = (path: string) => `${BASE_API_URL}${path}`;

const API_PATHS = {
  CHATS: "/api/chats",
  MESSAGES: "/api/messages",
  USERS: "/api/users",
  CONTACT: "/api/contactUs",
  VISITORS: "/api/visitors",
  SUBSCRIPTION: "/api/subscription",
  NOTIFICATIONS: "/api/notifications",
} as const;


export const CHATS = {
  CREATE: url(`${API_PATHS.CHATS}/create`),
  ADMIN_ALL: url(`${API_PATHS.CHATS}/admin/all`),
  USER_CHATS: (userId: string) => url(`${API_PATHS.CHATS}/user/${userId}`),
  CHAT_BY_ID: (chatId: number, userId: string) =>
    url(`${API_PATHS.CHATS}/${chatId}?userId=${userId}`),
  CHAT_MESSAGES: (chatId: number, userId: string) =>
    url(`${API_PATHS.CHATS}/${chatId}/messages?userId=${userId}`),
  DELETE: (chatId: number, userId: string) =>
    url(`${API_PATHS.CHATS}/${chatId}?userId=${userId}`),
  UPDATE_CHAT: (chatId: number) => url(`${API_PATHS.CHATS}/${chatId}`),
  ARCHIVED_CHATS: (userId: string) =>
    url(`${API_PATHS.CHATS}/user/${userId}/archived`),
  FIND_CONVERSATION: (
    userId: string,
    otherUserId: string,
    itemId: string,
    itemModel: string,
  ) =>
    url(
      `${API_PATHS.CHATS}/conversation/find?userId=${userId}&otherUserId=${otherUserId}&itemId=${itemId}&itemModel=${itemModel}`,
    ),
} as const;

export const MESSAGES = {
  SEND: url(`${API_PATHS.MESSAGES}/send`),
  DELETE_MESSAGE: (messageId: number) =>
    url(`${API_PATHS.MESSAGES}/${messageId}`),
  UPDATE_MESSAGE: (messageId: number) =>
    url(`${API_PATHS.MESSAGES}/${messageId}`),
  UNREAD_COUNT: (userId: string) =>
    url(`${API_PATHS.MESSAGES}/unread/${userId}`),
  MARK_READ_ALL: (chatId: number) =>
    url(`${API_PATHS.MESSAGES}/${chatId}/read-all`),
  REPLY_TO_MESSAGE: (messageId: number) =>
    url(`${API_PATHS.MESSAGES}/${messageId}/reply`),
  GET_MESSAGE_REPLIES: (messageId: number, userId: string) =>
    url(`${API_PATHS.MESSAGES}/${messageId}/replies?userId=${userId}`),
} as const;

export const USERS_COMM = {
  VERIFY_SESSION: url(`${API_PATHS.USERS}/verify-session`),
  PROFILE: (userId: string) => url(`${API_PATHS.USERS}/${userId}`),
  UPDATE_PROFILE: (userId: string) => url(`${API_PATHS.USERS}/${userId}`),
  SEARCH: (query: string) =>
    url(`${API_PATHS.USERS}/search?q=${encodeURIComponent(query)}`),
} as const;

export const CONTACT = {
  STATS: url(`${API_PATHS.CONTACT}/stats`),
  CREATE_TICKET: url(`${API_PATHS.CONTACT}/tickets`),
  GET_TICKETS: url(`${API_PATHS.CONTACT}/tickets`),
  UPDATE_TICKET: (ticketId: string) =>
    url(`${API_PATHS.CONTACT}/tickets/${ticketId}`),
} as const;

export const VISITORS = {
  TRACK_USER: url(`${API_PATHS.VISITORS}/track-user`),
  ANALYTICS: url(`${API_PATHS.VISITORS}/analytics`),
} as const;

export const SUBSCRIPTION_ENDPOINTS = {
  BASE: url(API_PATHS.SUBSCRIPTION),
  CREATE_SUBSCRIPTION: url(API_PATHS.SUBSCRIPTION),
  TRIGGER_NOTIFICATION: url(`${API_PATHS.SUBSCRIPTION}/notify`),
  GET_USER_SUBSCRIPTIONS: (userId: string) =>
    url(`${API_PATHS.SUBSCRIPTION}/${userId}`),
  DELETE_SUBSCRIPTION: (id: string) => url(`${API_PATHS.SUBSCRIPTION}/${id}`),
} as const;

const notif = (path: string) => url(`${API_PATHS.NOTIFICATIONS}${path}`);

export const NOTIFICATION_ENDPOINTS = {
  CREATE_NOTIFICATION: notif(""),
  GET_NOTIFICATIONS_BY_USER: (userId: string) => notif(`/user/${userId}`),
  MARK_ALL_NOTIFICATIONS_READ: (userId: string) =>
    notif(`/user/${userId}/read-all`),
  CLEAR_ALL_NOTIFICATIONS: (userId: string) =>
    notif(`/user/${userId}/clear-all`),
  GET_NOTIFICATION_STATS: (userId: string) => notif(`/user/${userId}/stats`),
  MARK_DELIVERED: (userId: string) => notif(`/user/${userId}/delivered`),
  GET_UNREAD_COUNT: (userId: string) => notif(`/user/${userId}/unread-count`),
  GET_CATEGORY_COUNTS: (userId: string) => notif(`/user/${userId}/categories`),
  MARK_NOTIFICATION_READ: (id: string) => notif(`/${id}/read`),
  DELETE_NOTIFICATION: (id: string) => notif(`/${id}`),
  GET_SUBSCRIPTION_NOTIFICATIONS: (subscriptionId: string) =>
    notif(`/subscription/${subscriptionId}`),
} as const;

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
